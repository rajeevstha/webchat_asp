import { useEffect, useState } from "react";
import { WebchatApiService } from "../services/services/WebchatApiService";
import type { Contact } from "../pages/ChatPage";
import { getConnection } from "../connection_services/signalR";

interface Props {
  selectedContact: Contact | null;
  onSelect: (contact: Contact) => void;
}

function initials(name: string) {
  return (name ?? "")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(part => part[0]?.toUpperCase())
    .join("");
}

export default function Contacts({
  selectedContact,
  onSelect,
}: Props) {
  const [contacts, setContacts] =useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [currentUser, setCurrentUser] = useState<{
    name: string;
    email: string;
  } | null>(null);

  const [unreadCounts, setUnreadCounts] =
    useState<Record<string, number>>({});

  useEffect(() => {
    loadCurrentUser();
    loadContacts();
    loadUnreadCounts();
  }, []);

  useEffect(() => {
    const connection = getConnection();

    if (!connection) return;

    const statusHandler = (
      userId: string,
      isOnline: boolean
    ) => {
      setContacts(prev =>
        prev.map(contact =>
          contact.id === userId
            ? {
                ...contact,
                online: isOnline,
              }
            : contact
        )
      );
    };

    const onlineUsersHandler = (
      onlineUsers: string[]
    ) => {
      setContacts(prev =>
        prev.map(contact => ({
          ...contact,
          online: onlineUsers.includes(
            contact.id
          ),
        }))
      );
    };

    // Called whenever a new message is received
    const receiveMessageHandler = (
      message: any
    ) => {
      // Don't increase badge if currently viewing
      if (
        selectedContact?.id === message.senderId
      )
        return;

      setUnreadCounts(prev => ({
        ...prev,
        [message.senderId]:
          (prev[message.senderId] ?? 0) + 1,
      }));
    };

    connection.off("UserStatusChanged");
    connection.off("OnlineUsers");
    connection.off("ReceiveMessage");

    connection.on(
      "UserStatusChanged",
      statusHandler
    );
    connection.on(
      "OnlineUsers",
      onlineUsersHandler
    );
    connection.on(
      "ReceiveMessage",
      receiveMessageHandler
    );

    return () => {
      connection.off(
        "UserStatusChanged",
        statusHandler
      );
      connection.off(
        "OnlineUsers",
        onlineUsersHandler
      );
      connection.off(
        "ReceiveMessage",
        receiveMessageHandler
      );
    };
  }, [selectedContact]);

  async function loadCurrentUser() {
    try {
      const me =
        await WebchatApiService.getApiAuthMe();

      setCurrentUser({
        name:
          me.name ??
          me.userName ??
          me.email,
        email: me.email,
      });
    } catch (err) {
      console.error(err);
    }
  }

  async function loadContacts() {
    try {
      setLoading(true);
      setError("");

      const users =
        await WebchatApiService.getApiUsers();

      const mapped: Contact[] = users.map(
        (user: any) => ({
          id: user.id,
          name:
            user.name ??
            user.email,
          online:
            user.isOnline ?? false,
          role: user.role,
        })
      );

      setContacts(mapped);
    } catch (err) {
      console.error(err);
      setError(
        "Failed to load contacts."
      );
    } finally {
      setLoading(false);
    }
  }

  async function loadUnreadCounts() {
    try {
      const response = await fetch(
        "http://localhost:5107/api/messages/unread-counts",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(
              "accessToken"
            )}`,
          },
        }
      );

      if (!response.ok) return;

      const data =
        await response.json();

      setUnreadCounts(data);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleLogout() {
    try {
      await WebchatApiService.postApiAuthLogout();
    } catch (err) {
      console.error(err);
    }

    localStorage.removeItem(
      "accessToken"
    );

    window.location.href = "/";
  }

  return (
    <aside className="w-80 bg-white border-r border-zinc-200 flex flex-col">
      {/* Current User */}
      <div className="px-5 py-4 border-b border-zinc-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold">
            {currentUser?.name
              ?.charAt(0)
              .toUpperCase() ?? "U"}
          </div>

          <div>
            <h2 className="text-sm font-semibold text-zinc-900">
              {currentUser?.name ??
                "Loading..."}
            </h2>

            <p className="text-xs text-zinc-500">
              {currentUser?.email}
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="text-xs font-medium text-zinc-500 hover:text-zinc-900 border border-zinc-200 hover:border-zinc-300 rounded-lg px-3 py-1.5 transition-colors"
        >
          Log out
        </button>
      </div>

      {/* Contacts */}
      <div className="flex-1 overflow-y-auto">
        {loading && (
          <div className="p-4 space-y-3">
            {[1, 2, 3, 4].map(i => (
              <div
                key={i}
                className="flex items-center gap-3 animate-pulse"
              >
                <div className="w-9 h-9 rounded-full bg-zinc-100" />

                <div className="flex-1 space-y-2">
                  <div className="h-3 w-24 rounded bg-zinc-100" />

                  <div className="h-2 w-16 rounded bg-zinc-100" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading &&
          error && (
            <div className="p-4">
              <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                {error}
              </p>

              <button
                onClick={loadContacts}
                className="mt-2 text-xs font-medium hover:underline"
              >
                Try Again
              </button>
            </div>
          )}

        {!loading &&
          !error &&
          contacts.length === 0 && (
            <div className="p-4 text-sm text-zinc-400">
              No contacts found.
            </div>
          )}

        {!loading &&
          !error &&
          contacts.map(contact => {
            const isSelected =
              selectedContact?.id ===
              contact.id;

            return (
              <button
                key={contact.id}
                onClick={async () => {
                  onSelect(contact);

                  // Clear badge immediately
                  setUnreadCounts(prev => ({
                    ...prev,
                    [contact.id]: 0,
                  }));

                  // Later create this endpoint
                  // await WebchatApiService.postApiMessagesMarkRead(contact.id);
                }}
                className={`w-full px-4 py-3 border-b border-zinc-100 flex items-center gap-3 text-left transition ${
                  isSelected
                    ? "bg-zinc-100"
                    : "hover:bg-zinc-50"
                }`}
              >
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-zinc-900 text-white text-xs font-semibold flex items-center justify-center">
                    {initials(contact.name)}
                  </div>

                  <span
                    className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white ${
                      contact.online
                        ? "bg-green-500"
                        : "bg-zinc-300"
                    }`}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">
                    {contact.name}
                  </p>

                  <p className="text-xs text-zinc-400 truncate">
                    {contact.online
                      ? "Online"
                      : contact.role}
                  </p>
                </div>

                {(unreadCounts[
                  contact.id
                ] ?? 0) > 0 && (
                  <div className="ml-2 min-w-6 h-6 px-2 rounded-full bg-red-500 text-white text-xs font-semibold flex items-center justify-center">
                    {
                      unreadCounts[
                        contact.id
                      ]
                    }
                  </div>
                )}
              </button>
            );
          })}
      </div>
    </aside>
  );
}