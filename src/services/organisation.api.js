import { api } from "../lib/api";

export const getOrganisation = () => {
  return api.get("/organisation");
};

export const updateOrganisation = (payload) => {
  return api.put("/organisation", payload);
};
