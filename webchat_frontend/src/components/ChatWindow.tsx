import { useEffect, useRef, useState } from "react";
import type { Contact } from "../pages/ChatPage";
import { getConnection } from "../connection_services/signalR";
import { WebchatApiService } from "../services/services/WebchatApiService";

interface Props {
    contact: Contact | null;
    currentUserId: string;
}

export interface ChatMessage {
    id: string;
    senderId: string;
    conversationId: string;
    content: string;
    sentAt: string;
    status: number;
}

export default function ChatWindow({
    contact,
    currentUserId,
}: Props) {

    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [text, setText] = useState("");
    const [conversationId, setConversationId] = useState<string | null>(null);

    const bottomRef = useRef<HTMLDivElement>(null);

    // Load conversation history
    const loadMessages = async () => {
        if (!contact) return;

        try {
            const history = await WebchatApiService.getApiMessages(contact.id);

            setMessages(history);

            if (history.length > 0) {
                console.log("Loaded conversation:", history[0].conversationId);
                setConversationId(history[0].conversationId);

            } else {
                console.log("Conversation has no messages yet.");
                setConversationId(null);
            }

            const connection = getConnection();

            if (connection) {
                for (const message of history) {
                    if (
                        message.senderId !== currentUserId &&
                        message.status !== 2
                    ) {

                        try {
                            console.log("Marking message as seen:", message.id);
                            await connection.invoke(
                                "MessageSeen",
                                message.id
                            );
                        } catch (err) {
                            console.error(
                                "Failed to mark message as seen:",
                                err
                            );
                        }
                    }
                }
            }

        } catch (err) {
            console.error("Failed to load messages:", err);
        }
    };

    // Send message
    const handleSend = async (e: React.FormEvent<HTMLFormElement>) => {
        console.log("handleSend called");
        e.preventDefault();

        if (!contact || !text.trim()) return;

        const connection = getConnection();

        console.log(connection);
        console.log(connection?.state);

        if (!connection) {
            console.error("SignalR connection is null");
            return;
        }

        try {
            console.log("Sending message...");
            console.log("Connection state:", connection.state);

            await connection.invoke(
                "SendMessage",
                contact.id,
                text.trim()
            );

            setText("");

            // Sender reloads immediately
            await loadMessages();

            console.log("Message sent");
        } catch (err) {
            console.error("Send failed:", err);
        }
    };

    // Load history whenever contact changes
    useEffect(() => {
        loadMessages();
    }, [contact]);

    // Listen for SignalR messages
    useEffect(() => {
        console.log("SignalR effect");
        if (!contact) return;

        const connection = getConnection();

        if (!connection) return;

        const handler = async (message: ChatMessage) => {
            if (message.senderId !== currentUserId) {
                await connection.invoke("MessageDelivered", message.id);
            }
            
            const belongs =
                conversationId !== null &&
                message.conversationId === conversationId;

            if (!belongs) return;

            setMessages(prev => [...prev, message]);

            if (message.senderId !== currentUserId) {
                try {
                    await connection.invoke("MessageDelivered", message.id);

                } catch (err) {
                    console.error(err);
                }
            }

        };

        const statusHandler = (
            messageId: string,
            status: number
        ) => {
            console.log("Status updated:", messageId, status);

            setMessages(prev =>
                prev.map(message =>
                    message.id === messageId
                        ? { ...message, status }
                        : message
                )
            );
        }

        // Prevent duplicate handlers
        connection.off("ReceiveMessage");
        connection.off("MessageStatusUpdated");

        connection.on("ReceiveMessage", handler);
        connection.on("MessageStatusUpdated", statusHandler);

        return () => {
            connection.off("ReceiveMessage", handler);
            connection.off("MessageStatusUpdated", statusHandler);
        };
    }, [contact, conversationId]);

    useEffect(() => {
        async function markSeen() {
            const connection = getConnection();

            if (!connection || !contact) return;

            for (const message of messages) {
                if (
                    message.senderId !== currentUserId &&
                    message.status !== 2
                ) {
                    try {
                        console.log("Marking seen:", message.id);

                        await connection.invoke(
                            "MessageSeen",
                            message.id
                        );
                    } catch (err) {
                        console.error(err);
                    }
                }
            }
        }

        markSeen();
    }, [messages, contact, currentUserId]);


    // Auto-scroll
    useEffect(() => {
        bottomRef.current?.scrollIntoView({
            behavior: "smooth",
        });
    }, [messages]);

    if (!contact) {
        return (
            <main className="flex-1 flex items-center justify-center bg-slate-50">
                <h2 className="text-gray-500 text-xl">
                    Select a contact to start chatting
                </h2>
            </main>
        );
    }

    return (
        <main className="flex-1 flex flex-col">
            <header className="h-16 border-b bg-white flex items-center px-6">
                <div>
                    <h2 className="font-bold text-lg">{contact.name}</h2>

                    <p className="text-sm text-gray-500">
                        {contact.online ? "Online" : "Offline"}
                    </p>
                </div>
            </header>

            <section className="flex-1 bg-slate-50 p-6 overflow-y-auto">
                {messages.map(message => {
                    const mine = message.senderId === currentUserId;

                    return (
                        <div
                            key={message.id}
                            className={`mb-3 ${mine ? "text-right" : ""}`}
                        >
                            <div
                                className={`inline-block rounded-lg px-4 py-3 max-w-[70%] break-words ${mine
                                    ? "bg-indigo-600 text-white"
                                    : "bg-white shadow"
                                    }`}
                            >
                                {message.content}
                            </div>

                            <div className="text-xs text-gray-500 mt-1">
                                {new Date(message.sentAt).toLocaleTimeString(
                                    [],
                                    {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    }
                                )}

                                {mine && (
                                    <span className="ml-2">
                                        {message.status === 0 && "Sent"}
                                        {message.status === 1 && "Delivered"}
                                        {message.status === 2 && "Seen"}
                                    </span>
                                )}

                            </div>
                        </div>
                    );
                })}

                <div ref={bottomRef} />
            </section>

            {contact.role === "Admin" ? (
                <footer className="border-t bg-slate-100 p-4">
                    <div className="text-center text-gray-500">
                        Messaging administrators is disabled.
                    </div>
                </footer>
            ) : (
                <footer className="border-t bg-white p-4">
                    <form
                        onSubmit={handleSend}
                        className="flex gap-3"
                    >
                        <input
                            type="text"
                            value={text}
                            onChange={e => setText(e.target.value)}
                            placeholder="Type a message..."
                            className="flex-1 border rounded-lg px-4 py-3"
                        />

                        <button
                            type="submit"
                            className="bg-indigo-600 text-white px-6 rounded-lg"
                        >
                            Send
                        </button>
                    </form>
                </footer>
            )}
        </main>
    );
}