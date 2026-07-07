import { useEffect, useState } from "react";
import { WebchatApiService } from "../../services/services/WebchatApiService";

interface Props {
    open: boolean;
    onClose: () => void;
    onCreated?: () => void;
}

export default function AddUserDialog({
    open,
    onClose,
    onCreated,
}: Props) {
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("Password123!");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Prevent overwriting the name once the admin edits it.
    const [nameEdited, setNameEdited] = useState(false);

    useEffect(() => {
        if (!nameEdited) {
            setName(email.split("@")[0] ?? "");
        }
    }, [email, nameEdited]);

    if (!open) return null;

    const resetForm = () => {
        setEmail("");
        setName("");
        setPassword("Password123!");
        setNameEdited(false);
        setError("");
    };

    const handleCreate = async () => {
        setError("");

        if (!email.trim()) {
            setError("Email is required.");
            return;
        }

        if (!password.trim()) {
            setError("Password is required.");
            return;
        }

        try {
            setLoading(true);

            const token = localStorage.getItem("accessToken");

            const response = await fetch(
                "http://localhost:5107/api/admin/users",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        name,
                        email,
                        password,
                    }),
                }
            );

            if (!response.ok) {
                let message = "Failed to create user.";

                try {
                    const error = await response.json();
                    message =
                        error.message ??
                        error.title ??
                        JSON.stringify(error);
                } catch {
                    message = await response.text();
                }

                throw new Error(message);
            }

            alert("User created successfully.");

            resetForm();
            onClose();
            onCreated?.();
        } catch (err: any) {
            console.error(err);
            setError(err.message ?? "Failed to create user.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">
                        Add User
                    </h2>

                    <button
                        onClick={() => {
                            resetForm();
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
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleCreate();
                    }}
                >
                    <div>
                        <label className="block mb-1 font-medium">
                            Email <span className="text-red-500">*</span>
                        </label>

                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="user@example.com"
                            className="w-full border rounded-lg p-2"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">
                            Name
                        </label>

                        <input
                            type="text"
                            value={name}
                            onChange={(e) => {
                                setNameEdited(true);
                                setName(e.target.value);
                            }}
                            className="w-full border rounded-lg p-2"
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">
                            Password
                        </label>

                        <input
                            type="text"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full border rounded-lg p-2"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-green-600 hover:bg-green-700 text-white rounded-lg py-3 disabled:opacity-50"
                    >
                        {loading ? "Creating User..." : "Create User"}
                    </button>
                </form>
            </div>
        </div>
    );
}