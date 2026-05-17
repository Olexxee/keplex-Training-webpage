import{api} from "../lib/api";

export const getRegistrations = (params = {}) => {
  return api.get("/registrations/admin", { params });
};

export const getRegistrationStats = () => {
  return api.get("/registrations/admin/stats");
};

export const getRegistrationById = (id) => {
  return api.get(`/registrations/admin/${id}`);
};

export const updateRegistrationStatus = (id, data) => {
  return api.patch(`/registrations/admin/${id}/status`, data);
};

export const initializeRegistrationPayment = (data) => {
  return api.post("/registrations/initialize", data);
};

export const verifyRegistrationPayment = (reference) => {
  return api.get(`/registrations/verify/${reference}`);
};