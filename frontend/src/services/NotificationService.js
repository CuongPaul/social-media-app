import axios from "axios";

const baseURL = process.env.REACT_APP_BASE_API_URL;
const token = localStorage.token && JSON.parse(localStorage.token);

const readNotification = async (notificationId) => {
    try {
        const { data } = await axios({
            method: "PUT",
            url: `/${notificationId}`,
            baseURL: `${baseURL}/api/notification`,
            headers: { Authorization: `Bearer ${token}` },
        });

        return data.data;
    } catch (err) {
        return {
            errorMessage: err.response.data.message,
        };
    }
};

const readAllNotification = async () => {
    try {
        const { data } = await axios({
            method: "PUT",
            url: `/read-all`,
            baseURL: `${baseURL}/api/notification`,
            headers: { Authorization: `Bearer ${token}` },
        });

        return data.data;
    } catch (err) {
        return {
            errorMessage: err.response.data.message,
        };
    }
};

const getNotificationsByKey = async (notificationKey) => {
    try {
        const { data } = await axios({
            method: "PUT",
            url: `/get-by-key/${notificationKey}`,
            baseURL: `${baseURL}/api/notification`,
            headers: { Authorization: `Bearer ${token}` },
        });

        return data.data;
    } catch (err) {
        return {
            errorMessage: err.response.data.message,
        };
    }
};

const getNotificationsByCurrentUser = async () => {
    try {
        const { data } = await axios({
            url: `/`,
            method: "GET",
            baseURL: `${baseURL}/api/notification`,
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
    readNotification,
    readAllNotification,
    getNotificationsByKey,
    getNotificationsByCurrentUser,
};
