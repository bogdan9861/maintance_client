import api from ".";

export const createReport = async (formData) => {
  return await api.post("/reports", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const getReports = async () => {
  return await api.get("/reports");
};

export const getReportsById = async ({ productId }) => {
  return await api.get(`/reports/product/${productId}`);
};
