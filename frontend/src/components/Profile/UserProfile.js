import React, { useState, useContext, useEffect } from "react";
import { Paper, AppBar, Tabs, Tab, Box, Grid, Divider } from "@material-ui/core";

import callApi from "../../api";
import Friends from "./Friends";
import { UIContext } from "../../App";
import ProfileHeader from "./ProfileHeader";
import ProfileTimeline from "./ProfileTimeline";

const UserProfile = ({ userId, conScreen }) => {
    const { uiState } = useContext(UIContext);
    const [value, setValue] = useState(0);
    const [user, setUser] = useState(null);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    useEffect(() => {
        (async () => {
            const { data } = await callApi({ url: `/user/${userId}`, method: "GET" });
            console.log("data: ", data);
            setUser(data);
        })();
    }, []);

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
                            position="static"
                            style={{
                                background: uiState.darkMode ? "rgb(36,37,38)" : "#fff",
                                color: uiState.darkMode ? "#fff" : "black",
                                alignItems: "center",
                            }}
                            elevation={0}
                        >
                            <Tabs
                                value={value}
                                onChange={handleChange}
                                variant="scrollable"
                                scrollButtons="on"
                                indicatorColor="primary"
                            >
                                <Tab label="Timeline" />

                                <Tab label="Friends" />
                            </Tabs>
                        </AppBar>
                    </Grid>
                </Grid>
            </Paper>
            <Grid container justifyContent="center">
                <Grid item xs={12} sm={12} md={conScreen ? 12 : 6}>
                    {user && (
                        <TabPanel value={value} index={0}>
                            <ProfileTimeline user={user} />
                        </TabPanel>
                    )}

                    <TabPanel value={value} index={1}>
                        <Friends user={user} />
                    </TabPanel>
                </Grid>
            </Grid>
        </div>
    );
};

const TabPanel = (props) => {
    const { children, value, index, ...other } = props;

    return (
        <div hidden={value !== index} {...other}>
            {value === index && <Box p={3}>{children}</Box>}
        </div>
    );
};

export default UserProfile;
