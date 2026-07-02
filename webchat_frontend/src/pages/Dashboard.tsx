import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface User {
    id: string;
    displayName: string;
    email: string;
    isOnline: boolean;
}

export default function Dashboard() {
    const navigate = useNavigate();

    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadUsers();
    }, []);

    const deleteUser = async (id: string) => {
        if (!confirm("Delete this user?"))
            return;

        try {
            await fetch(`http://localhost:5107/api/users/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            });

            setUsers(users => users.filter(u => u.id !== id));
        } catch (err) {
            console.error(err);
            alert("Failed to delete user.");
        }
    };

    async function loadUsers() {
        try {
            const token = localStorage.getItem("accessToken");

            const response = await fetch(
                "http://localhost:5107/api/users",
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

    const logout = () => {
        localStorage.removeItem("accessToken");
        navigate("/admin");
    };

    if (loading)
        return (
            <div className="p-8">
                Loading users...
            </div>
        );

    if (error)
        return (
            <div className="p-8 text-red-600">
                {error}
            </div>
        );

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
                                        {user.displayName ?? "No Name"}
                                    </td>

                                    <td className="px-6 py-4">
                                        {user.email}
                                    </td>

                                    <td className="px-6 py-4">
                                        <span
                                            className={`px-3 py-1 rounded-full text-sm ${
                                                user.isOnline
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-gray-100 text-gray-600"
                                            }`}
                                        >
                                            {user.isOnline ? "Online" : "Offline"}
                                        </span>
                                    </td>

                                    <td className="px-6 py-4 text-center space-x-2">
                                        <button className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
                                            View
                                        </button>

                                        <button className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600">
                                            Block
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
        </div>
    );
}