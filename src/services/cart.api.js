import { api } from "../lib/api";

export const getCart = () => {
  return api.get("/cart");
};

export const addCartItem = (payload) => {
  return api.post("/cart/items", payload);
};

export const updateCartItem = (itemId, payload) => {
  return api.patch(`/cart/items/${itemId}`, payload);
};

export const removeCartItem = (itemId) => {
  return api.delete(`/cart/items/${itemId}`);
};

export const clearCart = () => {
  return api.delete("/cart/clear");
};
