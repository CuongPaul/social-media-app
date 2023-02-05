import axios from "axios";

const baseURL = process.env.REACT_APP_BASE_API_URL;

const unfriend = async (friendId) => {
    try {
        const token = localStorage.token && JSON.parse(localStorage.token);

        const { data } = await axios({
            method: "PUT",
            url: `/unfriend/${friendId}`,
            baseURL: `${baseURL}/api/friend-request`,
            headers: { Authorization: `Bearer ${token}` },
        });

        return data;
    } catch (err) {
        throw new Error(err.response.data.message);
    }
};

const getUserById = async (userId) => {
    try {
        const token = localStorage.token && JSON.parse(localStorage.token);

        const { data } = await axios({
            method: "GET",
            url: `/${userId}`,
            baseURL: `${baseURL}/api/user`,
            headers: { Authorization: `Bearer ${token}` },
        });

        return data;
    } catch (err) {
        throw new Error(err.response.data.message);
    }
};

const searchUsers = async (userName) => {
    try {
        const { data } = await axios({
            method: "GET",
            url: `/search`,
            params: { name: userName },
            baseURL: `${baseURL}/api/user`,
        });

        return data;
    } catch (err) {
        throw new Error(err.response.data.message);
    }
};

const updateProfile = async (userInfo) => {
    try {
        const token = localStorage.token && JSON.parse(localStorage.token);

        const { data } = await axios({
            method: "PUT",
            data: userInfo,
            url: `/update-profile`,
            baseURL: `${baseURL}/api/user`,
            headers: { Authorization: `Bearer ${token}` },
        });

        return data;
    } catch (err) {
        throw new Error(err.response.data.message);
    }
};

const updatePassword = async () => {
    try {
        const token = localStorage.token && JSON.parse(localStorage.token);

        const { data } = await axios({
            method: "GET",
            url: "/update-password",
            baseURL: `${baseURL}/api/auth`,
            headers: { Authorization: `Bearer ${token}` },
        });

        return data;
    } catch (err) {
        throw new Error(err.response.data.message);
    }
};

const getCurrentUser = async () => {
    try {
        const token = localStorage.token && JSON.parse(localStorage.token);

        const { data } = await axios({
            url: `/`,
            method: "GET",
            timeout: 3 * 1000,
            baseURL: `${baseURL}/api/user`,
            headers: { Authorization: `Bearer ${token}` },
        });

        return data;
    } catch (err) {
        if (err.response) {
            return { status: err.response.status, error: err.response.data.error };
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
            url: `/cover-image`,
            baseURL: `${baseURL}/api/user`,
            data: { cover_image: imageURL },
            headers: { Authorization: `Bearer ${token}` },
        });

        return data;
    } catch (err) {
        throw new Error(err.response.data.message);
    }
};

const getRecommendUsers = async () => {
    try {
        const token = localStorage.token && JSON.parse(localStorage.token);

        const { data } = await axios({
            method: "GET",
            url: `/recommend-users`,
            baseURL: `${baseURL}/api/user`,
            headers: { Authorization: `Bearer ${token}` },
        });

        return data;
    } catch (err) {
        throw new Error(err.response.data.message);
    }
};

const updateAvatarImage = async (imageURL) => {
    try {
        const token = localStorage.token && JSON.parse(localStorage.token);

        const { data } = await axios({
            method: "PUT",
            url: `/avatar-image`,
            baseURL: `${baseURL}/api/user`,
            data: { avatar_image: imageURL },
            headers: { Authorization: `Bearer ${token}` },
        });

        return data;
    } catch (err) {
        throw new Error(err.response.data.message);
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
