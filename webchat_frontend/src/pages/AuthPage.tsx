import { useState } from "react";
import LoginDialog from "../components/auth/LoginDialog"
import RegisterDialog from "../components/auth/RegisterDialog";

export default function AuthPage() {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  return (
    <>
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-12 w-full max-w-lg text-center">
          <h1 className="text-4xl font-bold mb-3">
            Welcome to WebChat
          </h1>

          <p className="text-gray-500 mb-8">
            Connect, chat and collaborate in real time.
          </p>

          <div className="space-y-4">
            <button
              onClick={() => setShowLogin(true)}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg py-3"
            >
              Sign In
            </button>

            <button
              onClick={() => setShowRegister(true)}
              className="w-full border rounded-lg py-3 hover:bg-gray-100"
            >
              Create Account
            </button>
          </div>
        </div>
      </div>

      <LoginDialog
        open={showLogin}
        onClose={() => setShowLogin(false)}
        onRegister={() => {
          setShowLogin(false);
          setShowRegister(true);
        }}
      />

      <RegisterDialog
        open={showRegister}
        onClose={() => setShowRegister(false)}
        onLogin={() => {
          setShowRegister(false);
          setShowLogin(true);
        }}
      />
    </>
  );
}