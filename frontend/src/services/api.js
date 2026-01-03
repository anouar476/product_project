import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const getAuthHeader = (keycloak) => {
  return {
    headers: {
      Authorization: `Bearer ${keycloak.token}`
    }
  };
};

export const productService = {
  getAllProducts: (keycloak) => {
    return axios.get(`${API_URL}/products`, getAuthHeader(keycloak));
  },

  getProduct: (id, keycloak) => {
    return axios.get(`${API_URL}/products/${id}`, getAuthHeader(keycloak));
  },

  createProduct: (product, keycloak) => {
    return axios.post(`${API_URL}/products`, product, getAuthHeader(keycloak));
  },

  updateProduct: (id, product, keycloak) => {
    return axios.put(`${API_URL}/products/${id}`, product, getAuthHeader(keycloak));
  },

  deleteProduct: (id, keycloak) => {
    return axios.delete(`${API_URL}/products/${id}`, getAuthHeader(keycloak));
  }
};

export const orderService = {
  createOrder: (order, keycloak) => {
    return axios.post(`${API_URL}/orders`, order, getAuthHeader(keycloak));
  },

  getMyOrders: (keycloak) => {
    return axios.get(`${API_URL}/orders/my-orders`, getAuthHeader(keycloak));
  },

  getAllOrders: (keycloak) => {
    return axios.get(`${API_URL}/orders`, getAuthHeader(keycloak));
  },

  getOrder: (id, keycloak) => {
    return axios.get(`${API_URL}/orders/${id}`, getAuthHeader(keycloak));
  }
};
