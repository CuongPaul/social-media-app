import {
    Menu,
    List,
    Avatar,
    Switch,
    ListItem,
    IconButton,
    Typography,
    ListItemIcon,
    ListItemText,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import { Settings, ExitToApp } from "@material-ui/icons";
import { faMoon } from "@fortawesome/free-regular-svg-icons";
import React, { useState, Fragment, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";

import AvatarIcon from "../UI/AvatarIcon";
import { useUser } from "../../hooks";
import { UIContext, UserContext } from "../../App";

const ProfileItem = () => {
    const {
        userState: { currentUser },
    } = useContext(UserContext);

    return (
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
    );
};

const SettingsItem = () => {
    return (
        <ListItem button component={Link} to={`/settings`}>
            <ListItemIcon>
                <Avatar style={{ color: "rgb(255,255,255)", backgroundColor: "teal" }}>
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
    const {
        uiDispatch,
        uiState: { darkMode },
    } = useContext(UIContext);

    const handleChangDarkMode = (isDarkMode) => {
        uiDispatch({ payload: isDarkMode, type: "SET_DARK_MODE" });
    };

    return (
        <ListItem>
            <ListItemIcon>
                <Avatar style={{ color: "rgb(255,255,255)", backgroundColor: "teal" }}>
                    <FontAwesomeIcon icon={faMoon} />
                </Avatar>
            </ListItemIcon>
            <ListItemText>
                <Switch
                    color="primary"
                    checked={darkMode}
                    onChange={(e) => handleChangDarkMode(e.target.checked)}
                />
            </ListItemText>
        </ListItem>
    );
};

const SignoutItem = () => {
    const { handleSignout } = useUser();

    return (
        <ListItem button onClick={handleSignout}>
            <ListItemIcon>
                <Avatar style={{ color: "rgb(255,255,255)", backgroundColor: "teal" }}>
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

    const [anchorEl, setAnchorEl] = useState(null);

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
                <FontAwesomeIcon icon={faChevronDown} />
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                style={{ marginTop: "50px" }}
                onClose={() => setAnchorEl(null)}
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
