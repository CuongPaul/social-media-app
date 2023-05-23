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
import AvatarIcon from "../UI/AvatarIcon";
import { UIContext, UserContext } from "../../App";

const ProfileItem = () => {
    const { userState } = useContext(UserContext);

    const { currentUser } = userState;

    return currentUser ? (
        <ListItem button component={Link} to={`/profile/${currentUser._id}`}>
            <ListItemIcon>
                <AvatarIcon text={currentUser.name} imageUrl={currentUser.avatar_image} />
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

            userDispatch({ type: "SIGN_OUT" });

            history.push("/");
        } catch (err) {
            uiDispatch({
                type: "SET_ALERT_MESSAGE",
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

const Actions = () => {
    const {
        uiState: { darkMode },
    } = useContext(UIContext);

    const [isOpenMenu, setIsOpenMenu] = useState(false);
    const [profileMenu, setProfileMenu] = useState(null);

    const handleOpenMenu = (e) => {
        setIsOpenMenu(!isOpenMenu);
        setProfileMenu(e.currentTarget);
    };

    return (
        <Fragment>
            <IconButton
                onClick={handleOpenMenu}
                style={{
                    marginLeft: "16px",
                    color: darkMode ? "rgb(227,229,233)" : "rgb(5,5,5)",
                    backgroundColor: darkMode ? "rgb(58,59,60)" : "rgb(226,228,232)",
                }}
            >
                <FontAwesomeIcon icon={faChevronDown} />
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

export default Actions;
