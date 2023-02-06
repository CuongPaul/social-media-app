import axios from "axios";

const baseURL = process.env.REACT_APP_BASE_API_URL;

const sendMessage = async (roomId) => {
    try {
        const token = localStorage.token && JSON.parse(localStorage.token);

        const { data } = await axios({
            method: "POST",
            url: `/${roomId}`,
            timeout: 3 * 1000,
            baseURL: `${baseURL}//message`,
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

const getMessages = async ({ roomId, page }) => {
    try {
        const token = localStorage.token && JSON.parse(localStorage.token);

        const { data } = await axios({
            method: "GET",
            params: { page },
            url: `/${roomId}`,
            timeout: 3 * 1000,
            baseURL: `${baseURL}//message`,
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

const reactMessage = async ({ messageId, reactType }) => {
    try {
        const token = localStorage.token && JSON.parse(localStorage.token);

        const { data } = await axios({
            method: "POST",
            timeout: 3 * 1000,
            params: { key: reactType },
            baseURL: `${baseURL}//message`,
            url: `/react-message/${messageId}`,
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

const deleteMessage = async (meassageId) => {
    try {
        const token = localStorage.token && JSON.parse(localStorage.token);

        const { data } = await axios({
            method: "DELETE",
            timeout: 3 * 1000,
            url: `/${meassageId}`,
            baseURL: `${baseURL}//message`,
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

const updateMessages = async (meassageId) => {
    try {
        const token = localStorage.token && JSON.parse(localStorage.token);

        const { data } = await axios({
            method: "PUT",
            timeout: 3 * 1000,
            url: `/${meassageId}`,
            baseURL: `${baseURL}//message`,
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

export { sendMessage, getMessages, reactMessage, deleteMessage, updateMessages };
