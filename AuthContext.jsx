import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("vaultline_token");
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .get("/auth/me")
      .then((res) => setAccount(res.data.account))
      .catch(() => localStorage.removeItem("vaultline_token"))
      .finally(() => setLoading(false));
  }, []);

  async function login(email, password) {
    const res = await api.post("/auth/login", { email, password });
    localStorage.setItem("vaultline_token", res.data.token);
    setAccount(res.data.account);
    return res.data.account;
  }

  async function signup(payload) {
    const res = await api.post("/auth/signup", payload);
    localStorage.setItem("vaultline_token", res.data.token);
    setAccount(res.data.account);
    return res.data.account;
  }

  function logout() {
    localStorage.removeItem("vaultline_token");
    setAccount(null);
  }

  function refreshAccount(updated) {
    setAccount((prev) => ({ ...prev, ...updated }));
  }

  return (
    <AuthContext.Provider value={{ account, loading, login, signup, logout, refreshAccount }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
