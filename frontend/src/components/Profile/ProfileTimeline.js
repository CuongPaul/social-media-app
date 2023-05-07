import { Grid } from "@material-ui/core";
import React, { useContext } from "react";

import Posts from "../Post/Posts";
import { UserContext, PostContext } from "../../App";
import WritePostCard from "../Post/PostForm/WritePostCard";

const ProfileTimeline = ({ user }) => {
    const { userState } = useContext(UserContext);
    const { postState } = useContext(PostContext);

    const getUserPost = () => {
        return postState.posts.filter((post) => post.user.id === user.id);
    };
    return (
        <Grid container justifyContent="center" style={{ marginTop: "25px" }} spacing={2}>
            <Grid item xs={12} sm={12} md={8}>
                {userState.currentUser.id === user.id && <WritePostCard />}
                <Posts posts={getUserPost()} />
            </Grid>
        </Grid>
    );
};

export default ProfileTimeline;
