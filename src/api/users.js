import api from "../api/index";

export const login = async (data) => {
  return await api.post("/users/login", data);
};

export const register = async ({ email, firstName, lastName, password }) => {
  return await api.post("/users/register", {
    email,
    firstName,
    lastName,
    password,
  });
};

export const currentUser = async () => {
  return await api.get("/users/");
};

export const editUser = async ({ firstName, lastName, email }) => {
  return await api.put("/users/", { firstName, lastName, email });
};
