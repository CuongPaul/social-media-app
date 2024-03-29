import axios from "axios";

const callApi = async ({ url, data, query, method }) => {
  const token = localStorage.getItem("token");
  const baseURL = process.env.REACT_APP_API_URL;
  const options = { url, method, baseURL, timeout: 60 * 1000 };

  if (data) {
    options.data = data;
  }
  if (query) {
    options.params = query;
  }
  if (token) {
    options.headers = { Authorization: token };
  }

  const res = await axios(options).catch((err) => {
    if (err.response) {
      if ([302, 401].includes(err.response.status)) {
        localStorage.removeItem("token");
      }
      if (err.response.status === 500) {
        throw new Error("Internal server error");
      }
      throw new Error(err.response.data.message);
    } else {
      if (err.request) {
        throw new Error("Can't send request to server");
      } else {
        throw new Error(err.message);
      }
    }
  });

  return res.data;
};

export default callApi;
