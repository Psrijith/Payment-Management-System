import api from "../api"; 

export const fetchUsers = async () => {
  const response = await api.get("/users");
  return response.data;
};

export const fetchUserById = async (id) => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};

export const fetchUserByName = async (name) => {
  const response = await api.get(`/users?name=${name}`);
  return response.data;
};

export const createUser = async (user) => {
  const response = await api.post("/users", user);
  return response.data;
};

export const updateUser = async (id, user) => {
  const response = await api.put(`/users/${id}`, user);
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await api.delete(`/users/${id}`);
  return response.data;
};
