import { useState, useContext } from "react";
import { useHistory } from "react-router-dom";

import callApi from "../api";
import { UIContext } from "../App";

const useSubmitPost = ({ postData, setIsOpen, filesUpload, filesPreview }) => {
    const { uiDispatch } = useContext(UIContext);

    const history = useHistory();

    const [loading, setLoading] = useState(false);

    const handleUpdatePost = async (postId) => {
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
            formData.append("old_images", JSON.stringify(filesPreview));

            await callApi({ method: "PUT", data: formData, url: `/post/${postId}` });
            setLoading(false);

            setIsOpen(false);
            history.push("/home");
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

            await callApi({ url: "/post", method: "POST", data: formData });
            setLoading(false);

            setIsOpen(false);
            history.push("/home");
        } catch (err) {
            setLoading(false);
            uiDispatch({
                type: "SET_ALERT_MESSAGE",
                payload: { text: err.message, display: true, color: "error" },
            });
        }
    };

    return { loading, handleCreatePost, handleUpdatePost };
};

export default useSubmitPost;
