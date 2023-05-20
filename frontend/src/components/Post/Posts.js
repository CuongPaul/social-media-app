import React, { Fragment, useContext } from "react";
import { Button, Typography } from "@material-ui/core";

import Post from "./Post";
import useFetchPost from "../../hooks/useFetchPost";

const Posts = ({ posts }) => {
    const { fetchPosts } = useFetchPost();

    const handleDeletePost = (postId) => {
        posts.filter((post) => post.id !== postId);
    };

    const handleFetchPosts = () => {
        fetchPosts();
    };
    console.log("ABC: ", posts);
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
                <Button variant="contained" color="primary" onClick={handleFetchPosts}>
                    More Posts
                </Button>
            </div>
        </Fragment>
    );
};

export default Posts;
