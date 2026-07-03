import { useEffect, useState } from "react";
import { WebchatApiService } from "../services/services/WebchatApiService";
import type { Contact } from "../pages/ChatPage";
import { getConnection } from "../connection_services/signalR";


interface Props {
  selectedContact: Contact | null;
  onSelect: (contact: Contact) => void;
}

export default function Contacts({
  selectedContact,
  onSelect,
}: Props) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadContacts();
  }, []);

  useEffect(() => {
    const connection = getConnection();

    if (!connection) return;

    const handler = (userId: string, isOnline: boolean) => {
        setContacts(prev =>
            prev.map(contact =>
                contact.id === userId
                    ? { ...contact, online: isOnline }
                    : contact
            )
        );
    };

    connection.off("UserStatusChanged");

    connection.on("UserStatusChanged", handler);

    return () => {
        connection.off("UserStatusChanged", handler);
    };
}, []);

  const loadContacts = async () => {
    try {
      setLoading(true);

      const users = await WebchatApiService.getApiUsers();

      // Map the API response to your Contact interface
      const mappedContacts: Contact[] = users.map((user: any) => ({
        id: user.id,
        name: user.name,
        online: user.online ?? false,
        role: user.role,
      }));

      setContacts(mappedContacts);
    } catch (err: any) {
      console.error(err);
      setError("Failed to load contacts.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await WebchatApiService.postApiAuthLogout();
    } catch (err) {
      console.error(err);
    }

    localStorage.removeItem("accessToken");

    window.location.href = "/";
  };

  return (
    <aside className="w-80 bg-white border-r flex flex-col">

      <div className="p-5 border-b flex items-center justify-between">
        <h2 className="text-xl font-bold">
          Contacts
        </h2>

        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm"
        >
          Logout
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">

        {loading && (
          <p className="p-4 text-gray-500">
            Loading...
          </p>
        )}

        {error && (
          <p className="p-4 text-red-600">
            {error}
          </p>
        )}

        {!loading &&
          contacts.map(contact => (
            <button
              key={contact.id}
              onClick={() => onSelect(contact)}
              className={`w-full text-left p-4 border-b hover:bg-slate-100 ${selectedContact?.id === contact.id
                ? "bg-slate-200"
                : ""
                }`}
            >
              <div className="flex justify-between">

                <span className="font-medium">
                  {contact.name}
                </span>

                <span
                  className={`text-xs ${contact.online
                    ? "text-green-600"
                    : "text-gray-400"
                    }`}
                >
                  {contact.online ? "●" : "○"}
                </span>

              </div>
            </button>
          ))}

      </div>

    </aside>
  );
}