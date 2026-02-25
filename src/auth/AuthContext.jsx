import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  const [loading, setLoading] = useState(false);

  // ✅ DERIVED AUTH STATE (THIS IS THE KEY)
  const isAuthenticated = !!localStorage.getItem("token");

  const login = async (username, password) => {
    try {
      setLoading(true);

      const res = await api.post("/admin-login", {
        username,
        password,
      });

      if (res.data.status !== true) return false;

      localStorage.setItem("token", res.data.access_token);
      localStorage.setItem("refresh_token", res.data.refresh_token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      setUser(res.data.user); // 👈 triggers re-render
      return true;
    } catch (error) {
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ login, logout, user, loading, isAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
