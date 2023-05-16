import {
    List,
    Avatar,
    Button,
    Dialog,
    Tooltip,
    Checkbox,
    ListItem,
    TextField,
    CardHeader,
    IconButton,
    Typography,
    ListItemIcon,
    ListItemText,
    DialogContent,
    CircularProgress,
} from "@material-ui/core";
import { ArrowBack } from "@material-ui/icons";
import React, { useState, Fragment } from "react";
import { faUserTag } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import AvartaText from "../../../UI/AvartaText";
import { useSearchFriends } from "../../../../hooks";

const TagFriends = ({ setPostData }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [friendsSelected, setFriendsSelected] = useState([]);

    const { friends, isLoading, handleSearchFriends } = useSearchFriends();

    return (
        <Fragment>
            <Tooltip arrow placement="bottom" title="Tag your friends">
                <IconButton onClick={() => setIsOpen(true)}>
                    <FontAwesomeIcon icon={faUserTag} color="rgb(24,119,242)" />
                </IconButton>
            </Tooltip>
            <Dialog
                fullWidth
                open={isOpen}
                style={{ marginTop: "50px" }}
                onClose={() => setIsOpen(false)}
            >
                <CardHeader
                    avatar={
                        <IconButton onClick={() => setIsOpen(false)}>
                            <ArrowBack />
                        </IconButton>
                    }
                    subheader={
                        <Typography style={{ fontWeight: 800, fontSize: "20px" }}>
                            Tag your friends
                        </Typography>
                    }
                />
                <DialogContent>
                    <TextField
                        variant="outlined"
                        value={searchValue}
                        placeholder="Enter name"
                        style={{ width: "100%" }}
                        onChange={(e) => setSearchValue(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleSearchFriends(searchValue)}
                    />
                    <Button
                        color="primary"
                        disabled={isLoading}
                        variant="contained"
                        onClick={() => handleSearchFriends(searchValue)}
                        style={{ width: "100%", marginTop: "16px" }}
                    >
                        {isLoading ? (
                            <CircularProgress
                                size={25}
                                variant="indeterminate"
                                style={{ color: "#fff" }}
                            />
                        ) : (
                            "Search"
                        )}
                    </Button>
                    {friends.length ? (
                        <div>
                            <Typography variant="h6" style={{ marginTop: "20px" }}>
                                Search Results ({friends.length})
                            </Typography>
                            <List>
                                {friends.map((user) => (
                                    <ListItem key={user._id}>
                                        <ListItemIcon>
                                            {user.avatar_image ? (
                                                <Avatar style={{ width: "60px", height: "60px" }}>
                                                    <img
                                                        width="100%"
                                                        height="100%"
                                                        alt={user.name}
                                                        src={user.avatar_image}
                                                    />
                                                </Avatar>
                                            ) : (
                                                <AvartaText text={user?.name} />
                                            )}
                                        </ListItemIcon>
                                        <ListItemText style={{ marginLeft: "8px" }}>
                                            <Typography
                                                style={{ fontSize: "17px", fontWeight: "700" }}
                                            >
                                                {user.name}
                                            </Typography>
                                            <Typography>{user.email}</Typography>
                                        </ListItemText>
                                        <ListItemIcon>
                                            <Checkbox
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setFriendsSelected((pre) => [
                                                            ...pre,
                                                            user._id,
                                                        ]);
                                                    } else {
                                                        setFriendsSelected((pre) =>
                                                            pre.filter((item) => item != user._id)
                                                        );
                                                    }
                                                }}
                                                edge="start"
                                                friendsSelected={
                                                    friendsSelected.indexOf(user.id) !== -1
                                                }
                                                tabIndex={-1}
                                                disableRipple
                                                inputProps={{
                                                    "aria-labelledby": user.id,
                                                }}
                                            />
                                        </ListItemIcon>
                                    </ListItem>
                                ))}
                            </List>
                        </div>
                    ) : null}
                </DialogContent>
            </Dialog>
        </Fragment>
    );
};

export default TagFriends;
