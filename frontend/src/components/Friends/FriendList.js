import {
    Grid,
    List,
    Avatar,
    ListItem,
    Typography,
    ListItemText,
    ListSubheader,
    ListItemAvatar,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import React, { Fragment, useContext } from "react";

import { UserContext } from "../../App";
import AvartarText from "../UI/AvartarText";
import StyledBadge from "../UI/StyledBadge";
import PopoverProfile from "../Profile/PopoverProfile";

const Subheader = () => {
    return (
        <ListSubheader>
            <Grid container alignItems="center" justifyContent="flex-start">
                <Typography style={{ fontWeight: "800", color: "rgb(101,103,107)" }}>
                    Contacts
                </Typography>
            </Grid>
        </ListSubheader>
    );
};

const FriendList = () => {
    const { userState } = useContext(UserContext);

    return (
        <Fragment>
            <List subheader={<Subheader />} style={{ marginTop: "16px" }}>
                {userState?.currentUser?.friends.map((user, index) => (
                    <div key={index}>
                        <PopoverProfile user={user}>
                            <ListItem
                                button
                                key={user._id}
                                to={`/profile/${user._id}`}
                                component={Link}
                            >
                                <ListItemAvatar>
                                    <StyledBadge isActive={user.is_active}>
                                        {user.avatar_image ? (
                                            <Avatar alt={user.name} src={user.avatar_image} />
                                        ) : (
                                            <AvartarText
                                                text={user?.name}
                                                background={user.active ? "seagreen" : "tomato"}
                                            />
                                        )}
                                    </StyledBadge>
                                </ListItemAvatar>
                                <ListItemText primary={user.name} />
                            </ListItem>
                        </PopoverProfile>
                    </div>
                ))}
            </List>
        </Fragment>
    );
};

export default FriendList;
