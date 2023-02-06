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
    DialogActions,
    DialogContent,
    CircularProgress,
} from "@material-ui/core";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Search } from "@material-ui/icons";

import AvartarText from "../UI/AvartarText";
import useSearchFriends from "../../hooks/useSearchFriends";

const SearchFriends = () => {
    const [name, setName] = useState("");
    const [open, setOpen] = useState(true);

    const handleSearch = () => {
        searchFriends(name);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleOpen = () => {
        setOpen(true);
    };

    const { searchFriends, friends, loading } = useSearchFriends();

    return (
        <div>
            <IconButton onClick={handleOpen}>
                <Search />
            </IconButton>
            <Dialog fullWidth maxWidth="sm" open={open} onClose={handleClose}>
                <DialogContent>
                    <TextField
                        style={{ width: "100%" }}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        variant="outlined"
                        placeholder="Enter Friends Name"
                    />
                    <Button
                        style={{ width: "100%", marginTop: "16px" }}
                        variant="contained"
                        color="primary"
                        onClick={handleSearch}
                    >
                        Search
                    </Button>
                    {friends.length ? (
                        <Typography variant="h4" style={{ marginTop: "20px" }}>
                            Search Friends ({friends.length})
                        </Typography>
                    ) : null}
                    {loading ? (
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                marginTop: "20px",
                            }}
                        >
                            <CircularProgress />
                        </div>
                    ) : (
                        <List>
                            {friends &&
                                friends.map((user) => (
                                    <ListItem
                                        button
                                        onClick={handleClose}
                                        component={Link}
                                        to={`/profile/${user.id}`}
                                        key={user.id}
                                    >
                                        <ListItemIcon>
                                            {user.profile_pic ? (
                                                <Avatar
                                                    style={{
                                                        width: "60px",
                                                        height: "60px",
                                                    }}
                                                >
                                                    <img
                                                        src={user.profile_pic}
                                                        width="100%"
                                                        height="100%"
                                                        alt={user.name}
                                                    />
                                                </Avatar>
                                            ) : (
                                                <AvartarText
                                                    text={user.name}
                                                    bg={user.active ? "seagreen" : "tomato"}
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
                                ))}
                        </List>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancle</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default SearchFriends;
