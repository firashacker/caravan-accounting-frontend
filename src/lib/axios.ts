import axios from "axios";

//export const BaseUrl = import.meta.env.VITE_API_URL;
export const BaseUrl = `http://${window.location.host}`;
//export const BaseUrl = "http://192.168.1.102:4000";

export const uploadInstance = axios.create({
  baseURL: BaseUrl,
});

export const signOutInstance = axios.create({
  baseURL: BaseUrl,
  withCredentials: true,
});

export const signInInstance = axios.create({
  baseURL: BaseUrl,
  withCredentials: true,
});

const apiInstance = axios.create({
  baseURL: BaseUrl,
  withCredentials: true,
});

apiInstance.interceptors.response.use(
  async (response) => response,
  async (error) => {
    if (error.response.status === 403 && !error.config._retry) {
      error.config._retry = true;
      setTimeout(() => console.log("attempting refresh"), 500);

      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        window.location.href = "/logout";
        throw new Error("Missing refresh token");
      }

      try {
        const response = await apiInstance.post(`/api/refresh`, {
          token: refreshToken,
        });
        const user = response.data;
        localStorage.setItem("refreshToken", user.refreshToken);
        // Update stored access token
        return axios(error.config);
      } catch (refreshError) {
        console.error(`Failed to refresh token: ${refreshError}`);
        localStorage.removeItem("refreshToken");
        window.location.href = "/logout";
        throw refreshError;
      }
    }
    if (error.response.status === 401 && !error.config._retry) {
      error.config._retry = true;
      setTimeout(() => console.log("loging out"), 500);

      window.location.href = "/logout";
    }
    return Promise.reject(error);
  },
);

export default apiInstance;
