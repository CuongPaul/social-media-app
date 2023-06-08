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
import React, { useState, useContext } from "react";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import AvatarIcon from "../UI/AvatarIcon";
import { UIContext, UserContext } from "../../App";
import { useSearchUsers, useUser, useFriendRequest } from "../../hooks";

const SearchUsers = () => {
    const {
        uiState: { darkMode },
    } = useContext(UIContext);
    const {
        userState: { currentUser, sendedFriendRequests },
    } = useContext(UserContext);

    const [users, setUsers] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [searchValue, setSearchValue] = useState("");

    const { isLoading, handleSearchUsers } = useSearchUsers();
    const { handleUnfriend, handleBlockUser, handleUnblockUser } = useUser();
    const { handleSendFriendRequest, handleCancelFriendRequest } = useFriendRequest();

    return (
        <div style={{ marginLeft: "16px" }}>
            <Typography
                style={{
                    display: "flex",
                    cursor: "pointer",
                    minWidth: "200px",
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
                            style={{ flex: 4, width: "100%" }}
                            onChange={(e) => setSearchValue(e.target.value)}
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
                            onKeyPress={(e) =>
                                e.key === "Enter" &&
                                handleSearchUsers({ setUsers, name: searchValue })
                            }
                        />
                        <Button
                            color="primary"
                            variant="contained"
                            disabled={isLoading}
                            style={{
                                flex: 1,
                                width: "100%",
                                marginLeft: "16px",
                                borderRadius: "10px",
                            }}
                            onClick={() => handleSearchUsers({ setUsers, name: searchValue })}
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
                                    background: darkMode ? "rgb(58,59,60)" : "rgb(240,242,245)",
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
                                        <Typography
                                            style={{
                                                fontWeight: 700,
                                                fontSize: "17px",
                                                color: darkMode
                                                    ? "rgb(255,255,255)"
                                                    : "rgb(33,33,33)",
                                            }}
                                        >
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
                                ) : sendedFriendRequests?.find(
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
                                            handleCancelFriendRequest(
                                                sendedFriendRequests?.find(
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
        </div>
    );
};

export default SearchUsers;
