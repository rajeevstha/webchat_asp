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

function initials(name: string) {
    return name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map(part => part[0]?.toUpperCase())
        .join("");
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
            <main className="flex-1 flex items-center justify-center bg-zinc-50">
                <div className="text-center">
                    <div className="w-12 h-12 rounded-full bg-zinc-200 mx-auto mb-3" />
                    <h2 className="text-zinc-400 text-sm">
                        Select a contact to start chatting
                    </h2>
                </div>
            </main>
        );
    }

    return (
        <main className="flex-1 flex flex-col bg-zinc-50">
            <header className="h-16 border-b border-zinc-200 bg-white flex items-center gap-3 px-6 shrink-0">
                <div className="relative shrink-0">
                    <div className="w-9 h-9 rounded-full bg-zinc-900 text-white text-xs font-medium flex items-center justify-center">
                        {initials(contact.name)}
                    </div>
                    <span
                        className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white ${
                            contact.online ? "bg-emerald-500" : "bg-zinc-300"
                        }`}
                    />
                </div>

                <div>
                    <h2 className="font-semibold text-sm text-zinc-900">{contact.name}</h2>
                    <p className="text-xs text-zinc-400">
                        {contact.online ? "Online" : "Offline"}
                    </p>
                </div>
            </header>

            <section className="flex-1 p-6 overflow-y-auto space-y-3">
                {messages.length === 0 && (
                    <div className="h-full flex items-center justify-center">
                        <p className="text-sm text-zinc-400">
                            No messages yet. Say hello to {contact.name}.
                        </p>
                    </div>
                )}

                {messages.map(message => {
                    const mine = message.senderId === currentUserId;

                    return (
                        <div
                            key={message.id}
                            className={`flex ${mine ? "justify-end" : "justify-start"}`}
                        >
                            <div className={`max-w-[70%] ${mine ? "items-end" : "items-start"} flex flex-col`}>
                                <div
                                    className={`rounded-2xl px-4 py-2.5 text-sm break-words ${
                                        mine
                                            ? "bg-zinc-900 text-white rounded-br-md"
                                            : "bg-white text-zinc-900 border border-zinc-200 rounded-bl-md"
                                    }`}
                                >
                                    {message.content}
                                </div>

                                <div className="text-[11px] text-zinc-400 mt-1 px-1 flex items-center gap-1">
                                    <span>
                                        {new Date(message.sentAt).toLocaleTimeString(
                                            [],
                                            {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            }
                                        )}
                                    </span>

                                    {mine && (
                                        <span>
                                            · {message.status === 0 && "Sent"}
                                            {message.status === 1 && "Delivered"}
                                            {message.status === 2 && "Seen"}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}

                <div ref={bottomRef} />
            </section>

            {contact.role === "Admin" ? (
                <footer className="border-t border-zinc-200 bg-white p-4 shrink-0">
                    <div className="text-center text-sm text-zinc-400">
                        Messaging administrators is disabled.
                    </div>
                </footer>
            ) : (
                <footer className="border-t border-zinc-200 bg-white p-4 shrink-0">
                    <form
                        onSubmit={handleSend}
                        className="flex gap-3"
                    >
                        <input
                            type="text"
                            value={text}
                            onChange={e => setText(e.target.value)}
                            placeholder="Type a message…"
                            className="flex-1 border border-zinc-200 rounded-lg px-4 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-400 transition-colors"
                        />

                        <button
                            type="submit"
                            disabled={!text.trim()}
                            className="bg-zinc-900 hover:bg-zinc-800 disabled:bg-zinc-300 disabled:cursor-not-allowed text-white text-sm font-medium px-5 rounded-lg transition-colors"
                        >
                            Send
                        </button>
                    </form>
                </footer>
            )}
        </main>
    );
}