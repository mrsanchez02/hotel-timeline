import axios from "axios";

const pathToUse = import.meta.env.VITE_API_URL || "http://localhost:3000";
console.log("🚀 ~ API URL:", pathToUse)

export const Settings = {
  APIPath: pathToUse
    
};
const options = {
  headers: {
    "Content-Type": "application/json",
    accept: "text/plain",
    "Access-Control-Allow-Origin": "*",
    //   httpsAgent: agent,
  },
};

export const AxiosInstance = axios.create({
  baseURL: Settings.APIPath,
  ...options,
});

const API = {
  postAction: async (endpoint, params, newOpts) =>
    AxiosInstance.post(
      endpoint,
      params !== null ? params : null,
      newOpts && newOpts
    ),
  getAction: async (endpoint, params, newOpts) =>
    AxiosInstance.get(
      endpoint + (params !== null ? "?" + params : ""),
      newOpts && newOpts
    ),
  postActionExternal: async (endpoint, params, newOpts) =>
    axios.post(
      endpoint,
      params !== null ? params : null,
      newOpts !== null ? newOpts : options
    ),
  getActionExternal: async (endpoint, newOpts) => {
    let results = axios.get(endpoint, newOpts);

    return results;
  },
};

export default API;
