interface Props {
  open: boolean;
  onClose: () => void;
  onLogin: () => void;
}

export default function RegisterDialog({
  open,
  onClose,
  onLogin,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center">

      <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md">

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            Create Account
          </h2>

          <button onClick={onClose}>✕</button>
        </div>

        <form className="space-y-4">

          <div>
            <label>Name</label>

            <input
              className="w-full border rounded-lg p-2 mt-1"
            />
          </div>

          <div>
            <label>Email</label>

            <input
              type="email"
              className="w-full border rounded-lg p-2 mt-1"
            />
          </div>

          <div>
            <label>Password</label>

            <input
              type="password"
              className="w-full border rounded-lg p-2 mt-1"
            />
          </div>

          <div>
            <label>Confirm Password</label>

            <input
              type="password"
              className="w-full border rounded-lg p-2 mt-1"
            />
          </div>

          <button
          type="button"
            className="w-full bg-indigo-600 text-white rounded-lg py-3"
              onClick={onLogin}
          >
            Register
          </button>
        </form>

        <p className="text-center mt-6 text-sm">
          Already have an account?{" "}
          <button
            className="text-indigo-600"
            onClick={onLogin}
          >
            Sign In
          </button>
        </p>

      </div>
    </div>
  );
}