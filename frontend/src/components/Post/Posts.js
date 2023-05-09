import React, { Fragment, useContext } from "react";
import { Button, Typography } from "@material-ui/core";

import Post from "./Post";
import { PostContext } from "../../App";
import useFetchPost from "../../hooks/useFetchPost";

const Posts = () => {
    const { postState } = useContext(PostContext);
    const { postDispatch } = useContext(PostContext);
    const posts = postState.posts;
    const { fetchPosts } = useFetchPost();

    const handleFetchPosts = () => {
        fetchPosts();
    };
    const handleDeletePost = (postId) => {
        const newPosts = posts.filter((post) => post.id !== postId);

        postDispatch({ type: "DELETE_POST", payload: newPosts });
    };

    return (
        <Fragment>
            {posts.map((post) => (
                <div key={post._id}>
                    <Post post={post} handleDeletePost={handleDeletePost} />
                </div>
            ))}
            <div
                style={{
                    display: "flex",
                    marginTop: "20px",
                    justifyContent: "center",
                }}
            >
                {postState.postPagination.totalPage <= postState.postPagination.currentPage ? (
                    <Typography style={{ color: "teal" }} variant="body2">
                        No more posts
                    </Typography>
                ) : (
                    <Button variant="contained" color="primary" onClick={handleFetchPosts}>
                        More Posts
                    </Button>
                )}
            </div>
        </Fragment>
    );
};

export default Posts;
