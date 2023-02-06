import { useState, useContext } from "react";

import { UIContext, PostContext } from "../App";
import { getAllPosts } from "../services/PostServices";
import { getCommentsByPost } from "../services/CommentService";

const useFetchPost = () => {
    const { uiDispatch } = useContext(UIContext);
    const { postState, postDispatch } = useContext(PostContext);

    const [loading, setLoading] = useState(false);

    const fetchComments = async (post_id) => {
        if (
            postState.post.commentPagination.currentPage >
            postState.post.commentPagination.totalPage
        ) {
            return;
        }
        setLoading(true);
        try {
            const { data } = await getCommentsByPost(post_id);

            if (data) {
                postDispatch({
                    type: "COMMENT_PAGINATION",
                    payload: {
                        currentPage: data.pagination.currentPage + 1,
                        totalPage: data.pagination.totalPage,
                        comments: data.comments,
                    },
                });
            }
            setLoading(false);
        } catch (err) {
            setLoading(false);
            console.log(err);
        }
    };

    const fetchPosts = async () => {
        if (postState.postPagination.currentPage > postState.postPagination.totalPage) {
            return;
        } else {
            setLoading(true);
            try {
                const { data } = await getAllPosts(postState.postPagination.currentPage);

                setLoading(false);

                if (data) {
                    postDispatch({
                        type: "POST_PAGINATION",
                        payload: {
                            currentPage: data.pagination.currentPage + 1,
                            totalPage: data.pagination.totalPage,
                            posts: data.posts,
                        },
                    });
                }
            } catch (err) {
                setLoading(false);

                uiDispatch({
                    type: "SET_MESSAGE",
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
