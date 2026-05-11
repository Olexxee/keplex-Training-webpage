import { api } from "../lib/api";

export const checkout = (payload) => {
  return api.post("/orders/checkout", payload);
};

export const getMyOrders = () => {
  return api.get("/orders/me");
};

export const getOrderById = (id) => {
  return api.get(`/orders/${id}`);
};

export const getAllOrders = (params) => {
  return api.get("/orders", { params });
};

export const updateOrderStatus = (id, status) => {
  return api.patch(`/orders/${id}/status`, { status });
};
