import {
    Grid,
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
import AvatarIcon from "../UI/AvatarIcon";
import StyledBadge from "../UI/StyledBadge";
import PopoverProfile from "../Profile/PopoverProfile";

const Subheader = () => {
    return (
        <ListSubheader>
            <Grid container alignItems="center" justifyContent="flex-start">
                <Typography style={{ fontWeight: "800", color: "rgb(101,103,107)" }}>
                    Friends online
                </Typography>
            </Grid>
        </ListSubheader>
    );
};

const FriendsOnlineList = () => {
    const { userState } = useContext(UserContext);

    return (
        <div style={{ overflowX: "auto" }}>
            <List subheader={<Subheader />} style={{ marginTop: "16px" }}>
                {userState?.friendsOnline?.map((user, index) => (
                    <div key={index}>
                        <PopoverProfile user={user}>
                            <ListItem
                                button
                                key={user?._id}
                                to={`/profile/${user._id}`}
                                component={Link}
                            >
                                <ListItemAvatar>
                                    <StyledBadge isActive={true}>
                                        <AvatarIcon
                                            text={user?.name}
                                            imageUrl={user?.avatar_image}
                                        />
                                    </StyledBadge>
                                </ListItemAvatar>
                                <ListItemText primary={user?.name} />
                            </ListItem>
                        </PopoverProfile>
                    </div>
                ))}
            </List>
        </div>
    );
};

export default FriendsOnlineList;
