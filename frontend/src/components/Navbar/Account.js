import { Chip } from "@material-ui/core";
import React, { useContext } from "react";
import { NavLink } from "react-router-dom";

import { UserContext } from "../../App";
import AvatarIcon from "../UI/AvatarIcon";

const Account = () => {
    const {
        userState: { currentUser },
    } = useContext(UserContext);

    const firstName = currentUser?.name.split(" ")[0];

    return currentUser ? (
        <Chip
            component={NavLink}
            style={{ cursor: "pointer" }}
            to={`/profile/${currentUser._id}`}
            activeStyle={{ color: "rgb(24,118,242)", backgroundColor: "rgb(230,242,254)" }}
            avatar={<AvatarIcon text={currentUser.name} imageUrl={currentUser.avatar_image} />}
            label={<h3>{firstName.length <= 5 ? firstName : firstName.slice(0, 5) + "..."}</h3>}
        />
    ) : null;
};

export default Account;
