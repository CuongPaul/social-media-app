import { Grid } from "@material-ui/core";
import React, { useContext, useEffect, useState } from "react";

import Posts from "../Post/Posts";
import { UserContext } from "../../App";
import PostBar from "../Post/PostBar";
import callApi from "../../api";

const ProfileTimeline = ({ user }) => {
    const { userState } = useContext(UserContext);

    const [posts, setPostUser] = useState(null);

    useEffect(() => {
        (async () => {
            const { data } = await callApi({ url: `/post/user/${user._id}`, method: "GET" });

            setPostUser(data.rows);
        })();
    }, []);

    return posts ? (
        <Grid container justifyContent="center" style={{ marginTop: "25px" }} spacing={2}>
            <Grid item xs={12} sm={12} md={8}>
                {userState.currentUser._id === user._id && <PostBar />}
                <Posts posts={posts} />
            </Grid>
        </Grid>
    ) : null;
};

export default ProfileTimeline;
