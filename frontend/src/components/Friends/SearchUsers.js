import {
    List,
    Button,
    Dialog,
    ListItem,
    TextField,
    CardHeader,
    IconButton,
    Typography,
    ListItemIcon,
    ListItemText,
    DialogContent,
    InputAdornment,
    CircularProgress,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import { Close } from "@material-ui/icons";
import { Search } from "@material-ui/icons";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import React, { useState, Fragment, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { UserContext } from "../../App";
import AvatarIcon from "../UI/AvatarIcon";
import { useSearchUsers, useFriendActions } from "../../hooks";

const SearchUsers = () => {
    const { userState } = useContext(UserContext);
    console.log("userState: ", userState);
    const [isOpen, setIsOpen] = useState(false);
    const [searchValue, setSearchValue] = useState("");

    const { users, setUsers, isLoading, handleSearchUsers } = useSearchUsers();
    const { blockUser, unblockUser, unfriend, sendFriendRequest, declineOrCancleFriendRequest } =
        useFriendActions();

    return (
        <Fragment>
            <Typography
                style={{
                    color: "grey",
                    display: "flex",
                    cursor: "pointer",
                    minWidth: "200px",
                    paddingLeft: "15px",
                    alignItems: "center",
                    borderRadius: "16px",
                    background: "rgb(244,245,246)",
                    justifyContent: "space-between",
                }}
                onClick={() => setIsOpen(true)}
            >
                Search
                <IconButton onClick={() => setIsOpen(true)}>
                    <Search />
                </IconButton>
            </Typography>
            <Dialog
                fullWidth
                open={isOpen}
                style={{ marginTop: "50px" }}
                onClose={() => setIsOpen(false)}
            >
                <CardHeader
                    subheader={
                        <Typography
                            style={{ fontWeight: 800, fontSize: "20px", marginLeft: "10px" }}
                        >
                            Search users
                        </Typography>
                    }
                    action={
                        <IconButton color="primary" onClick={() => setIsOpen(false)}>
                            <Close />
                        </IconButton>
                    }
                />
                <DialogContent>
                    <div style={{ display: "flex", marginBottom: "20px" }}>
                        <TextField
                            autoFocus
                            label="Name"
                            variant="outlined"
                            value={searchValue}
                            placeholder="Enter name"
                            onChange={(e) => setSearchValue(e.target.value)}
                            style={{ flex: 4, width: "100%", marginRight: "16px" }}
                            onKeyPress={(e) => e.key === "Enter" && handleSearchUsers(searchValue)}
                            InputProps={{
                                endAdornment: searchValue && (
                                    <InputAdornment position="end">
                                        <FontAwesomeIcon
                                            icon={faTimes}
                                            onClick={() => {
                                                setUsers([]);
                                                setSearchValue("");
                                            }}
                                            style={{ marginRight: "10px", cursor: "pointer" }}
                                        />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <Button
                            color="primary"
                            variant="contained"
                            disabled={isLoading}
                            onClick={() => handleSearchUsers(searchValue)}
                            style={{ flex: 1, width: "100%", borderRadius: "5px" }}
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
                    </div>
                    <List>
                        {users.map((user) => (
                            <div
                                style={{
                                    display: "flex",
                                    cursor: "pointer",
                                    borderRadius: "10px",
                                    marginBottom: "10px",
                                    background: "rgb(244,245,246)",
                                }}
                            >
                                <ListItem
                                    button
                                    key={user._id}
                                    component={Link}
                                    to={`/profile/${user._id}`}
                                    onClick={() => setIsOpen(false)}
                                >
                                    <ListItemIcon>
                                        <AvatarIcon text={user.name} imageUrl={user.avatar_image} />
                                    </ListItemIcon>
                                    <ListItemText style={{ marginLeft: "8px" }}>
                                        <Typography style={{ fontWeight: 700, fontSize: "17px" }}>
                                            {user.name}
                                        </Typography>
                                    </ListItemText>
                                </ListItem>
                                <div>
                                    {userState?.currentUser.friends.find(
                                        (friend) => friend._id === user._id
                                    ) ? (
                                        <Button
                                            onClick={() => unfriend(user._id)}
                                            variant="contained"
                                            style={{
                                                background: "rgb(1,133,243)",
                                                color: "white",
                                            }}
                                        >
                                            Unfriend
                                        </Button>
                                    ) : userState?.sendedFriendRequest?.find(
                                          (item) => item.receiver._id === user._id
                                      ) ? (
                                        <Button
                                            onClick={() =>
                                                declineOrCancleFriendRequest(
                                                    userState?.sendedFriendRequest?.find(
                                                        (item) => item.receiver._id === user._id
                                                    )._id
                                                )
                                            }
                                            variant="contained"
                                            style={{
                                                background: "rgb(1,133,243)",
                                                color: "white",
                                            }}
                                        >
                                            Cancle Friend Request
                                        </Button>
                                    ) : (
                                        <Button
                                            onClick={() => sendFriendRequest(user._id)}
                                            variant="contained"
                                            style={{
                                                background: "rgb(1,133,243)",
                                                color: "white",
                                            }}
                                        >
                                            Add Friend
                                        </Button>
                                    )}
                                    {userState.currentUser.block_users.includes(user._id) ? (
                                        <Button
                                            onClick={() => unblockUser(user._id)}
                                            variant="contained"
                                            style={{
                                                background: "rgb(1,133,243)",
                                                color: "white",
                                            }}
                                        >
                                            Unblock user
                                        </Button>
                                    ) : (
                                        <Button
                                            onClick={() => blockUser(user._id)}
                                            variant="contained"
                                            style={{
                                                background: "rgb(1,133,243)",
                                                color: "white",
                                            }}
                                        >
                                            Block user
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </List>
                </DialogContent>
            </Dialog>
        </Fragment>
    );
};

export default SearchUsers;
