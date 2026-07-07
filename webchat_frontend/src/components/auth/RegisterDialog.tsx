import { useState } from "react";
import { WebchatApiService } from "../../services/services/WebchatApiService";

interface Props {
  open: boolean;
  onClose: () => void;
  onLogin?: () => void;
}

export default function RegisterDialog({
  open,
  onClose,
  onLogin,
}: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  const handleRegister = async () => {
    setError("");

    if (!email.trim()) {
      setError("Email is required.");
      return;
    }

    if (!password) {
      setError("Password is required.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      await WebchatApiService.postApiAuthRegister({
        name,
        email,
        password,
      });

      alert("Registration successful. Please sign in.");

      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");

      onClose();
      onLogin?.();
    } catch (err: any) {
      setError(
        err?.response?.data?.message ??
        "Registration failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
      <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            Create Account
          </h2>

          <button onClick={onClose}>✕</button>
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
            handleRegister();
          }}
        >
          
          <div>
            <label>Name</label>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded-lg p-2 mt-1"
            />
          </div>

          <div>
            <label>Email</label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded-lg p-2 mt-1"
            />
          </div>

          <div>
            <label>Password</label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded-lg p-2 mt-1"
            />
          </div>

          <div>
            <label>Confirm Password</label>

            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border rounded-lg p-2 mt-1"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white rounded-lg py-3 disabled:opacity-50"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="text-center mt-6 text-sm">
          Already have an account?{" "}
          <button
            type="button"
            className="text-indigo-600"
            onClick={() => onLogin?.()}
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
}