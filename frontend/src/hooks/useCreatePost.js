import { useState, useContext } from "react";
import { useHistory } from "react-router-dom";

import callApi from "../api";
import { storage } from "../firebase/firebase";
import { UIContext, PostContext } from "../App";

const useCreatePost = ({ postData, body, isImageCaptured, postImage, blob }) => {
    const { uiDispatch } = useContext(UIContext);
    const { postDispatch } = useContext(PostContext);

    const history = useHistory();
    const [error, setError] = useState();
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
            images: [uri ? uri : ""],
            body: {
                ...body,
            },
        });
    };

    const handleSubmitPost = (e) => {
        e.preventDefault();

        if (isImageCaptured) {
            let filename = `post/post-${Date.now()}.png`;
            const task = storage.ref(`images/${filename}`).put(blob);

            task.on(
                "state_changed",

                function () {
                    setLoading(true);
                },
                function (error) {
                    console.log("error from firebase");
                    setLoading(false);
                    uiDispatch({ type: "SET_POST_MODEL", payload: false });
                },
                function () {
                    storage
                        .ref("images")
                        .child(filename)
                        .getDownloadURL()
                        .then((uri) => {
                            createUserPost(uri);
                            setLoading(false);
                        });
                }
            );
        } else if (postImage) {
            let filename = `post/post-${Date.now()}-${postImage.name}`;
            const uploadTask = storage.ref(`images/${filename}`).put(postImage);
            uploadTask.on(
                "state_changed",
                () => {
                    setLoading(true);
                },
                (err) => {
                    console.log("error from firebase");
                    setLoading(false);
                    uiDispatch({ type: "SET_POST_MODEL", payload: false });
                },
                () => {
                    storage
                        .ref("images")
                        .child(filename)
                        .getDownloadURL()
                        .then((uri) => {
                            createUserPost(uri);
                        });
                }
            );
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
