import { Grid } from "@material-ui/core";
import React, { useContext, useEffect } from "react";

import callApi from "../../api";
import Posts from "../Post/Posts";
import PostBar from "../Post/PostBar";
import { UIContext, UserContext } from "../../App";

const ProfileTimeline = ({ user }) => {
    const {
        uiDispatch,
        uiState: { posts },
    } = useContext(UIContext);
    const {
        userState: { currentUser },
    } = useContext(UserContext);

    useEffect(() => {
        (async () => {
            try {
                const { data } = await callApi({ method: "GET", url: `/post/user/${user._id}` });

                uiDispatch({ type: "SET_POSTS", payload: data.rows });
            } catch (err) {
                uiDispatch({
                    type: "SET_ALERT_MESSAGE",
                    payload: { display: true, color: "error", text: err.message },
                });
            }
        })();
    }, []);

    return posts ? (
        <Grid container justifyContent="center" style={{ marginTop: "25px" }} spacing={2}>
            <Grid item xs={12} sm={12} md={8}>
                {currentUser._id === user._id && <PostBar />}
                <Posts posts={posts} />
            </Grid>
        </Grid>
    ) : null;
};

export default ProfileTimeline;
