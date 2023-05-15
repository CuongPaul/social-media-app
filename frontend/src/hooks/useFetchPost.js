import { useState, useContext } from "react";

import callApi from "../api";
import { UIContext, PostContext } from "../App";
// import { getAllPosts } from "../services/PostServices";

const useFetchPost = () => {
    const { uiDispatch } = useContext(UIContext);
    const { postState, postDispatch } = useContext(PostContext);

    const [loading, setLoading] = useState(false);

    const fetchComments = async (post_id) => {
        setLoading(true);

        try {
            const { data } = await callApi({
                method: "GET",
                url: "/comment",
                query: { post_id: post_id },
            });

            setLoading(false);
            postDispatch({
                type: "COMMENT_PAGINATION",
                payload: {
                    currentPage: 1,
                    totalPage: data.count,
                    comments: data.rows,
                },
            });
        } catch (err) {
            setLoading(false);
            uiDispatch({
                type: "SET_NOTIFICATION",
                payload: { display: true, color: "error", text: err.message },
            });
        }
    };

    const fetchPosts = async () => {
        if (postState.postPagination.currentPage > postState.postPagination.totalPage) {
            return;
        } else {
            setLoading(true);
            try {
                // const { data } = await getAllPosts(postState.postPagination.currentPage);

                setLoading(false);

                // if (data) {
                //     postDispatch({
                //         type: "POST_PAGINATION",
                //         payload: {
                //             currentPage: data.pagination.currentPage + 1,
                //             totalPage: data.pagination.totalPage,
                //             posts: data.posts,
                //         },
                //     });
                // }
            } catch (err) {
                setLoading(false);

                uiDispatch({
                    type: "SET_NOTIFICATION",
                    payload: {
                        text: err.message,
                        display: true,
                        color: "error",
                    },
                });
            }
        }
    };

    return {
        fetchPosts,
        fetchComments,
        loading,
    };
};

export default useFetchPost;
