import { useState, useContext } from "react";
import { useHistory } from "react-router-dom";

import callApi from "../api";
import { UIContext, PostContext } from "../App";

const useCreatePost = ({ postData, body, filesUpload }) => {
    const { uiDispatch } = useContext(UIContext);
    const { postDispatch } = useContext(PostContext);

    const history = useHistory();
    const [loading, setLoading] = useState(false);

    const createPost = async (formValue) => {
        setLoading(true);

        try {
            const { message } = await callApi({
                url: "/post",
                method: "POST",
                data: formValue,
            });
            setLoading(false);

            if (message) {
                postDispatch({ type: "ADD_POST", payload: formValue });
                uiDispatch({
                    type: "SET_ALERT_MESSAGE",
                    payload: {
                        display: true,
                        text: message,
                        color: "success",
                    },
                });
                uiDispatch({ type: "DISPLAY_POST_DIALOG", payload: false });
                history.push("/");
            }
        } catch (err) {
            setLoading(false);

            uiDispatch({
                type: "SET_ALERT_MESSAGE",
                payload: { text: err.message, display: true, color: "error" },
            });
        }
    };

    const createUserPost = async (uri = "") => {
        await createPost({
            ...postData,
            body: {
                ...postData.body,
                tag_friends: postData.body.tag_friends.map((item) => item._id),
            },
            images: uri ? [...uri] : null,
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

            formData.append("text", postData.text);
            formData.append("privacy", postData.privacy);
            console.log(" postData.body.tag_friends: ", postData.body.tag_friends);
            postData.body.tag_friends = postData.body.tag_friends.map((item) => item._id);
            formData.append("body", JSON.stringify(postData.body));

            await callApi({
                url: "/post",
                method: "POST",
                data: formData,
            });

            // const { data } = await callApi({
            //     url: "/upload/files",
            //     method: "POST",
            //     data: formData,
            // });

            // createUserPost(data.images);
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
