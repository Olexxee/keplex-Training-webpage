import { api } from "../lib/api";

export const register = (payload) => {
  return api.post("/auth/register", payload);
};

export const login = (payload) => {
  return api.post("/auth/login", payload);
};

export const getMe = () => {
  return api.get("/auth/me");
};
