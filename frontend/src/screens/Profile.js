import { useParams } from "react-router-dom";
import React, { useState, useEffect, useContext } from "react";
import { Tab, Grid, Tabs, Paper, AppBar, Divider } from "@material-ui/core";

import callApi from "../api";
import { UIContext } from "../App";
import Friends from "../components/Profile/Friends";
import TabPanel from "../components/Profile/TabPanel";
import ProfileHeader from "../components/Profile/ProfileHeader";
import ProfileTimeline from "../components/Profile/ProfileTimeline";

const Profile = ({ userData, conScreen }) => {
    const { uiState } = useContext(UIContext);

    const params = useParams();

    const [tab, setTab] = useState(0);
    const [user, setUser] = useState(null);

    useEffect(() => {
        (async () => {
            const abc = userData ? userData._id : params.userId;
            const { data } = await callApi({ url: `/user/${abc}`, method: "GET" });

            setUser(data);
        })();
    }, [userData, params.userId]);

    return (
        <div style={{ minHeight: "100vh" }}>
            <Paper
                style={{
                    width: "100%",
                    backgroundColor: uiState.darkMode && "rgb(36,37,38)",
                }}
            >
                {user && <ProfileHeader user={user} />}
                <Grid container justifyContent="center" alignItems="center">
                    <Grid item xs={12} sm={12} md={6}>
                        <Divider />
                        <AppBar
                            elevation={0}
                            position="static"
                            style={{
                                alignItems: "center",
                                color: uiState.darkMode ? "rgb(255,255,255)" : "rgb(0,0,0)",
                                background: uiState.darkMode ? "rgb(36,37,38)" : "rgb(255,255,255)",
                            }}
                        >
                            <Tabs value={tab} onChange={(_e, newValue) => setTab(newValue)}>
                                <Tab label="Timeline" />
                                <Tab label="Friends" />
                            </Tabs>
                        </AppBar>
                    </Grid>
                </Grid>
            </Paper>
            <Grid container justifyContent="center">
                <Grid item xs={12} sm={12} md={conScreen ? 12 : 8}>
                    {user && (
                        <TabPanel id={0} index={tab}>
                            <ProfileTimeline user={user} />
                        </TabPanel>
                    )}
                    <TabPanel id={1} index={tab}>
                        <Friends friends={user?.friends} />
                    </TabPanel>
                </Grid>
            </Grid>
        </div>
    );
};

export default Profile;
