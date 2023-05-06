import axios from "axios";

const baseApiUrl = process.env.REACT_APP_BASE_API_URL;

const signin = async (userInfo) => {
    try {
        const { data } = await axios({
            method: "POST",
            url: "/signin",
            data: userInfo,
            timeout: 3 * 1000,
            baseURL: `${baseApiUrl}/auth`,
        });

        return data;
    } catch (err) {
        if (err.response) {
            return {
                status: err.response.status,
                error: err.response.data.error,
            };
        } else {
            if (err.request) {
                throw new Error("The connection has time out");
            } else {
                throw new Error(err.message);
            }
        }
    }
};

const signup = async (userInfo) => {
    try {
        const { data } = await axios({
            method: "POST",
            url: "/signup",
            data: userInfo,
            timeout: 3 * 1000,
            baseURL: `${baseApiUrl}/auth`,
        });

        return data;
    } catch (err) {
        if (err.response) {
            return {
                status: err.response.status,
                error: err.response.data.error,
            };
        } else {
            if (err.request) {
                throw new Error("The connection has time out");
            } else {
                throw new Error(err.message);
            }
        }
    }
};

const signout = async () => {
    try {
        const token = localStorage.getItem("token");

        const { data } = await axios({
            method: "GET",
            url: "/signout",
            timeout: 3 * 1000,
            baseURL: `${baseApiUrl}//auth`,
            headers: { Authorization: `Bearer ${token}` },
        });

        return data;
    } catch (err) {
        if (err.response) {
            return {
                status: err.response.status,
                error: err.response.data.error,
            };
        } else {
            if (err.request) {
                throw new Error("The connection has time out");
            } else {
                throw new Error(err.message);
            }
        }
    }
};

export { signin, signup, signout };
