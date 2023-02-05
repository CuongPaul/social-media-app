import axios from "axios";

const baseURL = process.env.REACT_APP_BASE_API_URL;

const reactPost = async ({ postId, reactType }) => {
    try {
        const token = localStorage.token && JSON.parse(localStorage.token);

        const { data } = await axios({
            method: "POST",
            params: { key: reactType },
            url: `/react-post/${postId}`,
            baseURL: `${baseURL}/api/post`,
            headers: { Authorization: `Bearer ${token}` },
        });

        return data;
    } catch (err) {
        throw new Error(err.response.data.message);
    }
};

const createPost = async (postInfo) => {
    try {
        const token = localStorage.token && JSON.parse(localStorage.token);

        const { data } = await axios({
            url: `/`,
            method: "POST",
            data: postInfo,
            baseURL: `${baseURL}/api/post`,
            headers: { Authorization: `Bearer ${token}` },
        });

        return data;
    } catch (err) {
        throw new Error(err.response.data.message);
    }
};

const deletePost = async (postId) => {
    try {
        const token = localStorage.token && JSON.parse(localStorage.token);

        const { data } = await axios({
            url: `/${postId}`,
            method: "DELETE",
            baseURL: `${baseURL}/api/post`,
            headers: { Authorization: `Bearer ${token}` },
        });

        return data;
    } catch (err) {
        throw new Error(err.response.data.message);
    }
};

const updatePost = async (postId) => {
    try {
        const token = localStorage.token && JSON.parse(localStorage.token);

        const { data } = await axios({
            method: "PUT",
            url: `/${postId}`,
            baseURL: `${baseURL}/api/post`,
            headers: { Authorization: `Bearer ${token}` },
        });

        return data;
    } catch (err) {
        throw new Error(err.response.data.message);
    }
};

const getAllPosts = async () => {
    try {
        const token = localStorage.token && JSON.parse(localStorage.token);

        const { data } = await axios({
            url: `/`,
            method: "GET",
            baseURL: `${baseURL}/api/post`,
            headers: { Authorization: `Bearer ${token}` },
        });

        return data;
    } catch (err) {
        throw new Error(err.response.data.message);
    }
};

const getPostsByUser = async (userId) => {
    try {
        const token = localStorage.token && JSON.parse(localStorage.token);

        const { data } = await axios({
            method: "GET",
            url: `/${userId}`,
            baseURL: `${baseURL}/api/post`,
            headers: { Authorization: `Bearer ${token}` },
        });

        return data;
    } catch (err) {
        throw new Error(err.response.data.message);
    }
};

export { reactPost, createPost, deletePost, updatePost, getAllPosts, getPostsByUser };
