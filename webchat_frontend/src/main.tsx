import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

import { OpenAPI } from "./services/core/OpenAPI";

OpenAPI.BASE = "http://localhost:5107";
OpenAPI.TOKEN = async () => {
  return localStorage.getItem("accessToken") ?? "";
};


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
