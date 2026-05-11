import { api } from "../lib/api";

export const getAuditLogs = () => {
  return api.get("/audit-logs");
};
