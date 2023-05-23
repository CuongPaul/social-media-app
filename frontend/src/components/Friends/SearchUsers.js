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

import AvatarIcon from "../UI/AvatarIcon";
import { UIContext, UserContext } from "../../App";
import { useSearchUsers, useFriendActions } from "../../hooks";

const SearchUsers = () => {
    const {
        uiState: { darkMode },
    } = useContext(UIContext);
    const {
        userState: { currentUser, sendedFriendRequest },
    } = useContext(UserContext);

    const [isOpen, setIsOpen] = useState(false);
    const [searchValue, setSearchValue] = useState("");

    const {
        handleUnfriend,
        handleBlockUser,
        handleUnblockUser,
        handleSendFriendRequest,
        handleDeclineOrCancleFriendRequest,
    } = useFriendActions();
    const { users, setUsers, isLoading, handleSearchUsers } = useSearchUsers();

    return (
        <Fragment>
            <Typography
                style={{
                    display: "flex",
                    cursor: "pointer",
                    minWidth: "220px",
                    paddingLeft: "20px",
                    alignItems: "center",
                    borderRadius: "20px",
                    color: "rgb(176,179,184)",
                    justifyContent: "space-between",
                    background: darkMode ? "rgb(58,59,60)" : "rgb(240,242,245)",
                }}
                onClick={() => setIsOpen(true)}
            >
                Search
                <IconButton onClick={() => setIsOpen(true)}>
                    <Search />
                </IconButton>
            </Typography>
            <Dialog fullWidth open={isOpen} onClose={() => setIsOpen(false)}>
                <CardHeader
                    action={
                        <IconButton onClick={() => setIsOpen(false)}>
                            <Close />
                        </IconButton>
                    }
                    subheader={
                        <Typography
                            style={{ fontWeight: 800, fontSize: "20px", marginLeft: "10px" }}
                        >
                            Search users
                        </Typography>
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
                            onKeyPress={(e) => e.key === "Enter" && handleSearchUsers(searchValue)}
                        />
                        <Button
                            color="primary"
                            variant="contained"
                            disabled={isLoading}
                            onClick={() => handleSearchUsers(searchValue)}
                            style={{ flex: 1, width: "100%", borderRadius: "10px" }}
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
                                key={user._id}
                                style={{
                                    display: "flex",
                                    cursor: "pointer",
                                    borderRadius: "5px",
                                    marginBottom: "10px",
                                    background: "rgb(240,242,245)",
                                }}
                            >
                                <ListItem
                                    component={Link}
                                    to={`/profile/${user._id}`}
                                    onClick={() => setIsOpen(false)}
                                >
                                    <ListItemIcon>
                                        <AvatarIcon text={user.name} imageUrl={user.avatar_image} />
                                    </ListItemIcon>
                                    <ListItemText style={{ marginLeft: "6px" }}>
                                        <Typography style={{ fontWeight: 700, fontSize: "17px" }}>
                                            {user.name}
                                        </Typography>
                                    </ListItemText>
                                </ListItem>
                                {currentUser?.friends.find((friend) => friend._id === user._id) ? (
                                    <Button
                                        variant="contained"
                                        style={{
                                            color: "white",
                                            margin: "10px",
                                            minWidth: "80px",
                                            fontSize: "10px",
                                            background: "rgb(108,117,125)",
                                        }}
                                        onClick={() => handleUnfriend(user._id)}
                                    >
                                        Unfriend
                                    </Button>
                                ) : sendedFriendRequest?.find(
                                      (item) => item.receiver._id === user._id
                                  ) ? (
                                    <Button
                                        variant="contained"
                                        style={{
                                            color: "white",
                                            margin: "10px",
                                            minWidth: "80px",
                                            fontSize: "10px",
                                            background: "rgb(255,193,7)",
                                        }}
                                        onClick={() =>
                                            handleDeclineOrCancleFriendRequest(
                                                sendedFriendRequest?.find(
                                                    (item) => item.receiver._id === user._id
                                                )._id
                                            )
                                        }
                                    >
                                        Cancel
                                    </Button>
                                ) : (
                                    <Button
                                        variant="contained"
                                        style={{
                                            color: "white",
                                            margin: "10px",
                                            minWidth: "80px",
                                            fontSize: "10px",
                                            background: "rgb(0,123,255)",
                                        }}
                                        onClick={() => handleSendFriendRequest(user._id)}
                                    >
                                        Add
                                    </Button>
                                )}
                                {currentUser.block_users.includes(user._id) ? (
                                    <Button
                                        variant="contained"
                                        style={{
                                            color: "white",
                                            margin: "10px",
                                            minWidth: "80px",
                                            fontSize: "10px",
                                            background: "rgb(23,162,184)",
                                        }}
                                        onClick={() => handleUnblockUser(user._id)}
                                    >
                                        Unblock
                                    </Button>
                                ) : (
                                    <Button
                                        variant="contained"
                                        style={{
                                            color: "white",
                                            margin: "10px",
                                            minWidth: "80px",
                                            fontSize: "10px",
                                            background: "rgb(220,53,69)",
                                        }}
                                        onClick={() => handleBlockUser(user._id)}
                                    >
                                        Block
                                    </Button>
                                )}
                            </div>
                        ))}
                    </List>
                </DialogContent>
            </Dialog>
        </Fragment>
    );
};

export default SearchUsers;
