import { useState, useContext } from "react";
import { useHistory } from "react-router-dom";

import callApi from "../api";
import { storage } from "../firebase/firebase";
import { UIContext, PostContext } from "../App";

const useCreatePost = ({ postData, body, isCameraImage, filesUpload }) => {
    const { uiDispatch } = useContext(UIContext);
    const { postDispatch } = useContext(PostContext);

    const history = useHistory();
    const [loading, setLoading] = useState(false);

    const createPost = async (formValue) => {
        setLoading(true);

        try {
            console.log(formValue);
            const { message } = await callApi({
                url: "/post",
                method: "POST",
                data: formValue,
            });
            console.log(message);
            setLoading(false);

            if (message) {
                postDispatch({ type: "ADD_POST", payload: formValue });
                uiDispatch({
                    type: "SET_NOTIFICATION",
                    payload: {
                        display: true,
                        text: message,
                        color: "success",
                    },
                });
                uiDispatch({ type: "SET_POST_MODEL", payload: false });
                history.push("/");
            }
        } catch (err) {
            setLoading(false);

            uiDispatch({
                type: "SET_NOTIFICATION",
                payload: { text: err.message, display: true, color: "error" },
            });
        }
    };

    const createUserPost = async (uri = "") => {
        await createPost({
            ...postData,
            images: uri ? [...uri] : null,
            body: {
                ...body,
            },
        });
    };

    const handleSubmitPost = async (e) => {
        e.preventDefault();

        if (filesUpload.length) {
            const formData = new FormData();
            for (let i = 0; i < filesUpload.length; i++) {
                formData.append("files", filesUpload[i]);
            }
            formData.append("folder", "post");

            const { data } = await callApi({
                url: "/upload/files",
                method: "POST",
                data: formData,
            });

            createUserPost(data.images);
        } else {
            createUserPost();
        }
    };
    return {
        handleSubmitPost,
        loading,
    };
};

export default useCreatePost;
