import { useContext, useState } from "react";
import axios from "axios";
import { PostContext, UIContext } from "../App";
import { storage } from "../firebase/firebase";
import callApi from "../api";
const url = process.env.REACT_APP_BASE_API_URL;

const useCreateComment = ({
    post_id,
    commentText,
    setError,
    setCommentText,
    commentImage,
    removeFileImage,
    setShowEmoji,
}) => {
    const [loading, setLoading] = useState(false);

    const { postDispatch } = useContext(PostContext);
    const { uiDispatch } = useContext(UIContext);

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
                type: "SET_NOTIFICATION",
                payload: {
                    color: "success",
                    display: true,
                    text: message,
                },
            });
        } catch (err) {
            setLoading(false);

            uiDispatch({
                type: "SET_NOTIFICATION",
                payload: { text: err.message, display: true, color: "error" },
            });
        }
    };

    const handleSubmitComment = async (e) => {
        if (commentImage) {
            const { data } = await callApi({
                url: "/upload/files",
                method: "POST",
                data: commentImage,
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
