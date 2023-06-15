import { useState, useContext } from "react";

import callApi from "../api";
import { UIContext, PostContext } from "../App";

const usePost = () => {
    const { uiDispatch } = useContext(UIContext);
    const { postDispatch } = useContext(PostContext);

    const [isLoading, setIsLoading] = useState(false);

    const handleGetPosts = async (page) => {
        setIsLoading(true);

        try {
            const { data } = await callApi({
                method: "GET",
                query: { page },
                url: `/post`,
            });
            postDispatch({ type: "ADD_POSTS", payload: data.rows });

            setIsLoading(false);
        } catch (err) {
            setIsLoading(false);
            uiDispatch({
                type: "SET_ALERT_MESSAGE",
                payload: { display: true, color: "error", text: err.message },
            });
        }
    };

    const handleCreatePost = async ({ postData, setIsOpen, filesUpload }) => {
        setIsLoading(true);

        try {
            const formData = new FormData();

            if (filesUpload.length) {
                for (let i = 0; i < filesUpload.length; i++) {
                    formData.append("images", filesUpload[i]);
                }
            }

            formData.append("text", postData.text);
            formData.append("privacy", postData.privacy);
            formData.append("body", JSON.stringify(postData.body));

            const { data } = await callApi({ url: "/post", method: "POST", data: formData });
            setIsLoading(false);

            postDispatch({ payload: data, type: "CREATE_POST" });

            setIsOpen(false);
        } catch (err) {
            setIsLoading(false);
            uiDispatch({
                type: "SET_ALERT_MESSAGE",
                payload: { text: err.message, display: true, color: "error" },
            });
        }
    };

    const handleDeletePost = async (postId, setIsOpen) => {
        setIsLoading(true);

        try {
            const { message } = await callApi({ method: "DELETE", url: `/post/${postId}` });
            setIsLoading(false);

            postDispatch({ payload: postId, type: "DELETE_POST" });

            uiDispatch({
                type: "SET_ALERT_MESSAGE",
                payload: { text: message, display: true, color: "success" },
            });

            setIsOpen(false);
        } catch (err) {
            setIsLoading(false);
            uiDispatch({
                type: "SET_ALERT_MESSAGE",
                payload: { text: err.message, display: true, color: "error" },
            });
        }
    };

    const handleUpdatePost = async ({ postId, postData, setIsOpen, filesUpload, filesPreview }) => {
        setIsLoading(true);

        try {
            const formData = new FormData();

            if (filesUpload.length) {
                for (let i = 0; i < filesUpload.length; i++) {
                    formData.append("images", filesUpload[i]);
                }
            }

            const oldImages = filesPreview.filter((item) => postData.images.includes(item));

            formData.append("text", postData.text);
            formData.append("privacy", postData.privacy);
            formData.append("body", JSON.stringify(postData.body));
            formData.append("old_images", JSON.stringify(oldImages));

            const { data } = await callApi({
                method: "PUT",
                data: formData,
                url: `/post/${postId}`,
            });
            setIsLoading(false);

            postDispatch({ payload: data, type: "UPDATE_POST" });

            setIsOpen(false);
        } catch (err) {
            setIsLoading(false);
            uiDispatch({
                type: "SET_ALERT_MESSAGE",
                payload: { text: err.message, display: true, color: "error" },
            });
        }
    };

    const handleGetPostsByUser = async (page, userId) => {
        setIsLoading(true);

        try {
            const { data } = await callApi({
                method: "GET",
                query: { page },
                url: `/post/user/${userId}`,
            });
            postDispatch({ type: "ADD_POSTS", payload: data.rows });

            setIsLoading(false);
        } catch (err) {
            setIsLoading(false);
            uiDispatch({
                type: "SET_ALERT_MESSAGE",
                payload: { display: true, color: "error", text: err.message },
            });
        }
    };

    return {
        isLoading,
        handleGetPosts,
        handleCreatePost,
        handleDeletePost,
        handleUpdatePost,
        handleGetPostsByUser,
    };
};

export default usePost;
