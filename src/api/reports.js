import api from ".";

export const createReport = async (formData) => {
  return await api.post("/reports", formData);
};
