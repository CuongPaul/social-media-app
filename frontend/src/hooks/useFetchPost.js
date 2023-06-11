import { useState, useContext } from "react";

import callApi from "../api";
import { UIContext, PostContext } from "../App";

const useFetchPost = () => {
    const { uiDispatch } = useContext(UIContext);
    const { postDispatch } = useContext(PostContext);

    const [isLoading, setIsLoading] = useState(false);

    const handleGetComments = async (page, postId) => {
        setIsLoading(true);

        try {
            const { data } = await callApi({
                method: "GET",
                url: "/comment",
                query: { page, post_id: postId },
            });
            postDispatch({ payload: data.rows, type: "ADD_COMMENTS" });

            setIsLoading(false);
        } catch (err) {
            setIsLoading(false);

            uiDispatch({
                type: "SET_ALERT_MESSAGE",
                payload: { display: true, color: "error", text: err.message },
            });
        }
    };

    const handleGetPosts = async (page, userId) => {
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
        handleGetPosts,
        handleGetComments,
        isLoading,
    };
};

export default useFetchPost;
