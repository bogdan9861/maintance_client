import api from "../api/index";

export const getNotifications = async () => {
  return await api.get("/notifications");
};

export const markAsReadById = async (id) => {
  return await api.put(`/notifications/read/${id}`);
};

export const markAsReadAll = async (id) => {
  return await api.put(`/notifications/read`);
};
