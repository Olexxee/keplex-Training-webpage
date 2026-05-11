import { api } from "../lib/api";

export const getCategories = () => {
  return api.get("/categories");
};

export const createCategory = (payload) => {
  return api.post("/categories", payload);
};

export const updateCategory = (id, payload) => {
  return api.patch(`/categories/${id}`, payload);
};

export const deleteCategory = (id) => {
  return api.delete(`/categories/${id}`);
};
