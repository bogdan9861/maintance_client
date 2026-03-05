import axios from "axios";
import api from "../api/index";

export const getProducts = async () => {
  return await api.get("/products");
};

export const getProductById = async ({ id }) => {
  return await api.get(`/products/${id}`);
};

export const createProduct = async (data) => {
  return await api.post("/products", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const removeProduct = async ({ id }) => {
  return await api.delete(`/products/${id}`);
};

export const editProduct = async (data) => {
  return await api.put("/products/edit", data);
};
