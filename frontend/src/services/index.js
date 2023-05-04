import axios from "axios";

const callApi = async ({ url, data, query, method }) => {
    const baseURL = process.env.REACT_APP_BASE_API_URL;
    const token = localStorage.token && JSON.parse(localStorage.token);

    const res = await axios({
        url,
        data,
        method,
        baseURL,
        params: query,
        timeout: 5 * 1000,
        headers: { Authorization: token },
    }).catch((err) => {
        if (err.response) {
            return { status: err.response.status, message: err.response.data.message };
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

export default callApi;
