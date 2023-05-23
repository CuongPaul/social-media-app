import { Chip } from "@material-ui/core";
import React, { useContext } from "react";
import { NavLink } from "react-router-dom";

import useStyles from "./styles";
import { UserContext } from "../../App";
import AvatarIcon from "../UI/AvatarIcon";

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

export default AccountMenu;
