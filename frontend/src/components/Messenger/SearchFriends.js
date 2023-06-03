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
import { Close, ArrowForward } from "@material-ui/icons";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import React, { useState, Fragment, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import callApi from "../../api";
import AvatarIcon from "../UI/AvatarIcon";
import { useSearchUsers } from "../../hooks";
import { ChatContext, UIContext } from "../../App";

const SearchFriends = () => {
    const {
        chatDispatch,
        chatState: { chatRooms },
    } = useContext(ChatContext);
    const { uiDispatch } = useContext(UIContext);

    const [isOpen, setIsOpen] = useState(false);
    const [searchValue, setSearchValue] = useState("");

    const { users, isLoading, setUsers, handleSearchUsers } = useSearchUsers();

    const handleClickFriend = async (friend) => {
        uiDispatch({ type: "SET_DRAWER", payload: false });
        const { data } = await callApi({
            method: "POST",
            url: `/chat-room/two-people`,
            data: { reciver: friend._id },
        });
        chatDispatch({ type: "SET_CHATROOM_SELECTED", payload: data });
        setIsOpen(false);
    };

    const handleClickChat = async (chat) => {
        chatDispatch({ type: "SET_CHATROOM_SELECTED", payload: chat });
        const { data } = await callApi({ url: `/message/chat-room/${chat._id}`, method: "GET" });
        chatDispatch({ type: "SET_MESSAGES", payload: data.rows });
        setIsOpen(false);
    };

    return (
        <Fragment>
            <Button
                color="primary"
                variant="contained"
                onClick={() => setIsOpen(true)}
                style={{ fontSize: "10px", borderRadius: "8px", padding: "10px 5px" }}
            >
                Search users
            </Button>
            <Dialog
                fullWidth
                open={isOpen}
                style={{ marginTop: "50px" }}
                onClose={() => setIsOpen(false)}
            >
                <CardHeader
                    action={
                        <IconButton onClick={() => setIsOpen(false)}>
                            <Close />
                        </IconButton>
                    }
                    subheader={
                        <Typography style={{ fontWeight: 800, fontSize: "20px" }}>
                            Search users
                        </Typography>
                    }
                />
                <DialogContent>
                    <div style={{ display: "flex", marginBottom: "32px" }}>
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
                        {users.map((friend) => (
                            <ListItem
                                key={friend._id}
                                style={{
                                    cursor: "pointer",
                                    borderRadius: "10px",
                                    marginBottom: "10px",
                                    background: "rgb(244,245,246)",
                                }}
                                onClick={() => {
                                    const chatRoom = chatRooms.find(
                                        (chatRoom) =>
                                            chatRoom.members.length === 2 &&
                                            chatRoom.members.some(
                                                (member) => member._id === friend._id
                                            )
                                    );

                                    if (chatRoom) {
                                        handleClickChat(chatRoom);
                                    } else {
                                        handleClickFriend(friend);
                                    }
                                }}
                            >
                                <ListItemIcon>
                                    <AvatarIcon
                                        size="60px"
                                        text={friend.name}
                                        imageUrl={friend.avatar_image}
                                    />
                                </ListItemIcon>
                                <ListItemText style={{ marginLeft: "32px" }}>
                                    <Typography style={{ fontSize: "17px", fontWeight: "700" }}>
                                        {friend.name}
                                    </Typography>
                                </ListItemText>
                                <ListItemIcon>
                                    <ArrowForward />
                                </ListItemIcon>
                            </ListItem>
                        ))}
                    </List>
                </DialogContent>
            </Dialog>
        </Fragment>
    );
};

export default SearchFriends;
