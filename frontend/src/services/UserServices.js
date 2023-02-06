import axios from "axios";

const baseURL = process.env.REACT_APP_BASE_API_URL;

const unfriend = async (friendId) => {
    try {
        const token = localStorage.token && JSON.parse(localStorage.token);

        const { data } = await axios({
            method: "PUT",
            timeout: 3 * 1000,
            url: `/unfriend/${friendId}`,
            baseURL: `${baseURL}/friend-request`,
            headers: { Authorization: token },
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

const getUserById = async (userId) => {
    try {
        const token = localStorage.token && JSON.parse(localStorage.token);

        const { data } = await axios({
            method: "GET",
            url: `/${userId}`,
            timeout: 3 * 1000,
            baseURL: `${baseURL}/user`,
            headers: { Authorization: token },
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

const searchUsers = async (userName) => {
    try {
        const { data } = await axios({
            method: "GET",
            url: `/search`,
            timeout: 3 * 1000,
            params: { name: userName },
            baseURL: `${baseURL}/user`,
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

const updateProfile = async (userInfo) => {
    try {
        const token = localStorage.token && JSON.parse(localStorage.token);

        const { data } = await axios({
            method: "PUT",
            data: userInfo,
            timeout: 3 * 1000,
            url: `/update-profile`,
            baseURL: `${baseURL}/user`,
            headers: { Authorization: token },
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

const updatePassword = async () => {
    try {
        const token = localStorage.token && JSON.parse(localStorage.token);

        const { data } = await axios({
            method: "GET",
            timeout: 3 * 1000,
            url: "/update-password",
            baseURL: `${baseURL}/auth`,
            headers: { Authorization: token },
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

const getCurrentUser = async () => {
    try {
        const token = localStorage.token && JSON.parse(localStorage.token);

        const { data } = await axios({
            url: ``,
            method: "GET",
            timeout: 3 * 1000,
            baseURL: `${baseURL}/user`,
            headers: { Authorization: token },
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

const updateCoverImage = async (imageURL) => {
    try {
        const token = localStorage.token && JSON.parse(localStorage.token);

        const { data } = await axios({
            method: "PUT",
            timeout: 3 * 1000,
            url: `/cover-image`,
            baseURL: `${baseURL}/user`,
            data: { cover_image: imageURL },
            headers: { Authorization: token },
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

const getRecommendUsers = async () => {
    try {
        const token = localStorage.token && JSON.parse(localStorage.token);

        const { data } = await axios({
            method: "GET",
            timeout: 3 * 1000,
            url: `/recommend-users`,
            baseURL: `${baseURL}/user`,
            headers: { Authorization: token },
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

const updateAvatarImage = async (imageURL) => {
    try {
        const token = localStorage.token && JSON.parse(localStorage.token);

        const { data } = await axios({
            method: "PUT",
            timeout: 3 * 1000,
            url: `/avatar-image`,
            baseURL: `${baseURL}/user`,
            data: { avatar_image: imageURL },
            headers: { Authorization: token },
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
    unfriend,
    getUserById,
    searchUsers,
    updateProfile,
    updatePassword,
    getCurrentUser,
    updateCoverImage,
    getRecommendUsers,
    updateAvatarImage,
};
