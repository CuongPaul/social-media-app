import {
    Menu,
    List,
    Badge,
    Avatar,
    ListItem,
    IconButton,
    Typography,
    ListItemIcon,
    ListItemText,
    ListSubheader,
} from "@material-ui/core";
import moment from "moment";
import { faBell } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, Fragment, useEffect, useContext } from "react";
import { Label, Forum, PersonAdd, PlaylistAddCheck } from "@material-ui/icons";

import callApi from "../../api";
import { UIContext } from "../../App";
import { useNotifications } from "../../hooks";

const Subheader = () => {
    const {
        uiState: { darkMode, notifications },
    } = useContext(UIContext);

    const notificationsRead = notifications.filter((item) => item.is_read);

    const { handleReadAllNotifications } = useNotifications();

    return (
        <ListSubheader
            style={{
                display: "flex",
                minHeight: "48px",
                alignItems: "center",
                justifyContent: "space-between",
                color: darkMode ? "rgb(227,229,233)" : "rgb(5,5,5)",
                backgroundColor: darkMode ? "rgb(66,66,66)" : "rgb(255,255,255)",
            }}
        >
            <Typography style={{ fontSize: "20px", fontWeight: "800" }}>Notifications</Typography>
            {notificationsRead.length < notifications.length && (
                <IconButton onClick={handleReadAllNotifications}>
                    <PlaylistAddCheck />
                </IconButton>
            )}
        </ListSubheader>
    );
};

const Notifications = () => {
    const {
        uiDispatch,
        uiState: { darkMode, notifications },
    } = useContext(UIContext);

    const [anchorEl, setAnchorEl] = useState(null);

    const { handleReadNotifications } = useNotifications();

    useEffect(() => {
        (async () => {
            try {
                const { data } = await callApi({ method: "GET", url: "/notification" });

                uiDispatch({ type: "SET_NOTIFICATIONS", payload: data.rows });
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
                onClick={(e) => setAnchorEl(e.currentTarget)}
                style={{
                    marginLeft: "16px",
                    color: darkMode ? "rgb(227,229,233)" : "rgb(5,5,5)",
                    backgroundColor: darkMode ? "rgb(58,59,60)" : "rgb(226,228,232)",
                }}
            >
                <Badge
                    max={9}
                    color="error"
                    overlap="rectangular"
                    badgeContent={notifications.filter((item) => !item.is_read).length}
                >
                    <FontAwesomeIcon icon={faBell} />
                </Badge>
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                style={{ marginTop: "50px" }}
                onClose={() => setAnchorEl(null)}
            >
                <List subheader={<Subheader />}>
                    {notifications.map((notification) => (
                        <ListItem
                            button
                            key={notification._id}
                            onClick={() =>
                                !notification.is_read && handleReadNotifications(notification._id)
                            }
                            style={{
                                width: "auto",
                                margin: "5px 15px",
                                borderRadius: "10px",
                                backgroundColor: notification.is_read && "rgba(0,0,0,0.08)",
                            }}
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
                                        color: darkMode ? null : "#65676B",
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

export default Notifications;
