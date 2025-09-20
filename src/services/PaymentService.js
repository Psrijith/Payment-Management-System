import api from "../api";

export const fetchPayments = async () => {
  const response = await api.get("/payments");
  return response.data;
}

export const fetchPaymentById = async (id) => {
  const response = await api.get(`/payments/${id}`);
  return response.data;
}

export const createPayment = async (payment) => {
  const response = await api.post("/payments", payment);
  return response.data;
}

export const updatePayment = async (id, payment) => {
  const response = await api.put(`/payments/${id}`, payment);
  return response.data;
}

export const deletePayment = async (id) => {
  const response = await api.delete(`/payments/${id}`);
  return response.data;
};

export const fetchPaymentsByUserId = async (userId) => {
  const response = await api.get(`/payments?userId=${userId}`);
  return response.data;
};

export const fetchPaymentsByStatus = async (status) => {
  const response = await api.get(`/payments?status=${status}`);
  return response.data;
};   