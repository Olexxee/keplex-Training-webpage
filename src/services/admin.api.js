import { api } from "../lib/api";

export const getUsers = (params) => {
  return api.get("/admin/users", { params });
};

export const getUserById = (id) => {
  return api.get(`/admin/users/${id}`);
};

export const createStaff = (payload) => {
  return api.post("/admin/staff", payload);
};

export const updateUserRole = (id, role) => {
  return api.patch(`/admin/users/${id}/role`, { role });
};

export const updateUserStatus = (id, status) => {
  return api.patch(`/admin/users/${id}/status`, { status });
};
