import {
    List,
    Button,
    Dialog,
    ListItem,
    TextField,
    Typography,
    IconButton,
    ListItemIcon,
    ListItemText,
    DialogContent,
    CircularProgress,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import { Search } from "@material-ui/icons";
import React, { useState, Fragment, useContext } from "react";

import { UserContext } from "../../App";
import AvatarIcon from "../UI/AvatarIcon";
import { useSearchUsers, useFriendActions } from "../../hooks";

const SearchUsers = () => {
    const { userState } = useContext(UserContext);

    const [isOpen, setIsOpen] = useState(false);
    const [searchValue, setSearchValue] = useState("");

    const { users, isLoading, handleSearchUsers } = useSearchUsers();

    const { blockUser, unblockUser, sendFriendRequest } = useFriendActions();

    return (
        <Fragment>
            <IconButton onClick={() => setIsOpen(true)}>
                <Search />
            </IconButton>
            <Dialog
                fullWidth
                maxWidth="sm"
                open={isOpen}
                style={{ marginTop: "50px" }}
                onClose={() => setIsOpen(false)}
            >
                <DialogContent>
                    <TextField
                        autoFocus
                        variant="outlined"
                        value={searchValue}
                        placeholder="Enter name"
                        style={{ width: "100%" }}
                        onChange={(e) => setSearchValue(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleSearchUsers(searchValue)}
                    />
                    <Button
                        color="primary"
                        disabled={isLoading}
                        variant="contained"
                        onClick={() => handleSearchUsers(searchValue)}
                        style={{ width: "100%", marginTop: "16px" }}
                    >
                        Search
                    </Button>
                    {users.length ? (
                        <Typography variant="h6" style={{ marginTop: "20px" }}>
                            Search Results ({users.length})
                        </Typography>
                    ) : null}
                    {isLoading ? (
                        <div
                            style={{
                                display: "flex",
                                marginTop: "20px",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <CircularProgress />
                        </div>
                    ) : (
                        <List>
                            {users &&
                                users.map((user) => (
                                    <div key={user._id}>
                                        <ListItem
                                            button
                                            key={user._id}
                                            component={Link}
                                            to={`/profile/${user._id}`}
                                            onClick={() => setIsOpen(false)}
                                        >
                                            <ListItemIcon>
                                                <AvatarIcon
                                                    text={user.name}
                                                    imageUrl={user.avatar_image}
                                                />
                                            </ListItemIcon>
                                            <ListItemText style={{ marginLeft: "8px" }}>
                                                <Typography
                                                    style={{ fontSize: "17px", fontWeight: "700" }}
                                                >
                                                    {user.name}
                                                </Typography>
                                                <Typography>{user.email}</Typography>
                                            </ListItemText>
                                        </ListItem>
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
                                ))}
                        </List>
                    )}
                </DialogContent>
            </Dialog>
        </Fragment>
    );
};

export default SearchUsers;
