import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { WebchatApiService } from "../../services/services/WebchatApiService";
import { startSignalR } from "../../connection_services/signalR";
import ChangePasswordDialog from "./ChangePasswordDialog";

interface Props {
    open: boolean;
    onClose: () => void;
    onRegister: () => void;
}

type LoginForm = {
    email: string;
    password: string;
};

export default function LoginDialog({ open, onClose, onRegister }: Props) {
    const navigate = useNavigate();
    const [form, setForm] = useState<LoginForm>({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showChangePassword, setShowChangePassword] = useState(false);

    if (!open && !showChangePassword) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError("");
            const response = await WebchatApiService.postApiAuthLogin(form);
            localStorage.setItem("accessToken", response.accessToken);

            if (response.mustChangePassword) {
                setShowChangePassword(true);
                return;
            }

            await startSignalR();
            onClose();
            navigate("/chat");
        } catch (err: any) {
            console.error(err);
            setError(err?.body?.message ?? err?.message ?? "Login failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {!showChangePassword && (
                <div className="fixed inset-0 bg-zinc-900/40 backdrop-blur-sm flex justify-center items-center z-50 p-4">
                    <div className="bg-white rounded-2xl border border-zinc-200 p-8 sm:p-10 w-full max-w-sm">
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <h2 className="text-xl font-semibold text-zinc-900 tracking-tight">
                                    Sign in
                                </h2>
                                <p className="text-sm text-zinc-500 mt-1">
                                    Welcome back to WebChat.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={onClose}
                                aria-label="Close"
                                className="text-zinc-400 hover:text-zinc-600 transition-colors rounded-md p-1 -mr-1 -mt-1"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-zinc-700 mb-1.5">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    className="w-full border border-zinc-200 rounded-lg px-3 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-400 transition-colors"
                                    placeholder="you@example.com"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-zinc-700 mb-1.5">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    className="w-full border border-zinc-200 rounded-lg px-3 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-400 transition-colors"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>

                            {error && (
                                <p className="text-red-600 text-xs bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                                    {error}
                                </p>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-zinc-900 hover:bg-zinc-800 disabled:bg-zinc-300 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg py-2.5 transition-colors"
                            >
                                {loading ? "Signing in…" : "Sign in"}
                            </button>
                        </form>

                        <p className="text-center mt-6 text-sm text-zinc-500">
                            Don't have an account?{" "}
                            <button
                                type="button"
                                className="text-zinc-900 font-medium hover:underline"
                                onClick={onRegister}
                            >
                                Register
                            </button>
                        </p>
                    </div>
                </div>
            )}

            <ChangePasswordDialog
                open={showChangePassword}
                onClose={() => {
                    localStorage.removeItem("accessToken");
                    setShowChangePassword(false);
                    onClose();
                }}
                onSuccess={async () => {
                    setShowChangePassword(false);
                    await startSignalR();
                    onClose();
                    navigate("/chat");
                }}
            />
        </>
    );
}