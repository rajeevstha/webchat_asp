import { useEffect, useState } from "react";
import Contacts from "../components/Contacts";
import ChatWindow from "../components/ChatWindow";

export interface Contact {
  id: string;
  name: string;
  online: boolean;
  role: string;
}

export default function ChatPage() {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string>("user-1"); // Replace with actual user ID

  useEffect(() => {
    async function loadCurrentUser() {
      const token = localStorage.getItem("accessToken");
      const response = await fetch("http://localhost:5107/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        console.error("Failed to get current user.");
        return;
      }
      const me = await response.json();
      setCurrentUserId(me.id);
    }
    loadCurrentUser();
  }, []);

  return (
    <div className="h-screen flex bg-zinc-50">
      <Contacts
        selectedContact={selectedContact}
        onSelect={setSelectedContact}
      />
      <ChatWindow
        contact={selectedContact}
        currentUserId={currentUserId}
      />
    </div>
  );
}