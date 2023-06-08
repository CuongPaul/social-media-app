import { useContext, useState } from "react";
import axios from "axios";
import { PostContext, UIContext } from "../App";
import callApi from "../api";
const url = process.env.REACT_APP_BASE_API_URL;

const useCreateComment = ({
    post_id,
    commentText,
    setCommentText,
    commentImage,
    removeFileImage,
    setShowEmoji,
}) => {
    const { uiDispatch } = useContext(UIContext);
    const { postDispatch } = useContext(PostContext);

    const [loading, setLoading] = useState(false);

    const createComment = async (uri) => {
        setLoading(true);
        try {
            const { message } = await callApi({
                url: "/comment",
                method: "POST",
                data: { text: commentText, image: uri, post_id: post_id },
            });

            setCommentText("");
            postDispatch({
                type: "ADD_POST_COMMENT",
                payload: { text: commentText, image: uri, post_id: post_id },
            });
            uiDispatch({
                type: "SET_ALERT_MESSAGE",
                payload: {
                    color: "success",
                    display: true,
                    text: message,
                },
            });
        } catch (err) {
            setLoading(false);

            uiDispatch({
                type: "SET_ALERT_MESSAGE",
                payload: { text: err.message, display: true, color: "error" },
            });
        }
    };

    const handleSubmitComment = async (e) => {
        e.preventDefault();

        if (commentImage) {
            const formData = new FormData();
            formData.append("files", commentImage);
            formData.append("folder", "comment");

            const { data } = await callApi({
                url: "/upload/files",
                method: "POST",
                data: formData,
            });

            createComment(data.images[0]);
        } else {
            createComment();
        }
        removeFileImage();
        setShowEmoji(false);
    };

    return {
        handleSubmitComment,
        loading,
    };
};

export default useCreateComment;
