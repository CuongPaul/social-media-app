import {
    Menu,
    List,
    Avatar,
    Switch,
    useTheme,
    ListItem,
    IconButton,
    Typography,
    ListItemIcon,
    ListItemText,
    useMediaQuery,
} from "@material-ui/core";
import { Link, useHistory } from "react-router-dom";
import { Settings, ExitToApp } from "@material-ui/icons";
import { faMoon } from "@fortawesome/free-regular-svg-icons";
import React, { useState, Fragment, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

import callApi from "../../api";
import AvartarText from "../UI/AvartarText";
import { UIContext, UserContext } from "../../App";

const ProfileItem = () => {
    const { userState } = useContext(UserContext);

    const { currentUser } = userState;

    return currentUser ? (
        <ListItem button component={Link} to={`/profile/${currentUser._id}`}>
            <ListItemIcon>
                {currentUser.avatar_image ? (
                    <Avatar style={{ width: "60px", height: "60px" }}>
                        <img
                            width="100%"
                            height="100%"
                            alt={currentUser.name}
                            src={currentUser.avatar_image}
                        />
                    </Avatar>
                ) : (
                    <AvartarText
                        text={currentUser.name}
                        background={currentUser.active ? "seagreen" : "tomato"}
                    />
                )}
            </ListItemIcon>
            <ListItemText>
                <Typography style={{ fontSize: "17px", fontWeight: "700" }}>
                    {currentUser.name}
                </Typography>
            </ListItemText>
        </ListItem>
    ) : null;
};

const SettingsItem = () => {
    return (
        <ListItem button component={Link} to={`/settings`}>
            <ListItemIcon>
                <Avatar style={{ color: "#fff", background: "teal" }}>
                    <Settings />
                </Avatar>
            </ListItemIcon>
            <ListItemText>
                <Typography style={{ fontSize: "15px" }}>Settings</Typography>
            </ListItemText>
        </ListItem>
    );
};

const DarkModeItem = () => {
    const { uiState, uiDispatch } = useContext(UIContext);

    const handleChangDarkMode = (is_dark_mode) => {
        uiDispatch({
            type: "SET_DARK_MODE",
            payload: is_dark_mode,
        });
    };

    return (
        <ListItem>
            <ListItemIcon>
                <Avatar style={{ color: "#fff", background: "teal" }}>
                    <FontAwesomeIcon icon={faMoon} />
                </Avatar>
            </ListItemIcon>
            <ListItemText>
                <Switch
                    color="primary"
                    checked={uiState.darkMode}
                    onChange={(e) => handleChangDarkMode(e.target.checked)}
                />
            </ListItemText>
        </ListItem>
    );
};

const SignoutItem = () => {
    const { uiDispatch } = useContext(UIContext);
    const { userDispatch } = useContext(UserContext);

    const history = useHistory();

    const handleSignout = async () => {
        try {
            await callApi({ method: "POST", url: "/auth/signout" });

            userDispatch({ type: "USER_SIGNOUT" });

            history.push("/");
        } catch (err) {
            uiDispatch({
                type: "SET_NOTIFICATION",
                payload: { display: true, color: "error", text: err.message },
            });
        }
    };

    return (
        <ListItem button onClick={handleSignout}>
            <ListItemIcon>
                <Avatar style={{ color: "#fff", background: "teal" }}>
                    <ExitToApp />
                </Avatar>
            </ListItemIcon>
            <ListItemText>
                <Typography style={{ fontSize: "15px" }}>Signout</Typography>
            </ListItemText>
        </ListItem>
    );
};

const ProfileMenu = () => {
    const { uiState } = useContext(UIContext);

    const [isOpenMenu, setIsOpenMenu] = useState(false);
    const [profileMenu, setProfileMenu] = useState(null);

    const { breakpoints } = useTheme();
    const xsScreen = useMediaQuery(breakpoints.only("xs"));

    const handleOpenMenu = (e) => {
        setIsOpenMenu(!isOpenMenu);
        setProfileMenu(e.currentTarget);
    };

    return (
        <Fragment>
            <IconButton
                onClick={handleOpenMenu}
                style={{
                    marginLeft: xsScreen ? "4px" : "8px",
                    color: uiState.darkMode ? null : "dark",
                    backgroundColor: uiState.darkMode ? null : "#F0F2F5",
                }}
            >
                <FontAwesomeIcon icon={faChevronDown} size={xsScreen ? "xs" : "sm"} />
            </IconButton>
            <Menu
                open={isOpenMenu}
                anchorEl={profileMenu}
                style={{ marginTop: "50px" }}
                onClose={() => setIsOpenMenu(false)}
            >
                <List>
                    <ProfileItem />
                    <SettingsItem />
                    <DarkModeItem />
                    <SignoutItem />
                </List>
            </Menu>
        </Fragment>
    );
};

export default ProfileMenu;
