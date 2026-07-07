import { useState } from "react";

interface Props {
    open: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export default function ChangePasswordDialog({
    open,
    onClose,
    onSuccess,
}: Props) {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    if (!open) return null;

    const reset = () => {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setError("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setError("");

        if (!currentPassword) {
            setError("Current password is required.");
            return;
        }

        if (!newPassword) {
            setError("New password is required.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            setLoading(true);

            const response = await fetch(
                "http://localhost:5107/api/auth/change-password",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                    body: JSON.stringify({
                        currentPassword,
                        newPassword,
                    }),
                }
            );

            if (!response.ok) {
                const text = await response.text();
                throw new Error(text || "Failed to change password.");
            }

            alert("Password changed successfully.");

            reset();
            onClose();
            onSuccess?.();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">
                        Change Password
                    </h2>

                    <button
                        onClick={() => {
                            reset();
                            onClose();
                        }}
                        className="text-gray-500 hover:text-black"
                    >
                        ✕
                    </button>
                </div>

                {error && (
                    <div className="mb-4 rounded bg-red-100 text-red-700 p-3">
                        {error}
                    </div>
                )}

                <form
                    className="space-y-4"
                    onSubmit={handleSubmit}
                >
                    <div>
                        <label className="block mb-1 font-medium">
                            Current Password
                        </label>

                        <input
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="w-full border rounded-lg p-2"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">
                            New Password
                        </label>

                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full border rounded-lg p-2"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">
                            Confirm New Password
                        </label>

                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full border rounded-lg p-2"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg py-3 disabled:opacity-50"
                    >
                        {loading
                            ? "Changing Password..."
                            : "Change Password"}
                    </button>
                </form>
            </div>
        </div>
    );
}