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
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-lg border border-gray-100 shadow-xl w-full max-w-md">

                <div className="flex justify-between items-center border-b border-gray-100 px-6 py-4">
                    <h2 className="text-base font-semibold text-gray-900">
                        User information
                    </h2>

                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-700 transition text-sm"
                        aria-label="Close"
                    >
                        ✕
                    </button>
                </div>

                {loading ? (
                    <div className="p-10 text-center text-sm text-gray-400">
                        Loading…
                    </div>
                ) : user && (
                    <div className="px-6 py-5 space-y-5">

                        <div>
                            <p className="text-xs text-gray-400 mb-0.5">
                                Name
                            </p>
                            <p className="text-sm font-medium text-gray-900">
                                {user.name || <span className="text-gray-300 font-normal">—</span>}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs text-gray-400 mb-0.5">
                                Email
                            </p>
                            <p className="text-sm text-gray-700">
                                {user.email}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-x-4 gap-y-4">

                            <div>
                                <p className="text-xs text-gray-400 mb-0.5">
                                    Presence
                                </p>
                                <span
                                    className={`inline-flex items-center gap-1.5 text-xs font-medium ${
                                        user.isOnline ? "text-green-600" : "text-gray-400"
                                    }`}
                                >
                                    <span
                                        className={`h-1.5 w-1.5 rounded-full ${
                                            user.isOnline ? "bg-green-500" : "bg-gray-300"
                                        }`}
                                    />
                                    {user.isOnline ? "Online" : "Offline"}
                                </span>
                            </div>

                            <div>
                                <p className="text-xs text-gray-400 mb-0.5">
                                    Status
                                </p>
                                <span
                                    className={`inline-flex items-center gap-1.5 text-xs font-medium ${
                                        user.isBlocked ? "text-red-600" : "text-green-600"
                                    }`}
                                >
                                    <span
                                        className={`h-1.5 w-1.5 rounded-full ${
                                            user.isBlocked ? "bg-red-500" : "bg-green-500"
                                        }`}
                                    />
                                    {user.isBlocked ? "Blocked" : "Active"}
                                </span>
                            </div>

                            <div>
                                <p className="text-xs text-gray-400 mb-0.5">
                                    Password
                                </p>
                                <p className="text-sm text-gray-700">
                                    {user.hasSetPassword ? "Changed" : "Temporary"}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-gray-400 mb-0.5">
                                    User ID
                                </p>
                                <p className="text-xs text-gray-500 break-all">
                                    {user.id}
                                </p>
                            </div>

                        </div>

                        {(user.createdAt || user.lastSeenAt) && (
                            <div className="grid grid-cols-2 gap-x-4 gap-y-4 pt-1 border-t border-gray-50">
                                {user.createdAt && (
                                    <div>
                                        <p className="text-xs text-gray-400 mb-0.5 mt-4">
                                            Created
                                        </p>
                                        <p className="text-sm text-gray-700">
                                            {new Date(user.createdAt).toLocaleString()}
                                        </p>
                                    </div>
                                )}

                                {user.lastSeenAt && (
                                    <div>
                                        <p className="text-xs text-gray-400 mb-0.5 mt-4">
                                            Last seen
                                        </p>
                                        <p className="text-sm text-gray-700">
                                            {new Date(user.lastSeenAt).toLocaleString()}
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                    </div>
                )}

                <div className="border-t border-gray-100 px-6 py-4 flex justify-end">
                    <button
                        onClick={onClose}
                        className="bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium px-4 py-2 rounded-md transition"
                    >
                        Close
                    </button>
                </div>

            </div>
        </div>
    );
}
