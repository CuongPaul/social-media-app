import {
    Chip,
    List,
    Button,
    Dialog,
    Checkbox,
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
import { Close } from "@material-ui/icons";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import React, { useState, Fragment, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import callApi from "../../api";
import { UIContext } from "../../App";
import AvatarIcon from "../UI/AvatarIcon";
import { useSearchFriends } from "../../hooks";

const GroupChatCreate = () => {
    const { uiDispatch } = useContext(UIContext);

    const [isOpen, setIsOpen] = useState(false);
    const [friendName, setFriendName] = useState("");
    const [chatRoomName, setChatRoomName] = useState("");
    const [chatRoomMembers, setChatRoomMembers] = useState([]);

    const handleCreateGroup = async () => {
        try {
            await callApi({
                method: "POST",
                url: "/chat-room",
                data: { name: chatRoomName, members: chatRoomMembers.map((item) => item._id) },
            });
        } catch (err) {
            uiDispatch({
                type: "SET_ALERT_MESSAGE",
                payload: { display: true, color: "error", text: err.message },
            });
        }
    };
    const handleClickFriend = (friend) => {
        const isSelected = chatRoomMembers.findIndex((item) => item._id === friend._id);
        if (isSelected === -1) {
            setChatRoomMembers([...chatRoomMembers, friend]);
        } else {
            setChatRoomMembers(chatRoomMembers.filter((item) => item._id !== friend._id));
        }
    };

    const { friends, setFriends, handleSearchFriends } = useSearchFriends();

    return (
        <Fragment>
            <Button
                color="primary"
                variant="contained"
                onClick={() => setIsOpen(true)}
                style={{ fontSize: "10px", borderRadius: "8px", padding: "10px 5px" }}
            >
                Create group
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
                            Create chat room
                        </Typography>
                    }
                />
                <DialogContent>
                    <div style={{ display: "flex", marginBottom: "32px" }}>
                        <TextField
                            autoFocus
                            variant="outlined"
                            value={chatRoomName}
                            label="Chat room name"
                            placeholder="Enter chat room name"
                            onChange={(e) => setChatRoomName(e.target.value)}
                            style={{ flex: 4, width: "100%", marginRight: "16px" }}
                        />
                        <Button
                            color="primary"
                            variant="contained"
                            onClick={() => handleCreateGroup()}
                            style={{ flex: 1, width: "100%", borderRadius: "5px" }}
                        >
                            Create
                        </Button>
                    </div>
                    <div style={{ marginBottom: "20px" }}>
                        {chatRoomMembers.map((friend) => (
                            <Chip
                                key={friend._id}
                                label={friend.name}
                                style={{ marginRight: "10px" }}
                                onDelete={() =>
                                    setChatRoomMembers(
                                        chatRoomMembers.filter((item) => item._id !== friend._id)
                                    )
                                }
                            />
                        ))}
                    </div>
                    <div style={{ display: "flex", marginBottom: "32px" }}>
                        <TextField
                            value={friendName}
                            label="User name"
                            variant="outlined"
                            placeholder="Enter user name"
                            onChange={(e) => setFriendName(e.target.value)}
                            style={{ flex: 4, width: "100%", marginRight: "16px" }}
                            onKeyPress={(e) => e.key === "Enter" && handleSearchFriends(friendName)}
                            InputProps={{
                                endAdornment: friendName && (
                                    <InputAdornment position="end">
                                        <FontAwesomeIcon
                                            icon={faTimes}
                                            onClick={() => {
                                                setFriends([]);
                                                setFriendName("");
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
                            onClick={() => handleSearchFriends(friendName)}
                            style={{ flex: 1, width: "100%", borderRadius: "5px" }}
                        >
                            Search
                        </Button>
                    </div>
                    <List>
                        {friends.map((friend) => (
                            <ListItem
                                key={friend._id}
                                style={{
                                    cursor: "pointer",
                                    borderRadius: "10px",
                                    marginBottom: "10px",
                                    background: "rgb(244,245,246)",
                                }}
                                onClick={() => handleClickFriend(friend)}
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
                                    <Checkbox
                                        checked={chatRoomMembers.some(
                                            (item) => item._id === friend._id
                                        )}
                                    />
                                </ListItemIcon>
                            </ListItem>
                        ))}
                    </List>
                </DialogContent>
            </Dialog>
        </Fragment>
    );
};

export default GroupChatCreate;
