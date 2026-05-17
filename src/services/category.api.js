import { api } from "../lib/api";

export const getCategories = () => {
  return api.get("/category/");
};

export const createCategory = (payload) => {
  return api.post("/category", payload);
};

export const updateCategory = (id, payload) => {
  return api.patch(`/category/${id}`, payload);
};

export const deleteCategory = (id) => {
  return api.delete(`/category/${id}`);
};
