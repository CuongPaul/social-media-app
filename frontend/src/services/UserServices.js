import axios from "axios";

const baseURL = process.env.REACT_APP_BASE_API_URL;
const token = localStorage.token && JSON.parse(localStorage.token);

const getUserById = async (userId) => {
    try {
        const { data } = await axios({
            method: "GET",
            url: `/${userId}`,
            baseURL: `${baseURL}/api/user`,
            headers: { Authorization: `Bearer ${token}` },
        });

        return data.data;
    } catch (err) {
        return {
            errorMessage: err.response.data.message,
        };
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

        return data.data;
    } catch (err) {
        return {
            errorMessage: err.response.data.message,
        };
    }
};

const updateProfile = async (userInfo) => {
    try {
        const { data } = await axios({
            method: "PUT",
            data: userInfo,
            url: `/update-profile`,
            baseURL: `${baseURL}/api/user`,
            headers: { Authorization: `Bearer ${token}` },
        });

        return data.data;
    } catch (err) {
        return {
            errorMessage: err.response.data.message,
        };
    }
};

const updatePassword = async () => {
    try {
        const { data } = await axios({
            method: "GET",
            url: "/update-password",
            baseURL: `${baseURL}/api/auth`,
            headers: { Authorization: `Bearer ${token}` },
        });

        return data.data;
    } catch (err) {
        return {
            errorMessage: err.response.data.message,
        };
    }
};

const updateCoverImage = async (imageURL) => {
    try {
        const { data } = await axios({
            method: "PUT",
            url: `/cover-image`,
            baseURL: `${baseURL}/api/user`,
            data: { cover_image: imageURL },
            headers: { Authorization: `Bearer ${token}` },
        });

        return data.data;
    } catch (err) {
        return {
            errorMessage: err.response.data.message,
        };
    }
};

const getRecommendUsers = async () => {
    try {
        const { data } = await axios({
            method: "GET",
            url: `/recommend-users`,
            baseURL: `${baseURL}/api/user`,
            headers: { Authorization: `Bearer ${token}` },
        });

        return data.data;
    } catch (err) {
        return {
            errorMessage: err.response.data.message,
        };
    }
};

const updateAvatarImage = async (imageURL) => {
    try {
        const { data } = await axios({
            method: "PUT",
            url: `/avatar-image`,
            baseURL: `${baseURL}/api/user`,
            data: { avatar_image: imageURL },
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
    getUserById,
    searchUsers,
    updateProfile,
    updatePassword,
    updateCoverImage,
    getRecommendUsers,
    updateAvatarImage,
};
