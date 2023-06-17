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

import { UIContext } from "../../App";
import { useNotifications } from "../../hooks";

const Subheader = () => {
    const {
        uiState: { darkMode, notifications },
    } = useContext(UIContext);

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
            {notifications.length > notifications.filter((item) => item.is_read).length && (
                <IconButton onClick={handleReadAllNotifications}>
                    <PlaylistAddCheck />
                </IconButton>
            )}
        </ListSubheader>
    );
};

const Notifications = () => {
    const {
        uiState: { darkMode, notifications },
    } = useContext(UIContext);

    const [anchorEl, setAnchorEl] = useState(null);
    const [notificationsPage, setNotificationsPage] = useState(1);

    const { handleGetNotifications, handleReadNotifications } = useNotifications();

    const handleScrollNotifications = async (e) => {
        const { scrollTop, clientHeight, scrollHeight } = e.target;

        const isBottom = scrollHeight - scrollTop === clientHeight;

        if (isBottom) {
            setNotificationsPage(notificationsPage + 1);
            handleGetNotifications(notificationsPage + 1);
        }
    };

    useEffect(() => {
        handleGetNotifications();
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
                onScroll={handleScrollNotifications}
            >
                <List subheader={<Subheader />}>
                    {notifications.map((notification) => {
                        let avatarAttribute = {
                            icon: <PersonAdd />,
                            backgroundColor: "rgb(226,81,65)",
                        };

                        if (notification.type.includes("CHATROOM")) {
                            avatarAttribute = {
                                icon: <Forum />,
                                backgroundColor: "rgb(65,83,175)",
                            };
                        }
                        if (notification.type.includes("POST")) {
                            avatarAttribute = {
                                icon: <Label />,
                                backgroundColor: "rgb(46,139,87)",
                            };
                        }

                        return (
                            <ListItem
                                button
                                key={notification._id}
                                onClick={() =>
                                    !notification.is_read &&
                                    handleReadNotifications(notification._id)
                                }
                                style={{
                                    width: "auto",
                                    margin: "5px 15px",
                                    borderRadius: "10px",
                                    backgroundColor: notification.is_read && "rgba(0,0,0,0.08)",
                                }}
                            >
                                <ListItemIcon>
                                    <Avatar
                                        style={{
                                            color: "rgba(255,255,255)",
                                            backgroundColor: avatarAttribute.backgroundColor,
                                        }}
                                    >
                                        {avatarAttribute.icon}
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
                        );
                    })}
                </List>
            </Menu>
        </Fragment>
    );
};

export default Notifications;
