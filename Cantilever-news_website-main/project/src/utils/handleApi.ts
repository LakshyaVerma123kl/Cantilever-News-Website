import { getToken } from "./token";

const url = import.meta.env.VITE_BASE_URL;

const request = async (
  method: string,
  api: string,
  payload?: any
): Promise<any> => {
  try {
    const response = await fetch(`${url}${api}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: payload ? JSON.stringify(payload) : undefined,
    });

    const data = await response.json();

    if (!response.ok) {
      return { err: "Some error occurred" };
    }

    return data;
  } catch (error) {
    console.error("Request Error:", error);
    return { err: "An error occured" };
  }
};

const postRequest = (api: string, payload: any) =>
  request("POST", api, payload);
const getRequest = (api: string) => request("GET", api);
const putRequest = (api: string, payload: Object) =>
  request("PUT", api, payload);
const deleteRequest = (api: string) => request("DELETE", api);

// src/api/newsApi.ts
const API_KEY = import.meta.env.VITE_API_KEY; // Replace with your API key
const BASE_URL = "https://newsapi.org/v2";

const fetchNews = async (category: string, searchTerm: string) => {
  const url = `${BASE_URL}/top-headlines?category=${category}&q=${searchTerm}&apiKey=${API_KEY}`;

  try {
    const response = await fetch(url);
    const result = await response.json();

    return result;
  } catch (error) {
    console.error("Error fetching news:", error);
    return { data: [], categories: [] };
  }
};

export { postRequest, getRequest, putRequest, deleteRequest, fetchNews };
