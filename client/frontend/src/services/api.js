const BASE_URL = "http://localhost:5005/api";

 
// later replace with deployed backend URL

export const apiRequest = async (endpoint, method = "GET", data, token) => {
  const headers = {};

  if (!(data instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers,
    body: data
      ? data instanceof FormData
        ? data
        : JSON.stringify(data)
      : null,
  });
  // const da = await response.json()
  // console.log('data:',da);
  

  return response.json();
};
