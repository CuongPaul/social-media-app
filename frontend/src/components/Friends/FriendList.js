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
import React, { Fragment, useState, useEffect, useContext } from "react";

import { UserContext } from "../../App";
import AvartarText from "../UI/AvartarText";
import StyledBadge from "../UI/StyledBadge";
import generateColor from "../../utils/generate-color";
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

    const length = userState?.currentUser?.friends.length;

    const [number, setNumber] = useState(0);
    const [friendsList, setFriendsList] = useState(userState?.currentUser?.friends.slice(0, 4));

    useEffect(() => {
        setFriendsList(userState?.currentUser?.friends.slice(number, number + 4));
    }, [number]);

    return (
        <Fragment>
            <List subheader={<Subheader />} style={{ marginTop: "16px" }}>
                <button disabled={number <= 0} onClick={() => setNumber(number - 1)}>
                    UP
                </button>
                {friendsList.map((user, index) => (
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
                                                text={user.name}
                                                backgroundColor={generateColor(user.name)}
                                            />
                                        )}
                                    </StyledBadge>
                                </ListItemAvatar>
                                <ListItemText primary={user.name} />
                            </ListItem>
                        </PopoverProfile>
                    </div>
                ))}
                <button disabled={number + 4 >= length} onClick={() => setNumber(number + 1)}>
                    DOWN
                </button>
            </List>
        </Fragment>
    );
};

export default FriendList;
