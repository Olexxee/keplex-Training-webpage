import { api } from "../lib/api";

export const initializePayment = (orderId) => {
  return api.post(`/payments/orders/${orderId}/initialize`);
};

export const verifyPayment = (reference) => {
  return api.get(`/payments/verify/${reference}`);
};
