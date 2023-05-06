import axios from "axios";

const baseURL = process.env.REACT_APP_BASE_API_URL;

const reactPost = async ({ postId, reactType }) => {
    try {
        const token = localStorage.getItem("token");

        const { data } = await axios({
            method: "POST",
            timeout: 3 * 1000,
            params: { key: reactType },
            url: `/react-post/${postId}`,
            baseURL: `${baseURL}//post`,
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

const createPost = async (postInfo) => {
    try {
        const token = localStorage.getItem("token");

        const { data } = await axios({
            url: `/`,
            method: "POST",
            data: postInfo,
            timeout: 3 * 1000,
            baseURL: `${baseURL}//post`,
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

const deletePost = async (postId) => {
    try {
        const token = localStorage.getItem("token");

        const { data } = await axios({
            method: "DELETE",
            url: `/${postId}`,
            timeout: 3 * 1000,
            baseURL: `${baseURL}//post`,
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

const updatePost = async (postId) => {
    try {
        const token = localStorage.getItem("token");

        const { data } = await axios({
            method: "PUT",
            url: `/${postId}`,
            timeout: 3 * 1000,
            baseURL: `${baseURL}//post`,
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

const getAllPosts = async (page) => {
    try {
        const token = localStorage.getItem("token");

        const { data } = await axios({
            url: `/`,
            method: "GET",
            params: { page },
            timeout: 3 * 1000,
            baseURL: `${baseURL}//post`,
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

const getPostsByUser = async (userId) => {
    try {
        const token = localStorage.getItem("token");

        const { data } = await axios({
            method: "GET",
            url: `/${userId}`,
            timeout: 3 * 1000,
            baseURL: `${baseURL}//post`,
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

export { reactPost, createPost, deletePost, updatePost, getAllPosts, getPostsByUser };
