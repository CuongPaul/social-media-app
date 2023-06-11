import { useContext, useState } from "react";

import callApi from "../api";
import { PostContext, UIContext } from "../App";

const useSubmitComment = () => {
    const { uiDispatch } = useContext(UIContext);
    const { postDispatch } = useContext(PostContext);

    const [isLoading, setIsLoading] = useState(false);

    const handleCreateComment = async (commentData) => {
        setIsLoading(true);

        try {
            const { text, setText, postId, fileUpload, handleRemoveFile } = commentData;

            let imageUrl = "";
            if (fileUpload) {
                const formData = new FormData();
                formData.append("files", fileUpload);
                formData.append("folder", "comment");

                const { data } = await callApi({
                    data: formData,
                    method: "POST",
                    url: "/upload/files",
                });

                imageUrl = data.images[0];
            }

            const { data } = await callApi({
                method: "POST",
                url: "/comment",
                data: { text, image: imageUrl, post_id: postId },
            });
            console.log("data: ", data);
            postDispatch({ payload: data, type: "ADD_COMMENT" });

            setText("");
            handleRemoveFile();

            setIsLoading(false);
        } catch (err) {
            setIsLoading(true);

            uiDispatch({
                type: "SET_ALERT_MESSAGE",
                payload: { display: true, color: "error", text: err.message },
            });
        }
    };

    const handleUpdateComment = async (commentData) => {
        setIsLoading(true);

        try {
            const { text, setText, commentId, fileUpload, currentImage, handleRemoveFile } =
                commentData;

            let imageUrl = "";
            if (fileUpload) {
                const formData = new FormData();
                formData.append("files", fileUpload);
                formData.append("folder", "comment");

                const { data } = await callApi({
                    method: "POST",
                    data: formData,
                    url: "/upload/files",
                });

                imageUrl = data.images[0];
            }

            const { data } = await callApi({
                method: "PUT",
                url: `/comment/${commentId}`,
                data: { text, image: imageUrl || currentImage },
            });
            postDispatch({ payload: data, type: "UPDATE_COMMENT_SELECTED" });

            setText("");
            handleRemoveFile();

            setIsLoading(false);
        } catch (err) {
            setIsLoading(true);

            uiDispatch({
                type: "SET_ALERT_MESSAGE",
                payload: { display: true, color: "error", text: err.message },
            });
        }
    };

    return {
        isLoading,
        handleCreateComment,
        handleUpdateComment,
    };
};

export default useSubmitComment;