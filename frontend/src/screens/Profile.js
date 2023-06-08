import { useParams } from "react-router-dom";
import React, { useState, Fragment, useEffect, useContext } from "react";
import { Tab, Grid, Tabs, Paper, AppBar, Divider } from "@material-ui/core";

import callApi from "../api";
import Posts from "../components/Post/Posts";
import PostBar from "../components/Post/PostBar";
import Friends from "../components/Profile/Friends";
import TabPanel from "../components/Profile/TabPanel";
import { UIContext, UserContext, PostContext } from "../App";
import ProfileHeader from "../components/Profile/ProfileHeader";

const Profile = ({ userId, conScreen }) => {
    const {
        uiDispatch,
        uiState: { darkMode },
    } = useContext(UIContext);
    const {
        userState: { currentUser },
    } = useContext(UserContext);
    const { postDispatch } = useContext(PostContext);

    const params = useParams();
    const [tab, setTab] = useState(0);
    const [user, setUser] = useState(null);

    useEffect(() => {
        if (userId === currentUser?._id || params.userId === currentUser?._id) {
            setUser(currentUser);
        }
    }, [currentUser]);

    useEffect(() => {
        (async () => {
            try {
                if (userId !== currentUser?._id || params.userId !== currentUser?._id) {
                    const { data: userData } = await callApi({
                        method: "GET",
                        url: `/user/${userId ? userId : params.userId}`,
                    });
                    setUser(userData);
                }

                const { data: postsData } = await callApi({
                    method: "GET",
                    url: `/post/user/${userId ? userId : params.userId}`,
                });
                postDispatch({ type: "SET_POSTS", payload: postsData.rows });
            } catch (err) {
                uiDispatch({
                    type: "SET_ALERT_MESSAGE",
                    payload: { display: true, color: "error", text: err.message },
                });
            }
        })();
    }, [userId, params.userId]);

    return (
        <Fragment>
            <Paper>
                <ProfileHeader user={user} />
                <Grid container justifyContent="center" alignItems="center">
                    <Grid item xs={12} sm={12} md={6}>
                        <Divider />
                        <AppBar
                            elevation={0}
                            position="static"
                            style={{
                                alignItems: "center",
                                color: darkMode ? "rgb(255,255,255)" : "rgb(0,0,0)",
                                background: darkMode ? "rgb(36,37,38)" : "rgb(255,255,255)",
                            }}
                        >
                            <Tabs value={tab} onChange={(_e, value) => setTab(value)}>
                                <Tab label="Timeline" />
                                <Tab label="Friends" />
                            </Tabs>
                        </AppBar>
                    </Grid>
                </Grid>
            </Paper>
            <Grid container justifyContent="center">
                <Grid item xs={12} sm={12} md={conScreen ? 12 : 8}>
                    <TabPanel id={0} index={tab}>
                        <Grid container justifyContent="center" style={{ marginTop: "25px" }}>
                            <Grid item md={8} xs={12} sm={12}>
                                {user?._id === currentUser?._id && <PostBar />}
                                <Posts userId={userId ? userId : params.userId} />
                            </Grid>
                        </Grid>
                    </TabPanel>
                    <TabPanel id={1} index={tab}>
                        <Friends friends={user?.friends} />
                    </TabPanel>
                </Grid>
            </Grid>
        </Fragment>
    );
};

export default Profile;
