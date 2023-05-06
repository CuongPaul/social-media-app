import axios from "axios";

const baseURL = process.env.REACT_APP_BASE_API_URL;

const sendFriendRequest = async (receiverId) => {
    try {
        const token = localStorage.getItem("token");

        const { data } = await axios({
            method: "POST",
            timeout: 3 * 1000,
            url: `/${receiverId}`,
            baseURL: `${baseURL}//friend-request`,
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

const acceptFriendRequest = async (friendRequestId) => {
    try {
        const token = localStorage.getItem("token");

        const { data } = await axios({
            method: "PUT",
            timeout: 3 * 1000,
            url: `/${friendRequestId}`,
            baseURL: `${baseURL}//friend-request`,
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

const declineOrCancelRequest = async (friendRequestId) => {
    try {
        const token = localStorage.getItem("token");

        const { data } = await axios({
            method: "DELETE",
            timeout: 3 * 1000,
            url: `/${friendRequestId}`,
            baseURL: `${baseURL}//friend-request`,
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

const getSendedFriendRequests = async () => {
    try {
        const token = localStorage.getItem("token");

        const { data } = await axios({
            method: "GET",
            url: `/sended`,
            timeout: 3 * 1000,
            baseURL: `${baseURL}//friend-request`,
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

const getReceivedFriendRequests = async () => {
    try {
        const token = localStorage.getItem("token");

        const { data } = await axios({
            method: "GET",
            url: `/received`,
            timeout: 3 * 1000,
            baseURL: `${baseURL}//friend-request`,
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

export {
    sendFriendRequest,
    acceptFriendRequest,
    declineOrCancelRequest,
    getSendedFriendRequests,
    getReceivedFriendRequests,
};
