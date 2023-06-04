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
import { UIContext, ChatContext } from "../../App";

const SearchUsers = () => {
    const {
        chatDispatch,
        chatState: { chatRooms },
    } = useContext(ChatContext);
    const { uiDispatch } = useContext(UIContext);

    const [isOpen, setIsOpen] = useState(false);
    const [searchValue, setSearchValue] = useState("");

    const { users, isLoading, setUsers, handleSearchUsers } = useSearchUsers();

    const handleClickUserItem = async (user) => {
        const chatRoomExisted = chatRooms.find(
            (chatRoom) =>
                chatRoom.members.length === 2 &&
                chatRoom.members.some((member) => member._id === user._id)
        );

        if (chatRoomExisted) {
            handleSelectChat(chatRoomExisted);
        } else {
            handleCreateChat(user);
        }
    };

    const handleSelectChat = async (chat) => {
        try {
            const { data } = await callApi({
                method: "GET",
                url: `/message/chat-room/${chat._id}`,
            });
            chatDispatch({ type: "SET_MESSAGES", payload: data.rows });
            chatDispatch({ type: "SET_CHATROOM_SELECTED", payload: chat });

            setIsOpen(false);
        } catch (err) {
            uiDispatch({
                type: "SET_ALERT_MESSAGE",
                payload: { display: true, color: "error", text: err.message },
            });
        }
    };

    const handleCreateChat = async (reciver) => {
        try {
            const { data } = await callApi({
                method: "POST",
                data: { reciver: reciver._id },
                url: `/chat-room/two-people`,
            });
            chatDispatch({ type: "ADD_CHATROOM", payload: data });
            chatDispatch({ type: "SET_CHATROOM_SELECTED", payload: data });

            setIsOpen(false);
        } catch (err) {
            uiDispatch({
                type: "SET_ALERT_MESSAGE",
                payload: { display: true, color: "error", text: err.message },
            });
        }
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
            <Dialog fullWidth open={isOpen} onClose={() => setIsOpen(false)}>
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
                        {users.map((user) => (
                            <ListItem
                                key={user._id}
                                style={{
                                    cursor: "pointer",
                                    borderRadius: "10px",
                                    marginBottom: "10px",
                                    background: "rgb(244,245,246)",
                                }}
                                onClick={() => handleClickUserItem(user)}
                            >
                                <ListItemIcon>
                                    <AvatarIcon
                                        size="60px"
                                        text={user.name}
                                        imageUrl={user.avatar_image}
                                    />
                                </ListItemIcon>
                                <ListItemText style={{ marginLeft: "32px" }}>
                                    <Typography style={{ fontSize: "17px", fontWeight: "700" }}>
                                        {user.name}
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

export default SearchUsers;
