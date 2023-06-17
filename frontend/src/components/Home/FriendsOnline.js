import {
    List,
    ListItem,
    Typography,
    ListItemText,
    ListSubheader,
    ListItemAvatar,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import React, { useContext } from "react";

import { UserContext } from "../../App";
import AvatarIcon from "../common/AvatarIcon";
import StyledBadge from "../common/StyledBadge";

const Subheader = () => {
    return (
        <ListSubheader
            style={{ zIndex: 2, paddingBottom: "10px", backgroundColor: "rgb(244 245 246)" }}
        >
            <Typography style={{ fontWeight: 800 }}>Friends online</Typography>
        </ListSubheader>
    );
};

const FriendsOnline = () => {
    const { userState } = useContext(UserContext);

    return (
        <div style={{ height: "90vh", margin: "10px", overflow: "auto" }}>
            <List subheader={<Subheader />}>
                {userState?.friendsOnline?.map((user) => (
                    <ListItem
                        button
                        key={user._id}
                        component={Link}
                        to={`/profile/${user._id}`}
                        style={{ borderRadius: "10px" }}
                    >
                        <ListItemAvatar>
                            <StyledBadge isActive={true}>
                                <AvatarIcon text={user.name} imageUrl={user.avatar_image} />
                            </StyledBadge>
                        </ListItemAvatar>
                        <ListItemText primary={user.name} />
                    </ListItem>
                ))}
            </List>
        </div>
    );
};

export default FriendsOnline;
