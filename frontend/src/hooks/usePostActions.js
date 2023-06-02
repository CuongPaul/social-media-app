import { useState, useContext } from "react";

import callApi from "../api";
import { UIContext } from "../App";

const usePostActions = ({ postData, setIsOpen, filesUpload, filesPreview }) => {
    const { uiDispatch } = useContext(UIContext);

    const [loading, setLoading] = useState(false);

    const handleUpdatePost = async (postDataId) => {
        setLoading(true);

        try {
            const formData = new FormData();

            if (filesUpload.length) {
                formData.append("folder", "post");
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
                url: `/post/${postDataId}`,
            });
            setLoading(false);

            uiDispatch({ payload: data, type: "UPDATE_POST" });

            setIsOpen(false);
        } catch (err) {
            setLoading(false);
            uiDispatch({
                type: "SET_ALERT_MESSAGE",
                payload: { text: err.message, display: true, color: "error" },
            });
        }
    };

    const handleDeletePost = async (postId) => {
        setLoading(true);

        try {
            const { message } = await callApi({ method: "DELETE", url: `/post/${postId}` });
            setLoading(false);

            uiDispatch({ payload: postId, type: "DELETE_POST" });

            uiDispatch({
                type: "SET_ALERT_MESSAGE",
                payload: { text: message, display: true, color: "success" },
            });

            setIsOpen(false);
        } catch (err) {
            setLoading(false);
            uiDispatch({
                type: "SET_ALERT_MESSAGE",
                payload: { text: err.message, display: true, color: "error" },
            });
        }
    };

    const handleCreatePost = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const formData = new FormData();

            if (filesUpload.length) {
                formData.append("folder", "post");
                for (let i = 0; i < filesUpload.length; i++) {
                    formData.append("images", filesUpload[i]);
                }
            }

            formData.append("text", postData.text);
            formData.append("privacy", postData.privacy);
            formData.append("body", JSON.stringify(postData.body));

            const { data } = await callApi({ url: "/post", method: "POST", data: formData });
            setLoading(false);

            uiDispatch({ payload: data, type: "CREATE_POST" });

            setIsOpen(false);
        } catch (err) {
            setLoading(false);
            uiDispatch({
                type: "SET_ALERT_MESSAGE",
                payload: { text: err.message, display: true, color: "error" },
            });
        }
    };

    return { loading, handleCreatePost, handleDeletePost, handleUpdatePost };
};

export default usePostActions;
