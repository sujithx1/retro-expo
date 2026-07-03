

import axios from "axios";


const baseURL = process.env.EXPO_PUBLIC_API_URL 

export const api = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// // Request Interceptor: Automatically inject the auth token if it exists in SecureStore
// api.interceptors.request.use(
//   async (config) => {
//     try {
//       const token = await SecureStore.getItemAsync("userToken");
//       if (token && config.headers) {
//         config.headers.Authorization = `Bearer ${token}`;
//       }
//     } catch (error) {
//       console.warn("Failed to retrieve auth token from SecureStore:", error);
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // Response Interceptor: Centralized error handling (e.g., handling 401s or network issues)
// api.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   async (error) => {
//     const originalRequest = error.config;

//     // Handle token expiration or unauthorized errors
//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;
//       try {
//         const refreshToken = await SecureStore.getItemAsync("refreshToken");
//         if (refreshToken) {
//           // Attempt to refresh the token using a refresh endpoint
//           const response = await axios.post(`${baseURL}/auth/refresh`, {
//             refreshToken,
//           });

//           const { token: newAccessToken, refreshToken: newRefreshToken } = response.data;

//           // Save new tokens
//           await SecureStore.setItemAsync("userToken", newAccessToken);
//           if (newRefreshToken) {
//             await SecureStore.setItemAsync("refreshToken", newRefreshToken);
//           }

//           // Retry the original request with the new access token
//           if (originalRequest.headers) {
//             originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
//           }
//           return api(originalRequest);
//         }
//       } catch (refreshError) {
//         console.error("Token refresh failed. Logging out...", refreshError);
//         // Clean up tokens on refresh failure
//         await SecureStore.deleteItemAsync("userToken");
//         await SecureStore.deleteItemAsync("refreshToken");
        
//         // Note: You can trigger navigation or global state resets here if needed
//       }
//     }

//     // Transform and standardize the error before propagating it
//     const errorMessage =
//       error.response?.data?.message ||
//       error.response?.data?.error ||
//       error.message ||
//       "An unexpected error occurred";

//     return Promise.reject({
//       ...error,
//       message: errorMessage,
//     });
//   }
// );