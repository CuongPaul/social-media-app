import axios from "axios";

const baseURL = process.env.REACT_APP_BASE_API_URL;
const token = localStorage.token && JSON.parse(localStorage.token);

const signin = async (userInfo) => {
    try {
        const { data } = await axios({
            method: "POST",
            url: "/signin",
            data: userInfo,
            baseURL: `${baseURL}/api/auth`,
        });

        return data.data;
    } catch (err) {
        return {
            errorMessage: err.response.data.message,
        };
    }
};

const signup = async (userInfo) => {
    try {
        const { data } = await axios({
            method: "POST",
            url: "/signup",
            data: userInfo,
            baseURL: `${baseURL}/api/auth`,
        });

        return data.data;
    } catch (err) {
        return {
            errorMessage: err.response.data.message,
        };
    }
};

const signout = async () => {
    try {
        const { data } = await axios({
            method: "GET",
            url: "/signout",
            baseURL: `${baseURL}/api/auth`,
            headers: { Authorization: `Bearer ${token}` },
        });

        return data.data;
    } catch (err) {
        localStorage.token && localStorage.removeItem("token");

        return {
            errorMessage: err.response.data.message,
        };
    }
};

export { signin, signup, signout };
