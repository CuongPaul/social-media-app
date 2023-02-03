import axios from "axios";

const baseURL = process.env.REACT_APP_BASE_API_URL;
const token = localStorage.token && JSON.parse(localStorage.token);

const unfriend = async (friendId) => {
    try {
        const { data } = await axios({
            method: "PUT",
            url: `/unfriend/${friendId}`,
            baseURL: `${baseURL}/api/friend-request`,
            headers: { Authorization: `Bearer ${token}` },
        });

        return data.data;
    } catch (err) {
        return {
            errorMessage: err.response.data.message,
        };
    }
};

const sendFriendRequest = async (receiverId) => {
    try {
        const { data } = await axios({
            method: "POST",
            url: `/${receiverId}`,
            baseURL: `${baseURL}/api/friend-request`,
            headers: { Authorization: `Bearer ${token}` },
        });

        return data.data;
    } catch (err) {
        return {
            errorMessage: err.response.data.message,
        };
    }
};

const acceptFriendRequest = async (friendRequestId) => {
    try {
        const { data } = await axios({
            method: "PUT",
            url: `/${friendRequestId}`,
            baseURL: `${baseURL}/api/friend-request`,
            headers: { Authorization: `Bearer ${token}` },
        });

        return data.data;
    } catch (err) {
        return {
            errorMessage: err.response.data.message,
        };
    }
};

const declineOrCancelRequest = async (friendRequestId) => {
    try {
        const { data } = await axios({
            method: "DELETE",
            url: `/${friendRequestId}`,
            baseURL: `${baseURL}/api/friend-request`,
            headers: { Authorization: `Bearer ${token}` },
        });

        return data.data;
    } catch (err) {
        return {
            errorMessage: err.response.data.message,
        };
    }
};

const getSendedFriendRequests = async () => {
    try {
        const { data } = await axios({
            method: "GET",
            url: `/sended`,
            baseURL: `${baseURL}/api/friend-request`,
            headers: { Authorization: `Bearer ${token}` },
        });

        return data.data;
    } catch (err) {
        return {
            errorMessage: err.response.data.message,
        };
    }
};

const getReceivedFriendRequests = async () => {
    try {
        const { data } = await axios({
            method: "GET",
            url: `/received`,
            baseURL: `${baseURL}/api/friend-request`,
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
    unfriend,
    sendFriendRequest,
    acceptFriendRequest,
    declineOrCancelRequest,
    getSendedFriendRequests,
    getReceivedFriendRequests,
};
