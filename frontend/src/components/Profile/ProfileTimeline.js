import { Grid } from "@material-ui/core";
import React, { useContext, useEffect, useState } from "react";

import Posts from "../Post/Posts";
import { UserContext } from "../../App";
import WritePostCard from "../Post/PostBar";
import callApi from "../../api";

const ProfileTimeline = ({ user }) => {
    const { userState } = useContext(UserContext);

    const [postUser, setPostUser] = useState(null);

    useEffect(() => {
        (async () => {
            const { data } = await callApi({ url: `/post/user/${user._id}`, method: "GET" });

            setPostUser(data.rows);
        })();
    }, []);

    return postUser ? (
        <Grid container justifyContent="center" style={{ marginTop: "25px" }} spacing={2}>
            <Grid item xs={12} sm={12} md={8}>
                {userState.currentUser._id === user._id && <WritePostCard />}
                <Posts postUser={postUser} />
            </Grid>
        </Grid>
    ) : null;
};

export default ProfileTimeline;
