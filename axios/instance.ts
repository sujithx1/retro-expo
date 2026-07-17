

import axios from "axios";
import * as SecureStore from "expo-secure-store";

const baseURL = process.env.EXPO_PUBLIC_API_URL;

export const api = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request Interceptor: Set platform header and inject authorization token if it exists
api.interceptors.request.use(
  async (config) => {
    try {
      // Set platform header
      if (config.headers) {
        config.headers["platform"] = "expo";
      }

      // Inject authorization token
      const token = await SecureStore.getItemAsync("userToken");
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.warn("Failed to retrieve auth token or set headers:", error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Standardize error formatting
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Optional: Handle 401 token refresh if needed in the future
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // const refreshToken = await SecureStore.getItemAsync("refreshToken");
        // if (refreshToken) {
        //   const response = await axios.post(`${baseURL}/auth/refresh`, {
        //     refreshToken,
        //   });

        //   const { token: newAccessToken, refreshToken: newRefreshToken } = response.data;

        //   await SecureStore.setItemAsync("userToken", newAccessToken);
        //   if (newRefreshToken) {
        //     await SecureStore.setItemAsync("refreshToken", newRefreshToken);
        //   }

        //   if (originalRequest.headers) {
        //     originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        //   }
        //   return api(originalRequest);
        // }
      } catch (refreshError) {
        console.error("Token refresh failed. Logging out...", refreshError);
        // await SecureStore.deleteItemAsync("userToken");
        // await SecureStore.deleteItemAsync("refreshToken");
      }
    }

    // Standardize error message structure
    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "An unexpected error occurred";

    return Promise.reject({
      ...error,
      message: errorMessage,
    });
  }
);