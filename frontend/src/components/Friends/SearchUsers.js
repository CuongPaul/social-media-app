import {
    List,
    Avatar,
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
import React, { useState, Fragment } from "react";

import AvartarText from "../UI/AvartarText";
import { useSearchUsers, useFriendActions } from "../../hooks";

const SearchUsers = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchValue, setSearchValue] = useState("");

    const { users, isLoading, handleSearchUsers } = useSearchUsers();

    const { sendFriendRequest } = useFriendActions();

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
                                    <div>
                                        <ListItem
                                            button
                                            key={user._id}
                                            component={Link}
                                            to={`/profile/${user._id}`}
                                            onClick={() => setIsOpen(false)}
                                        >
                                            <ListItemIcon>
                                                {user.avatar_image ? (
                                                    <Avatar
                                                        style={{ width: "60px", height: "60px" }}
                                                    >
                                                        <img
                                                            width="100%"
                                                            height="100%"
                                                            alt={user.name}
                                                            src={user.avatar_image}
                                                        />
                                                    </Avatar>
                                                ) : (
                                                    <AvartarText
                                                        text={user?.name}
                                                        backgroundColor={
                                                            user.active ? "seagreen" : "tomato"
                                                        }
                                                    />
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
