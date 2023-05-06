import axios from "axios";

const CallAPI = async ({ url, data, query, method }) => {
    const token = localStorage.token;
    const baseURL = process.env.REACT_APP_BASE_API_URL;
    const options = { url, method, baseURL, timeout: 3 * 1000 };

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
            throw new Error(err.response.data.message);
        } else {
            if (err.request) {
                throw new Error("The connection has time out");
            } else {
                throw new Error(err.message);
            }
        }
    });

    return res.data;
};

export default CallAPI;
