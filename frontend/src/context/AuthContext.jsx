import { createContext, useState, useEffect } from "react";
import API from "../api/axios";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {

  const [user, setUser] = useState(null);
  const [profileRefreshKey, setProfileRefreshKey] = useState(0);

  // auto load user if token exists
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      API.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      API.get("/auth/me")
        .then((res) => setUser(res.data))
        .catch(() => {
          localStorage.removeItem("token");
          setUser(null);
        });
    }
  }, []);

  function login(token) {
    localStorage.setItem("token", token);
    API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    API.get("/auth/me").then(res => setUser(res.data));
  }

  function logout() {
    localStorage.removeItem("token");
    delete API.defaults.headers.common["Authorization"];
    setUser(null);
  }

  // 🔥 THIS is what Navbar listens to
  function refreshProfile() {
    setProfileRefreshKey(Date.now());
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login,
        logout,
        profileRefreshKey,
        refreshProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
