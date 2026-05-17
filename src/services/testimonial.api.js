import {api} from "../lib/api";

export const getPublicTestimonials = () => {
  return api.get("/testimonials");
};

export const createTestimonial = (data) => {
  return api.post("/testimonials", data);
};

export const getAdminTestimonials = (params = {}) => {
  return api.get("/testimonials/admin", {
    params,
  });
};

export const getTestimonialStats = () => {
  return api.get("/testimonials/admin/stats");
};

export const updateTestimonialStatus = (id, data) => {
  return api.patch(
    `/testimonials/admin/${id}/status`,
    data,
  );
};

export const deleteTestimonial = (id) => {
  return api.delete(`/testimonials/admin/${id}`);
};