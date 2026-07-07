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
            <div className="p-8">
                Loading users...
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8 text-red-600">
                {error}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-100">
            <header className="bg-indigo-700 text-white px-8 py-5 shadow flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate("/chat")}
                        className="bg-white text-indigo-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition"
                    >
                        ← Chat
                    </button>

                    <button
                        onClick={() => setShowAddUserDialog(true)}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition"
                    >
                        + Add User
                    </button>

                    <div>
                        <h1 className="text-3xl font-bold">
                            Admin Dashboard
                        </h1>

                        <p className="text-indigo-100">
                            User Management
                        </p>
                    </div>
                </div>

                <button
                    onClick={logout}
                    className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-semibold"
                >
                    Logout
                </button>
            </header>

            <div className="p-8">
                <div className="bg-white rounded-xl shadow overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-slate-100">
                            <tr>
                                <th className="text-left px-6 py-4">Name</th>
                                <th className="text-left px-6 py-4">Email</th>
                                <th className="text-left px-6 py-4">Status</th>
                                <th className="text-center px-6 py-4">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {users.map(user => (
                                <tr
                                    key={user.id}
                                    className="border-t hover:bg-slate-50"
                                >
                                    <td className="px-6 py-4">
                                        {user.name}
                                    </td>

                                    <td className="px-6 py-4">
                                        {user.email}
                                    </td>

                                    <td className="px-6 py-4">
                                        <span
                                            className={`px-3 py-1 rounded-full text-sm ${user.isBlocked
                                                ? "bg-red-100 text-red-700"
                                                : user.isOnline
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-gray-100 text-gray-600"
                                                }`}
                                        >
                                            {user.isBlocked
                                                ? "Blocked"
                                                : user.isOnline
                                                    ? "Online"
                                                    : "Offline"}
                                        </span>
                                    </td>

                                    <td className="px-6 py-4 text-center space-x-2">
                                        <button
                                            onClick={() => {
                                                setSelectedUserId(user.id);
                                                setShowViewDialog(true);
                                            }}
                                            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                                        >
                                            View
                                        </button>

                                        <button
                                            onClick={() => toggleBlock(user)}
                                            className={`text-white px-3 py-1 rounded ${user.isBlocked
                                                ? "bg-green-600 hover:bg-green-700"
                                                : "bg-yellow-500 hover:bg-yellow-600"
                                                }`}
                                        >
                                            {user.isBlocked
                                                ? "Unblock"
                                                : "Block"}
                                        </button>

                                        <button
                                            onClick={() => deleteUser(user.id)}
                                            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {users.length === 0 && (
                        <div className="p-6 text-center text-gray-500">
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