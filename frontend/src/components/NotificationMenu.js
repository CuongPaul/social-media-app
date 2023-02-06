import {
    Menu,
    List,
    Avatar,
    useTheme,
    ListItem,
    Typography,
    IconButton,
    ListItemIcon,
    ListItemText,
    ListSubheader,
    useMediaQuery,
} from "@material-ui/core";
import moment from "moment";
import React, { useContext, useState } from "react";
import { DeleteOutlined, Notifications as NotificationIcon } from "@material-ui/icons";

import { UIContext } from "../App";
import useUpdateProfile from "../hooks/useUpdateProfile";

const NotificationMenu = ({ children }) => {
    const { uiState } = useContext(UIContext);

    const theme = useTheme();
    const [menu, setMenu] = useState(null);
    const xsScreen = useMediaQuery(theme.breakpoints.only("xs"));

    const { clearNotification } = useUpdateProfile();

    return (
        <div>
            <IconButton
                style={{
                    marginLeft: xsScreen ? "4px" : "8px",
                    color: !uiState.darkMode ? "black" : null,
                    backgroundColor: !uiState.darkMode ? "#F0F2F5" : null,
                }}
                onClick={(e) => setMenu(e.currentTarget)}
            >
                {children}
            </IconButton>

            <Menu
                keepMounted
                elevation={7}
                id="post-menu"
                anchorEl={menu}
                open={Boolean(menu)}
                onClose={() => setMenu(null)}
                style={{ marginTop: "50px" }}
            >
                <List
                    subheader={
                        <ListSubheader
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                            }}
                        >
                            <Typography style={{ fontSize: "22px", fontWeight: "800" }}>
                                Notifications
                            </Typography>
                            {uiState.notifications.length ? (
                                <IconButton onClick={() => clearNotification()}>
                                    <DeleteOutlined />
                                </IconButton>
                            ) : null}
                        </ListSubheader>
                    }
                >
                    {uiState.notifications ? (
                        uiState.notifications.map((notification) => (
                            <ListItem button key={notification.id}>
                                <ListItemIcon>
                                    <Avatar
                                        style={{
                                            background: "seagreen",
                                            color: "#fff",
                                        }}
                                    >
                                        <NotificationIcon />
                                    </Avatar>
                                </ListItemIcon>
                                <ListItemText>
                                    <Typography variant="body1" style={{ fontSize: "15px" }}>
                                        {notification.body}
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        style={{
                                            fontSize: "13px",
                                            color: !uiState.darkMode ? "#65676B" : null,
                                        }}
                                    >
                                        {moment(notification.createdAt).fromNow()}
                                    </Typography>
                                </ListItemText>
                            </ListItem>
                        ))
                    ) : (
                        <ListItem>
                            <ListItemText>
                                <Typography style={{ fontSize: "16px" }}>
                                    No Notifications
                                </Typography>
                            </ListItemText>
                        </ListItem>
                    )}
                </List>
            </Menu>
        </div>
    );
};

export default NotificationMenu;
