import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AddUserDialog from "../components/admin/AddUserDialog";
import ViewUserDialog from "../components/ViewUserDialog";
import { WebchatApiService } from "../services";

interface User {
    id: string;
    name: string;
    email: string;
    isOnline: boolean;
    isBlocked: boolean;
}

export default function Dashboard() {
    const navigate = useNavigate();

    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showAddUserDialog, setShowAddUserDialog] = useState(false);
    const [showViewDialog, setShowViewDialog] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);


    const token = localStorage.getItem("accessToken");

    useEffect(() => {
        loadUsers();
    }, []);

    async function loadUsers() {
        try {
            setLoading(true);

            const response = await fetch(
                "http://localhost:5107/api/admin/users",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok)
                throw new Error("Failed to load users.");

            const data = await response.json();

            setUsers(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    const deleteUser = async (id: string) => {
        if (!confirm("Delete this user?"))
            return;

        try {
            const response = await fetch(
                `http://localhost:5107/api/admin/users/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok)
                throw new Error();

            setUsers(users => users.filter(u => u.id !== id));
        } catch (err) {
            console.error(err);
            alert("Failed to delete user.");
        }
    };

    const toggleBlock = async (user: User) => {
        try {
            const endpoint = user.isBlocked
                ? `http://localhost:5107/api/admin/users/${user.id}/unblock`
                : `http://localhost:5107/api/admin/users/${user.id}/block`;

            const response = await fetch(endpoint, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok)
                throw new Error();

            setUsers(users =>
                users.map(u =>
                    u.id === user.id
                        ? { ...u, isBlocked: !u.isBlocked }
                        : u
                )
            );
        } catch (err) {
            console.error(err);
            alert("Failed to update user.");
        }
    };

    const logout = async () => {
        try {
            await WebchatApiService.postApiAuthLogout();
        } catch (err) {
            console.error(err);
        }

        localStorage.removeItem("accessToken");

        navigate("/admin");
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-sm text-gray-400">
                Loading users…
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center text-sm text-red-500">
                {error}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <header className="border-b border-gray-100 px-8 py-4 flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <div>
                        <h1 className="text-lg font-semibold text-gray-900 tracking-tight">
                            Admin Dashboard
                        </h1>
                        <p className="text-gray-400 text-xs mt-0.5">
                            User Management
                        </p>
                    </div>

                    <div className="h-8 w-px bg-gray-100" />

                    <button
                        onClick={() => navigate("/chat")}
                        className="text-sm text-gray-600 hover:text-gray-900 transition"
                    >
                        ← Chat
                    </button>

                    <button
                        onClick={() => setShowAddUserDialog(true)}
                        className="text-sm bg-gray-900 hover:bg-gray-800 text-white px-3.5 py-1.5 rounded-md font-medium transition"
                    >
                        + Add user
                    </button>
                </div>

                <button
                    onClick={logout}
                    className="text-sm text-gray-500 hover:text-red-600 transition"
                >
                    Logout
                </button>
            </header>

            <div className="p-8">
                <div className="border border-gray-100 rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-100">
                                <th className="text-left px-6 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Name</th>
                                <th className="text-left px-6 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Email</th>
                                <th className="text-left px-6 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Status</th>
                                <th className="text-right px-6 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {users.map(user => (
                                <tr
                                    key={user.id}
                                    className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60 transition"
                                >
                                    <td className="px-6 py-3.5 text-gray-900 font-medium">
                                        {user.name}
                                    </td>

                                    <td className="px-6 py-3.5 text-gray-500">
                                        {user.email}
                                    </td>

                                    <td className="px-6 py-3.5">
                                        <span
                                            className={`inline-flex items-center gap-1.5 text-xs font-medium ${user.isBlocked
                                                ? "text-red-600"
                                                : user.isOnline
                                                    ? "text-green-600"
                                                    : "text-gray-400"
                                                }`}
                                        >
                                            <span
                                                className={`h-1.5 w-1.5 rounded-full ${user.isBlocked
                                                    ? "bg-red-500"
                                                    : user.isOnline
                                                        ? "bg-green-500"
                                                        : "bg-gray-300"
                                                    }`}
                                            />
                                            {user.isBlocked
                                                ? "Blocked"
                                                : user.isOnline
                                                    ? "Online"
                                                    : "Offline"}
                                        </span>
                                    </td>

                                    <td className="px-6 py-3.5">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => {
                                                    setSelectedUserId(user.id);
                                                    setShowViewDialog(true);
                                                }}
                                                className="text-xs font-medium text-gray-600 hover:text-gray-900 border border-gray-200 rounded-md px-2.5 py-1 transition"
                                            >
                                                View
                                            </button>

                                            <button
                                                onClick={() => toggleBlock(user)}
                                                className="text-xs font-medium text-gray-600 hover:text-gray-900 border border-gray-200 rounded-md px-2.5 py-1 transition"
                                            >
                                                {user.isBlocked
                                                    ? "Unblock"
                                                    : "Block"}
                                            </button>

                                            <button
                                                onClick={() => deleteUser(user.id)}
                                                className="text-xs font-medium text-red-600 hover:text-red-700 border border-red-100 rounded-md px-2.5 py-1 transition"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {users.length === 0 && (
                        <div className="p-10 text-center text-sm text-gray-400">
                            No users found.
                        </div>
                    )}
                </div>
            </div>

            <AddUserDialog
                open={showAddUserDialog}
                onClose={() => setShowAddUserDialog(false)}
                onCreated={() => {
                    setShowAddUserDialog(false);
                    loadUsers();
                }}
            />

            <ViewUserDialog
                open={showViewDialog}
                userId={selectedUserId}
                onClose={() => {
                    setShowViewDialog(false);
                    setSelectedUserId(null);
                }}
            />

        </div>
    );
}