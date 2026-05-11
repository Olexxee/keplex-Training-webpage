import { api } from "../lib/api";

export const getItems = (params) => {
  return api.get("/items", { params });
};

export const getItemById = (id) => {
  return api.get(`/items/${id}`);
};

export const createItem = (formData) => {
  return api.post("/items", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const updateItem = (id, formData) => {
  return api.patch(`/items/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deleteItem = (id) => {
  return api.delete(`/items/${id}`);
};
