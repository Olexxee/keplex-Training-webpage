import { createContext, useContext, useEffect, useState } from "react";
import { getMe, login as loginApi } from "../services/auth.api";
import { saveToken, removeToken, getToken } from "../lib/authStorage";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMe = async () => {
    try {
      if (!getToken()) return;
      const res = await getMe();
      setUser(res.data.data);
    } catch {
      removeToken();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMe();
  }, []);

  const login = async (payload) => {
    const res = await loginApi(payload);
    const { token, user } = res.data.data;

    saveToken(token);
    setUser(user);

    return user;
  };

  const logout = () => {
    removeToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);