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
} from "@material-ui/core";
import { Close, ArrowForward } from "@material-ui/icons";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import React, { useState, Fragment, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import callApi from "../../api";
import AvatarIcon from "../UI/AvatarIcon";
import { UserContext, UIContext, ChatContext } from "../../App";

const SearchGroups = () => {
    const {
        userState: { currentUser },
    } = useContext(UserContext);
    const { uiDispatch } = useContext(UIContext);
    const { chatDispatch } = useContext(ChatContext);

    const [isOpen, setIsOpen] = useState(false);
    const [chatRooms, setChatRooms] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchValue, setSearchValue] = useState("");

    const handleClickChatItem = async (chat) => {
        const isMemberOfChat = chat.members.find((item) => item === currentUser._id);

        if (isMemberOfChat) {
            handleSelectChat(chat);
        } else {
            handleJoinChat(chat);
        }
    };

    const handleSelectChat = async (chat) => {
        setIsLoading(true);

        try {
            const { data } = await callApi({
                method: "GET",
                url: `/message/chat-room/${chat._id}`,
            });
            chatDispatch({ type: "SET_MESSAGES", payload: data.rows });
            chatDispatch({ type: "SET_CHATROOM_SELECTED", payload: chat });

            setIsOpen(false);
            setIsLoading(false);
        } catch (err) {
            setIsLoading(false);
            uiDispatch({
                type: "SET_ALERT_MESSAGE",
                payload: { display: true, color: "error", text: err.message },
            });
        }
    };

    const handleJoinChat = async (chat) => {
        setIsLoading(true);

        try {
            const { data: chatRoomData } = await callApi({
                method: "PUT",
                url: `/chat-room/join-chat/${chat._id}`,
            });
            chatDispatch({ type: "ADD_CHATROOM", payload: chatRoomData });
            chatDispatch({ type: "SET_CHATROOM_SELECTED", payload: chat });

            const { data: messagesData } = await callApi({
                method: "GET",
                url: `/message/chat-room/${chat._id}`,
            });
            chatDispatch({ type: "SET_MESSAGES", payload: messagesData.rows });

            setIsOpen(false);
            setIsLoading(false);
        } catch (err) {
            setIsLoading(false);
            uiDispatch({
                type: "SET_ALERT_MESSAGE",
                payload: { display: true, color: "error", text: err.message },
            });
        }
    };

    const handleSearchGroupsChat = async (name) => {
        setIsLoading(true);

        try {
            const { data } = await callApi({
                method: "GET",
                query: { name },
                url: "/chat-room/search",
            });

            setIsLoading(false);
            setChatRooms(data.rows);
        } catch (err) {
            setIsLoading(false);
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
                Search groups
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
                            Search groups
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
                            onKeyPress={(e) =>
                                e.key === "Enter" && handleSearchGroupsChat(searchValue)
                            }
                            InputProps={{
                                endAdornment: searchValue && (
                                    <InputAdornment position="end">
                                        <FontAwesomeIcon
                                            icon={faTimes}
                                            onClick={() => {
                                                setChatRooms([]);
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
                            onClick={() => handleSearchGroupsChat(searchValue)}
                            style={{ flex: 1, width: "100%", borderRadius: "5px" }}
                        >
                            Search
                        </Button>
                    </div>
                    <List>
                        {chatRooms.map((chatRoom) => (
                            <ListItem
                                key={chatRoom._id}
                                style={{
                                    cursor: "pointer",
                                    borderRadius: "10px",
                                    marginBottom: "10px",
                                    background: "rgb(244,245,246)",
                                }}
                                onClick={() => handleClickChatItem(chatRoom)}
                            >
                                <ListItemIcon>
                                    <AvatarIcon
                                        size="60px"
                                        text={chatRoom.name}
                                        imageUrl={chatRoom.avatar_image}
                                    />
                                </ListItemIcon>
                                <ListItemText style={{ marginLeft: "32px" }}>
                                    <Typography style={{ fontSize: "17px", fontWeight: "700" }}>
                                        {chatRoom.name}
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

export default SearchGroups;
