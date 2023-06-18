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
import React, { useRef, useState, Fragment } from "react";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { AvatarIcon, LoadingIcon } from "../common";
import { useChatRoom, useSearch } from "../../hooks";

const ChatRoomCreate = () => {
    const inputRef = useRef(null);
    const [friends, setFriends] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isPublic, setIsPublic] = useState(true);
    const [searchValue, setSearchValue] = useState("");
    const [chatRoomName, setChatRoomName] = useState("");
    const [imagePreview, setImagePreview] = useState("");
    const [imageUpload, setImageUpload] = useState(null);
    const [chatRoomMembers, setChatRoomMembers] = useState([]);

    const { handleCreateChatRoom, isLoading: isLoadingChatRoom } = useChatRoom();
    const { handleSearchFriends, isLoading: isLoadingSearchFriend } = useSearch();

    const handleChangeImage = (e) => {
        setImageUpload(e.target.files[0]);

        const reader = new FileReader();
        reader.readAsDataURL(e.target.files[0]);
        reader.onload = () => setImagePreview(reader.result);
    };

    const handleSelectFriend = (friend) => {
        const isSelected = chatRoomMembers.findIndex((item) => item._id === friend._id);

        if (isSelected === -1) {
            setChatRoomMembers([...chatRoomMembers, friend]);
        } else {
            setChatRoomMembers(chatRoomMembers.filter((item) => item._id !== friend._id));
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
                        display: "flex",
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
                            imageUrl={imagePreview}
                            text={chatRoomName || "?"}
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
                            disabled={isLoadingChatRoom}
                            style={{ flex: 1, borderRadius: "5px" }}
                            onClick={() => {
                                handleCreateChatRoom({
                                    isPublic,
                                    imageUpload,
                                    chatRoomName,
                                    chatRoomMembers: chatRoomMembers.map((item) => item._id),
                                });

                                setIsOpen(false);
                            }}
                        >
                            <LoadingIcon text={"Create"} isLoading={isLoadingChatRoom} />
                        </Button>
                    </div>
                    <div style={{ marginTop: "32px" }}>
                        {chatRoomMembers.map((friend) => (
                            <Chip
                                key={friend._id}
                                label={friend.name}
                                style={{ margin: "5px" }}
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
                            variant="outlined"
                            label="Friend name"
                            value={searchValue}
                            placeholder="Enter friend name"
                            style={{ flex: 4, marginRight: "16px" }}
                            onChange={(e) => setSearchValue(e.target.value)}
                            InputProps={{
                                endAdornment: searchValue && (
                                    <InputAdornment position="end">
                                        <FontAwesomeIcon
                                            icon={faTimes}
                                            onClick={() => {
                                                setFriends([]);
                                                setSearchValue("");
                                            }}
                                            style={{ marginRight: "10px", cursor: "pointer" }}
                                        />
                                    </InputAdornment>
                                ),
                            }}
                            onKeyPress={(e) =>
                                e.key === "Enter" &&
                                handleSearchFriends({ setFriends, name: searchValue })
                            }
                        />
                        <Button
                            color="primary"
                            variant="contained"
                            style={{ flex: 1, borderRadius: "5px" }}
                            onClick={() => handleSearchFriends({ setFriends, name: searchValue })}
                        >
                            <LoadingIcon text={"Search"} isLoading={isLoadingSearchFriend} />
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
                                    backgroundColor: "rgb(244,245,246)",
                                }}
                                onClick={() => handleSelectFriend(friend)}
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

export default ChatRoomCreate;
