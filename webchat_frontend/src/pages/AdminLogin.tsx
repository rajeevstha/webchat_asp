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
        <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
            <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-indigo-700">
                        WebChat
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Administrator Login
                    </p>
                </div>

                {error && (
                    <div className="mb-4 rounded-lg bg-red-100 text-red-700 p-3 text-sm">
                        {error}
                    </div>
                )}

                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >
                    <div>
                        <label className="block mb-2 font-medium">
                            Email
                        </label>

                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="admin@webchat.com"
                            className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block mb-2 font-medium">
                            Password
                        </label>

                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            placeholder="Password"
                            className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-lg py-3 font-semibold transition"
                    >
                        {loading
                            ? "Signing In..."
                            : "Login as Admin"}
                    </button>
                </form>
            </div>
        </div>
    );
}