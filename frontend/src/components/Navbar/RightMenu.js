import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { Fragment, useContext } from "react";
import { faFacebookMessenger } from "@fortawesome/free-brands-svg-icons";
import { Chip, Avatar, IconButton, Badge, useMediaQuery, useTheme } from "@material-ui/core";

import useStyles from "./styles";
import ProfileMenu from "./ProfileMenu";
import AvatarIcon from "../UI/AvatarIcon";
import CreatePostMenu from "./CreatePostMenu";
import NotificationMenu from "../NotificationMenu";
import { UIContext, UserContext } from "../../App";

const MessengerMenu = () => {
    const { uiState } = useContext(UIContext);

    const { breakpoints } = useTheme();
    const xsScreen = useMediaQuery(breakpoints.only("xs"));

    return (
        <IconButton
            to="/messenger"
            component={NavLink}
            activeStyle={{ color: "rgb(1,133,243)" }}
            style={{
                marginLeft: xsScreen ? "4px" : "8px",
                color: uiState.darkMode ? null : "black",
                backgroundColor: uiState.darkMode ? null : "#F0F2F5",
            }}
        >
            <Badge max={9} color="error" badgeContent={8} overlap="rectangular">
                <FontAwesomeIcon size={xsScreen ? "xs" : "sm"} icon={faFacebookMessenger} />
            </Badge>
        </IconButton>
    );
};

const AccountMenu = () => {
    const { userState } = useContext(UserContext);

    const classes = useStyles();

    return userState.currentUser ? (
        <Chip
            component={NavLink}
            to={`/profile/${userState.currentUser._id}`}
            activeStyle={{ backgroundColor: "teal", color: "#fff" }}
            label={<h3>{userState.currentUser.name.split(" ")[0].slice(0, 5) + ".."}</h3>}
            className={classes.profile_chip}
            avatar={
                <AvatarIcon
                    text={userState.currentUser.name}
                    imageUrl={userState.currentUser.avatar_image}
                />
            }
        />
    ) : null;
};

const RightMenu = () => {
    return (
        <Fragment>
            <AccountMenu />
            <CreatePostMenu />
            <MessengerMenu />
            <NotificationMenu />
            <ProfileMenu />
        </Fragment>
    );
};

export default RightMenu;
