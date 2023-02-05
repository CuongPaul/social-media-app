import axios from "axios";

const baseURL = process.env.REACT_APP_BASE_API_URL;

const readNotification = async (notificationId) => {
    try {
        const token = localStorage.token && JSON.parse(localStorage.token);

        const { data } = await axios({
            method: "PUT",
            url: `/${notificationId}`,
            baseURL: `${baseURL}/api/notification`,
            headers: { Authorization: `Bearer ${token}` },
        });

        return data;
    } catch (err) {
        throw new Error(err.response.data.message);
    }
};

const readAllNotification = async () => {
    try {
        const token = localStorage.token && JSON.parse(localStorage.token);

        const { data } = await axios({
            method: "PUT",
            url: `/read-all`,
            baseURL: `${baseURL}/api/notification`,
            headers: { Authorization: `Bearer ${token}` },
        });

        return data;
    } catch (err) {
        throw new Error(err.response.data.message);
    }
};

const getNotificationsByKey = async (notificationKey) => {
    try {
        const token = localStorage.token && JSON.parse(localStorage.token);

        const { data } = await axios({
            method: "PUT",
            url: `/get-by-key/${notificationKey}`,
            baseURL: `${baseURL}/api/notification`,
            headers: { Authorization: `Bearer ${token}` },
        });

        return data;
    } catch (err) {
        throw new Error(err.response.data.message);
    }
};

const getNotificationsByCurrentUser = async () => {
    try {
        const token = localStorage.token && JSON.parse(localStorage.token);

        const { data } = await axios({
            url: `/`,
            method: "GET",
            baseURL: `${baseURL}/api/notification`,
            headers: { Authorization: `Bearer ${token}` },
        });

        return data;
    } catch (err) {
        throw new Error(err.response.data.message);
    }
};

export {
    readNotification,
    readAllNotification,
    getNotificationsByKey,
    getNotificationsByCurrentUser,
};
