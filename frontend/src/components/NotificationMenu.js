import {
    Menu,
    List,
    Badge,
    Avatar,
    useTheme,
    ListItem,
    IconButton,
    Typography,
    ListItemIcon,
    ListItemText,
    ListSubheader,
    useMediaQuery,
} from "@material-ui/core";
import moment from "moment";
import { faBell } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, Fragment, useEffect, useContext } from "react";
import { Label, Forum, PersonAdd, PlaylistAddCheck } from "@material-ui/icons";

import callApi from "../api";
import { UIContext } from "../App";

const Subheader = () => {
    const { uiState, uiDispatch } = useContext(UIContext);

    const notificationsRead = uiState?.notifications?.filter((item) => item.is_read);

    const handleReadAllNotifications = async () => {
        try {
            await callApi({
                method: "PUT",
                url: "/notification/read-all",
            });

            uiDispatch({
                type: "READ_ALL_NOTIFICATIONS",
            });
        } catch (err) {
            uiDispatch({
                type: "SET_ALERT_MESSAGE",
                payload: { display: true, color: "error", text: err.message },
            });
        }
    };

    return (
        <ListSubheader
            style={{
                display: "flex",
                minHeight: "48px",
                alignItems: "center",
                backgroundColor: "#ffffff",
                justifyContent: "space-between",
            }}
        >
            <Typography style={{ fontSize: "20px", fontWeight: "800" }}>Notifications</Typography>
            {notificationsRead.length === uiState.notifications.length ? null : (
                <IconButton onClick={handleReadAllNotifications}>
                    <PlaylistAddCheck />
                </IconButton>
            )}
        </ListSubheader>
    );
};

const NotificationMenu = () => {
    const { uiState, uiDispatch } = useContext(UIContext);

    const [isOpenMenu, setIsOpenMenu] = useState(false);
    const [notificationMenu, setNotificationMenu] = useState(null);

    const { breakpoints } = useTheme();
    const xsScreen = useMediaQuery(breakpoints.only("xs"));

    const handleOpenMenu = (e) => {
        setIsOpenMenu(!isOpenMenu);
        setNotificationMenu(e.currentTarget);
    };

    const handleReadNotifications = async (notification_id) => {
        try {
            await callApi({
                method: "PUT",
                url: `/notification/read/${notification_id}`,
            });

            uiDispatch({
                type: "READ_NOTIFICATIONS",
                payload: notification_id,
            });
        } catch (err) {
            uiDispatch({
                type: "SET_ALERT_MESSAGE",
                payload: { display: true, color: "error", text: err.message },
            });
        }
    };

    useEffect(() => {
        (async () => {
            try {
                const { data } = await callApi({ method: "GET", url: "/notification" });

                if (data) {
                    uiDispatch({ type: "SET_NOTIFICATIONS", payload: data.rows });
                }
            } catch (err) {
                uiDispatch({
                    type: "SET_ALERT_MESSAGE",
                    payload: { text: err.message, display: true, color: "error" },
                });
            }
        })();
    }, []);

    return (
        <Fragment>
            <IconButton
                onClick={handleOpenMenu}
                style={{
                    marginLeft: xsScreen ? "4px" : "8px",
                    color: uiState.darkMode ? null : "black",
                    backgroundColor: uiState.darkMode ? null : "#F0F2F5",
                }}
            >
                <Badge
                    max={9}
                    color="error"
                    overlap="rectangular"
                    badgeContent={uiState.notifications.filter((item) => !item.is_read).length}
                >
                    <FontAwesomeIcon icon={faBell} size={xsScreen ? "xs" : "sm"} />
                </Badge>
            </IconButton>
            <Menu
                open={isOpenMenu}
                anchorEl={notificationMenu}
                style={{ marginTop: "50px" }}
                onClose={() => setIsOpenMenu(false)}
            >
                <List subheader={<Subheader />}>
                    {uiState.notifications.map((notification) => (
                        <ListItem
                            button
                            key={notification._id}
                            onClick={() => handleReadNotifications(notification._id)}
                            style={{ backgroundColor: notification.is_read && "rgba(0,0,0,0.08)" }}
                        >
                            <ListItemIcon>
                                <Avatar style={{ color: "#fff", background: "seagreen" }}>
                                    {notification.type.includes("CHATROOM") ? (
                                        <Forum />
                                    ) : notification.type.includes("POST") ? (
                                        <Label />
                                    ) : (
                                        <PersonAdd />
                                    )}
                                </Avatar>
                            </ListItemIcon>
                            <ListItemText>
                                <Typography variant="body1" style={{ fontSize: "15px" }}>
                                    {notification.content}
                                </Typography>
                                <Typography
                                    variant="body1"
                                    style={{
                                        fontSize: "13px",
                                        color: uiState.darkMode ? null : "#65676B",
                                    }}
                                >
                                    {moment(notification.createdAt).fromNow()}
                                </Typography>
                            </ListItemText>
                        </ListItem>
                    ))}
                </List>
            </Menu>
        </Fragment>
    );
};

export default NotificationMenu;
