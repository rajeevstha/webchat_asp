import { useState } from "react";
import LoginDialog from "../components/auth/LoginDialog";
import RegisterDialog from "../components/auth/RegisterDialog";

export default function AuthPage() {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  return (
    <>
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          {/* Mark */}
          <div className="flex justify-center mb-8">
            <div className="w-11 h-11 rounded-xl bg-zinc-900 flex items-center justify-center">
              <span className="text-white text-lg font-semibold">W</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-zinc-200 p-8 sm:p-10">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-semibold text-zinc-900 tracking-tight">
                Welcome to WebChat
              </h1>
              <p className="text-sm text-zinc-500 mt-2">
                Connect, chat, and collaborate in real time.
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => setShowLogin(true)}
                className="w-full bg-zinc-900 hover:bg-zinc-800 text-white text-sm font-medium rounded-lg py-2.5 transition-colors"
              >
                Sign in
              </button>
              <button
                onClick={() => setShowRegister(true)}
                className="w-full border border-zinc-200 hover:bg-zinc-50 text-zinc-700 text-sm font-medium rounded-lg py-2.5 transition-colors"
              >
                Create account
              </button>
            </div>
          </div>

          <p className="text-center text-xs text-zinc-400 mt-6">
            By continuing, you agree to WebChat's terms and privacy policy.
          </p>
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