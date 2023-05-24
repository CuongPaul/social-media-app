import {
    Grid,
    List,
    Paper,
    Divider,
    ListItem,
    Container,
    Typography,
    ListItemIcon,
    ListItemText,
} from "@material-ui/core";
import React, { lazy, Suspense, useContext, useEffect, useState } from "react";
import { SecurityOutlined, LocationCityOutlined, PersonOutline } from "@material-ui/icons";

import { UIContext } from "../App";

const General = lazy(() => import("../components/settings/General"));
const Location = lazy(() => import("../components/settings/Location"));
const SecurityAndLogin = lazy(() => import("../components/settings/SecurityAndLogin"));

const Settings = () => {
    const { uiState, uiDispatch } = useContext(UIContext);

    const [tab, setTab] = useState("general");

    const handleClickTab = (tab_data) => {
        setTab(tab_data);
        uiDispatch({ type: "SET_DRAWER", payload: false });
    };

    // useEffect(() => {
    //     uiDispatch({ type: "SET_NAV_MENU", payload: true });
    //     uiDispatch({ type: "SET_DRAWER", payload: true });

    //     return () => {
    //         uiDispatch({ type: "SET_NAV_MENU", payload: false });
    //         uiDispatch({ type: "SET_DRAWER", payload: false });
    //     };
    // }, [uiDispatch]);

    const ListContents = (
        <>
            <List>
                <ListItem
                    button
                    onClick={() => handleClickTab("general")}
                    style={{
                        backgroundColor:
                            tab === "general"
                                ? uiState.darkMode
                                    ? "rgb(76,76,76)"
                                    : "rgb(235,237,240)"
                                : null,
                    }}
                >
                    <ListItemIcon>
                        <PersonOutline />
                    </ListItemIcon>
                    <ListItemText primary="General" />
                </ListItem>
                <ListItem
                    button
                    onClick={() => handleClickTab("security_and_login")}
                    style={{
                        backgroundColor:
                            tab === "security_and_login"
                                ? uiState.darkMode
                                    ? "rgb(76,76,76)"
                                    : "rgb(235,237,240)"
                                : null,
                    }}
                >
                    <ListItemIcon>
                        <SecurityOutlined />
                    </ListItemIcon>
                    <ListItemText primary="Security and Login" />
                </ListItem>
            </List>
            <Divider />
            <List>
                <ListItem
                    button
                    onClick={() => handleClickTab("location")}
                    style={{
                        backgroundColor:
                            tab === "location"
                                ? uiState.darkMode
                                    ? "rgb(76,76,76)"
                                    : "rgb(235,237,240)"
                                : null,
                    }}
                >
                    <ListItemIcon>
                        <LocationCityOutlined />
                    </ListItemIcon>
                    <ListItemText primary="Location" />
                </ListItem>
            </List>
        </>
    );

    return (
        <Container
            style={{
                paddingTop: "100px",
                paddingBottom: "100px",
                minHeight: "100vh",
            }}
        >
            <Grid container spacing={1} style={{ minHeight: "70vh" }}>
                <Grid item md={4}>
                    <Paper style={{ padding: "8px", height: "100%" }}>{ListContents}</Paper>
                </Grid>
                <Grid item md={8} xs={12} sm={12}>
                    <Paper style={{ padding: "16px", width: "100%", height: "100%" }}>
                        <Suspense fallback={<Typography>Loading</Typography>}>
                            {tab === "general" && <General />}

                            {tab === "security_and_login" && <SecurityAndLogin />}

                            {tab === "location" && <Location />}
                        </Suspense>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default Settings;
