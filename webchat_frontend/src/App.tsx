import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Layout from "./layouts/Layout";
// import HomePage from "./pages/HomePage";
// import ChatPage from "./pages/ChatPage";
import AuthPage from "./pages/AuthPage";
import ChatPage from "./pages/ChatPage";
import AdminLogin from "./pages/AdminLogin";
import Dashboard from "./pages/Dashboard";


function App() {
  return (
    <BrowserRouter>
      <Routes>
       <Route path="/" element={<AuthPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;