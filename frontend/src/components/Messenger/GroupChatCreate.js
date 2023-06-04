import {
    Chip,
    List,
    Badge,
    Avatar,
    Button,
    Dialog,
    Switch,
    Checkbox,
    ListItem,
    CardMedia,
    TextField,
    CardHeader,
    IconButton,
    Typography,
    CardContent,
    ListItemIcon,
    ListItemText,
    InputAdornment,
} from "@material-ui/core";
import { Close } from "@material-ui/icons";
import { CameraAlt } from "@material-ui/icons";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useRef, useState, Fragment, useContext } from "react";

import callApi from "../../api";
import AvatarIcon from "../UI/AvatarIcon";
import { useSearchFriends } from "../../hooks";
import { UIContext, ChatContext } from "../../App";

const GroupChatCreate = () => {
    const { uiDispatch } = useContext(UIContext);
    const { chatDispatch } = useContext(ChatContext);

    const inputRef = useRef(null);
    const [isOpen, setIsOpen] = useState(false);
    const [isPublic, setIsPublic] = useState(true);
    const [friendName, setFriendName] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [chatRoomName, setChatRoomName] = useState("");
    const [imagePreview, setImagePreview] = useState("");
    const [imageUpload, setImageUpload] = useState(null);
    const [chatRoomMembers, setChatRoomMembers] = useState([]);

    const { friends, setFriends, handleSearchFriends } = useSearchFriends();

    const handleChangeImage = (e) => {
        setImageUpload(e.target.files[0]);

        const reader = new FileReader();
        reader.readAsDataURL(e.target.files[0]);
        reader.onload = () => {
            setImagePreview(reader.result);
        };
    };

    const handleClickFriend = (friend) => {
        const isSelected = chatRoomMembers.findIndex((item) => item._id === friend._id);
        if (isSelected === -1) {
            setChatRoomMembers([...chatRoomMembers, friend]);
        } else {
            setChatRoomMembers(chatRoomMembers.filter((item) => item._id !== friend._id));
        }
    };

    const handleCreateGroup = async ({ isPublic, imageUpload, chatRoomName, chatRoomMembers }) => {
        setIsLoading(true);

        try {
            let imageUrl = "";
            if (imageUpload) {
                const formData = new FormData();
                formData.append("files", imageUpload);
                formData.append("folder", "chat-room-avatar");

                const { data } = await callApi({
                    method: "POST",
                    data: formData,
                    url: "/upload/files",
                });

                imageUrl = data.images[0];
            }

            const { data } = await callApi({
                method: "POST",
                url: "/chat-room",
                data: {
                    name: chatRoomName,
                    is_public: isPublic,
                    avatar_image: imageUrl,
                    members: chatRoomMembers,
                },
            });
            chatDispatch({ type: "ADD_CHATROOM", payload: data });
            chatDispatch({ type: "SET_CHATROOM_SELECTED", payload: data });

            setIsOpen(false);
            setIsLoading(false);
        } catch (err) {
            setIsLoading(true);
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
                New group
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
                            Create new group
                        </Typography>
                    }
                />
                <CardMedia
                    style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "20px",
                        justifyContent: "center",
                    }}
                >
                    <Badge
                        overlap="rectangular"
                        badgeContent={
                            <IconButton
                                style={{ top: "160px", right: "25px" }}
                                onClick={() => inputRef.current.click()}
                            >
                                <Avatar>
                                    <CameraAlt style={{ color: "black" }} />
                                </Avatar>
                            </IconButton>
                        }
                    >
                        <AvatarIcon
                            size="200px"
                            fontSize="150px"
                            text={chatRoomName || "?"}
                            imageUrl={imagePreview}
                        />
                        <input
                            type="file"
                            ref={inputRef}
                            accept="image/*"
                            style={{ display: "none" }}
                            onChange={handleChangeImage}
                        />
                    </Badge>
                </CardMedia>
                <div style={{ textAlign: "center" }}>
                    <Switch checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} />
                </div>
                <Typography style={{ fontWeight: 800, fontSize: "20px", textAlign: "center" }}>
                    {chatRoomName}
                </Typography>
                <CardContent>
                    <div style={{ display: "flex" }}>
                        <TextField
                            label="Group name"
                            variant="outlined"
                            value={chatRoomName}
                            placeholder="Enter group name"
                            style={{ flex: 4, marginRight: "16px" }}
                            onChange={(e) => setChatRoomName(e.target.value)}
                        />
                        <Button
                            color="primary"
                            variant="contained"
                            disabled={isLoading}
                            style={{ flex: 1, borderRadius: "5px" }}
                            onClick={() =>
                                handleCreateGroup({
                                    isPublic,
                                    imageUpload,
                                    chatRoomName,
                                    chatRoomMembers: chatRoomMembers.map((item) => item._id),
                                })
                            }
                        >
                            Create
                        </Button>
                    </div>
                    <div style={{ marginTop: "32px" }}>
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
                    <div style={{ display: "flex", marginTop: "20px" }}>
                        <TextField
                            value={friendName}
                            label="Friend name"
                            variant="outlined"
                            placeholder="Enter friend name"
                            style={{ flex: 4, marginRight: "16px" }}
                            onChange={(e) => setFriendName(e.target.value)}
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
                            onKeyPress={(e) => e.key === "Enter" && handleSearchFriends(friendName)}
                        />
                        <Button
                            color="primary"
                            variant="contained"
                            style={{ flex: 1, borderRadius: "5px" }}
                            onClick={() => handleSearchFriends(friendName)}
                        >
                            Search
                        </Button>
                    </div>
                    <List style={{ marginTop: friends.length && "15px" }}>
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
                                    <Typography style={{ fontWeight: 700, fontSize: "17px" }}>
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
                </CardContent>
            </Dialog>
        </Fragment>
    );
};

export default GroupChatCreate;
