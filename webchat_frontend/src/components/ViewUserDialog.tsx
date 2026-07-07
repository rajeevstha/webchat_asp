import { useEffect, useState } from "react";

interface User {
    id: string;
    name: string;
    email: string;
    isOnline: boolean;
    isBlocked: boolean;
    hasSetPassword?: boolean;
    createdAt?: string;
    lastSeenAt?: string;
}

interface Props {
    open: boolean;
    userId: string | null;
    onClose: () => void;
}

export default function ViewUserDialog({
    open,
    userId,
    onClose,
}: Props) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!open || !userId) return;

        const load = async () => {
            setLoading(true);

            try {
                const token = localStorage.getItem("accessToken");

                const response = await fetch(
                    `http://localhost:5107/api/admin/users/${userId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (!response.ok)
                    throw new Error();

                const data = await response.json();

                setUser(data);
            } catch {
                alert("Failed to load user.");
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [open, userId]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">

                <div className="flex justify-between items-center border-b px-6 py-4">
                    <h2 className="text-2xl font-bold">
                        User Information
                    </h2>

                    <button
                        onClick={onClose}
                        className="text-xl hover:text-red-600"
                    >
                        ✕
                    </button>
                </div>

                {loading ? (
                    <div className="p-8 text-center">
                        Loading...
                    </div>
                ) : user && (
                    <div className="p-6 space-y-4">

                        <div>
                            <label className="text-sm text-gray-500">
                                Name
                            </label>

                            <p className="font-semibold text-lg">
                                {user.name}
                            </p>
                        </div>

                        <div>
                            <label className="text-sm text-gray-500">
                                Email
                            </label>

                            <p>{user.email}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">

                            <div>
                                <label className="text-sm text-gray-500">
                                    Online
                                </label>

                                <p>
                                    {user.isOnline ? "🟢 Online" : "⚪ Offline"}
                                </p>
                            </div>

                            <div>
                                <label className="text-sm text-gray-500">
                                    Status
                                </label>

                                <p>
                                    {user.isBlocked ? "🔴 Blocked" : "🟢 Active"}
                                </p>
                            </div>

                            <div>
                                <label className="text-sm text-gray-500">
                                    Password
                                </label>

                                <p>
                                    {user.hasSetPassword
                                        ? "Changed"
                                        : "Temporary"}
                                </p>
                            </div>

                            <div>
                                <label className="text-sm text-gray-500">
                                    User ID
                                </label>

                                <p className="text-xs break-all">
                                    {user.id}
                                </p>
                            </div>

                        </div>

                        {user.createdAt && (
                            <div>
                                <label className="text-sm text-gray-500">
                                    Created
                                </label>

                                <p>
                                    {new Date(user.createdAt).toLocaleString()}
                                </p>
                            </div>
                        )}

                        {user.lastSeenAt && (
                            <div>
                                <label className="text-sm text-gray-500">
                                    Last Seen
                                </label>

                                <p>
                                    {new Date(user.lastSeenAt).toLocaleString()}
                                </p>
                            </div>
                        )}

                    </div>
                )}

                <div className="border-t px-6 py-4 flex justify-end">
                    <button
                        onClick={onClose}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg"
                    >
                        Close
                    </button>
                </div>

            </div>
        </div>
    );
}