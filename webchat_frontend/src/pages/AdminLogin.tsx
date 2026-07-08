import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { WebchatApiService } from "../services/services/WebchatApiService";
import { startSignalR } from "../connection_services/signalR";

interface LoginRequest {
    email: string;
    password: string;
}

export default function AdminLogin() {
    const navigate = useNavigate();

    const [form, setForm] = useState<LoginRequest>({
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        setLoading(true);
        setError("");

        try {
            const response = await WebchatApiService.postApiAuthLogin(form);

            localStorage.setItem(
                "accessToken",
                response.accessToken
            );

            const me = await fetch("http://localhost:5107/api/auth/me", {
                headers: {
                    Authorization: `Bearer ${response.accessToken}`,
                },
            }).then(r => r.json());

            if (!me.roles.includes("Admin")) {
                localStorage.removeItem("accessToken");
                setError("You are not authorized to access the admin dashboard.");
                return;
            }

            await startSignalR();

            navigate("/dashboard");
        } catch (err: any) {
            console.error(err);

            setError(
                err?.body?.message ??
                err?.message ??
                "Invalid email or password."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex items-center justify-center px-4">
            <div className="w-full max-w-sm">
                <div className="text-center mb-10">
                    <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
                        WebChat
                    </h1>
                    <p className="text-gray-400 mt-1 text-sm">
                        Admin sign in
                    </p>
                </div>

                {error && (
                    <div className="mb-5 rounded-md bg-red-50 text-red-600 px-4 py-2.5 text-sm border border-red-100">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block mb-1.5 text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="admin@webchat.com"
                            autoComplete="email"
                            className="w-full border border-gray-200 rounded-md px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 transition"
                            required
                        />
                    </div>

                    <div>
                        <label className="block mb-1.5 text-sm font-medium text-gray-700">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            autoComplete="current-password"
                            className="w-full border border-gray-200 rounded-md px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400 transition"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 text-white rounded-md py-2.5 text-sm font-medium transition mt-6"
                    >
                        {loading ? "Signing in…" : "Sign in"}
                    </button>
                </form>
            </div>
        </div>
    );
}