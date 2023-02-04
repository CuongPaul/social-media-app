import axios from "axios";

const baseURL = process.env.REACT_APP_BASE_API_URL;
const token = localStorage.token && JSON.parse(localStorage.token);

const sendMessage = async (roomId) => {
    try {
        const { data } = await axios({
            method: "POST",
            url: `/${roomId}`,
            baseURL: `${baseURL}/api/message`,
            headers: { Authorization: `Bearer ${token}` },
        });

        return data.data;
    } catch (err) {
        return {
            errorMessage: err.response.data.message,
        };
    }
};

const getMessages = async ({roomId, page}) => {
    try {
        const { data } = await axios({
            method: "GET",
            params: { page },
            url: `/${roomId}`,
            baseURL: `${baseURL}/api/message`,
            headers: { Authorization: `Bearer ${token}` },
        });

        return data.data;
    } catch (err) {
        return {
            errorMessage: err.response.data.message,
        };
    }
};

const reactMessage = async ({ messageId, reactType }) => {
    try {
        const { data } = await axios({
            method: "POST",
            params: { key: reactType },
            baseURL: `${baseURL}/api/message`,
            url: `/react-message/${messageId}`,
            headers: { Authorization: `Bearer ${token}` },
        });

        return data.data;
    } catch (err) {
        return {
            errorMessage: err.response.data.message,
        };
    }
};

const deleteMessage = async (meassageId) => {
    try {
        const { data } = await axios({
            method: "DELETE",
            url: `/${meassageId}`,
            baseURL: `${baseURL}/api/message`,
            headers: { Authorization: `Bearer ${token}` },
        });

        return data.data;
    } catch (err) {
        return {
            errorMessage: err.response.data.message,
        };
    }
};

const updateMessages = async (meassageId) => {
    try {
        const { data } = await axios({
            method: "PUT",
            url: `/${meassageId}`,
            baseURL: `${baseURL}/api/message`,
            headers: { Authorization: `Bearer ${token}` },
        });

        return data.data;
    } catch (err) {
        return {
            errorMessage: err.response.data.message,
        };
    }
};

export {
    sendMessage,
    getMessages,
    reactMessage,
    deleteMessage,
    updateMessages,
};
