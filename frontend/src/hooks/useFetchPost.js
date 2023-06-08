import { useState, useContext } from "react";

import callApi from "../api";
import { UIContext, PostContext } from "../App";

const useFetchPost = () => {
    const { uiDispatch } = useContext(UIContext);
    const { postDispatch } = useContext(PostContext);

    const [isLoading, setIsLoading] = useState(false);

    const fetchComments = async (post_id) => {
        setIsLoading(true);

        try {
            const { data } = await callApi({
                method: "GET",
                url: "/comment",
                query: { post_id: post_id },
            });
            postDispatch({
                type: "COMMENT_PAGINATION",
                payload: {
                    currentPage: 1,
                    comments: data.rows,
                    totalPage: data.count,
                },
            });

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

            uiDispatch({ type: "ADD_POSTS", payload: data.rows });

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
        fetchComments,
        isLoading,
    };
};

export default useFetchPost;
