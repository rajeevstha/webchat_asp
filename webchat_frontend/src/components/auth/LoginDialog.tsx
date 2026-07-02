import { useState } from "react";
import { WebchatApiService } from "../../services/services/WebchatApiService";
import { useNavigate } from "react-router-dom";
import { startSignalR } from "../../connection_services/signalR";

interface Props {
  open: boolean;
  onClose: () => void;
  onRegister: () => void;
}

type LoginForm = {
  email: string;
  password: string;
};

export default function LoginDialog({
  open,
  onClose,
  onRegister,
}: Props) {
  const navigate = useNavigate();
  const [form, setForm] = useState<LoginForm>({
  email: "",
  password: "",
});

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const response = await WebchatApiService.postApiAuthLogin(form);
      localStorage.setItem("accessToken", response.accessToken);
    
      await startSignalR();

      onClose();
      navigate("/chat");
    } catch (err: any) {
      console.error(err);

      setError(
        err?.body?.message ??
        err?.message ??
        "Login failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
      <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md">

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Sign In</h2>

          <button type="button" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label>Email</label>

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 mt-1"
              required
            />
          </div>

          <div>
            <label>Password</label>

            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 mt-1"
              required
            />
          </div>

          {error && (
            <p className="text-red-600 text-sm">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white rounded-lg py-3 disabled:bg-gray-400"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>

        </form>

        <p className="text-center mt-6 text-sm">
          Don't have an account?{" "}
          <button
            type="button"
            className="text-indigo-600"
            onClick={onRegister}
          >
            Register
          </button>
        </p>

      </div>
    </div>
  );
}