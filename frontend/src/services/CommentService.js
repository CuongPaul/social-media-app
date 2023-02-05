import axios from "axios";

const baseURL = process.env.REACT_APP_BASE_API_URL;

const reactComment = async ({ commentId, reactType }) => {
    try {
        const token = localStorage.token && JSON.parse(localStorage.token);

        const { data } = await axios({
            method: "GET",
            params: { key: reactType },
            baseURL: `${baseURL}/api/comment`,
            url: `/react-comment/${commentId}`,
            headers: { Authorization: `Bearer ${token}` },
        });

        return data;
    } catch (err) {
        throw new Error(err.response.data.message);
    }
};

const createComment = async ({ postId, commentInfo }) => {
    try {
        const token = localStorage.token && JSON.parse(localStorage.token);

        const { data } = await axios({
            method: "POST",
            url: `/${postId}`,
            data: commentInfo,
            baseURL: `${baseURL}/api/comment`,
            headers: { Authorization: `Bearer ${token}` },
        });

        return data;
    } catch (err) {
        throw new Error(err.response.data.message);
    }
};

const deleteComment = async (commentId) => {
    try {
        const token = localStorage.token && JSON.parse(localStorage.token);

        const { data } = await axios({
            method: "DELETE",
            url: `/${commentId}`,
            baseURL: `${baseURL}/api/comment`,
            headers: { Authorization: `Bearer ${token}` },
        });

        return data;
    } catch (err) {
        throw new Error(err.response.data.message);
    }
};

const updateComment = async (commentId) => {
    try {
        const token = localStorage.token && JSON.parse(localStorage.token);

        const { data } = await axios({
            method: "PUT",
            url: `/${commentId}`,
            baseURL: `${baseURL}/api/comment`,
            headers: { Authorization: `Bearer ${token}` },
        });

        return data;
    } catch (err) {
        throw new Error(err.response.data.message);
    }
};

const getCommentsByPost = async (postId) => {
    try {
        const token = localStorage.token && JSON.parse(localStorage.token);

        const { data } = await axios({
            method: "GET",
            url: `/${postId}`,
            baseURL: `${baseURL}/api/comment`,
            headers: { Authorization: `Bearer ${token}` },
        });

        return data;
    } catch (err) {
        throw new Error(err.response.data.message);
    }
};

export { reactComment, createComment, deleteComment, updateComment, getCommentsByPost };
