const setToken = (token: string): void => {
  localStorage.setItem("token", token);
};

const getToken = (): string => {
  return localStorage.getItem("token") || "";
};

const removeToken = (): void => {
  localStorage.removeItem("token");
};

export { setToken, getToken, removeToken };
