import { api } from "../lib/api";

export const getDashboardOverview = () => {
  return api.get("/dashboard/overview");
};
