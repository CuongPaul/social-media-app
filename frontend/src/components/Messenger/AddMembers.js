import {
    Chip,
    List,
    Paper,
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
import React, { useState, useEffect, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import LoadingIcon from "../UI/Loading";
import { ChatContext } from "../../App";
import AvatarIcon from "../UI/AvatarIcon";
import { useChatRoom, useSearchFriends } from "../../hooks";

const AddMembers = ({ isOpen, setIsOpen }) => {
    const {
        chatState: { chatRoomSelected },
    } = useContext(ChatContext);

    const [friends, setFriends] = useState([]);
    const [searchValue, setSearchValue] = useState("");
    const [friendsSelected, setFriendsSelected] = useState([]);

    const { handleAddMembers, isLoading: isLoadingChatRoom } = useChatRoom();
    const { handleSearchFriends, isLoading: isLoadingSearchFriends } = useSearchFriends();

    const handleClickFriend = async (friend) => {
        const isSelected = friendsSelected.findIndex((item) => item._id === friend._id);

        if (isSelected === -1) {
            setFriendsSelected([...friendsSelected, friend]);
        } else {
            setFriendsSelected(friendsSelected.filter((item) => item._id !== friend._id));
        }
    };

    useEffect(() => {
        setFriends([]);
        setSearchValue("");
        setFriendsSelected([]);
    }, [chatRoomSelected]);

    return (
        <Dialog fullWidth open={isOpen} onClose={() => setIsOpen(false)}>
            <CardHeader
                action={
                    <IconButton onClick={() => setIsOpen(false)}>
                        <Close />
                    </IconButton>
                }
                subheader={
                    <Typography style={{ fontWeight: 800, fontSize: "20px" }}>
                        Add members
                    </Typography>
                }
            />
            <DialogContent>
                {friendsSelected.length ? (
                    <div
                        style={{
                            display: "flex",
                            marginBottom: "32px",
                            alignItems: "center",
                        }}
                    >
                        <Paper
                            style={{
                                flex: 4,
                                width: "100%",
                                overflowX: "auto",
                                maxHeight: "104px",
                                marginRight: "16px",
                            }}
                        >
                            {friendsSelected.map((friend) => (
                                <Chip
                                    key={friend._id}
                                    label={friend.name}
                                    style={{ margin: "10px" }}
                                    onDelete={() =>
                                        setFriendsSelected(
                                            friendsSelected.filter(
                                                (item) => item._id !== friend._id
                                            )
                                        )
                                    }
                                />
                            ))}
                        </Paper>
                        <Button
                            color="primary"
                            variant="contained"
                            style={{
                                flex: 1,
                                width: "100%",
                                minHeight: "56px",
                                borderRadius: "5px",
                            }}
                            disabled={isLoadingChatRoom}
                            onClick={() =>
                                handleAddMembers({
                                    chatRoomId: chatRoomSelected._id,
                                    members: friendsSelected.map((item) => item._id),
                                })
                            }
                        >
                            <LoadingIcon text={"Add"} isLoading={isLoadingChatRoom} />
                        </Button>
                    </div>
                ) : null}
                <div style={{ display: "flex", marginBottom: "32px" }}>
                    <TextField
                        autoFocus
                        variant="outlined"
                        label="Friend name"
                        value={searchValue}
                        placeholder="Enter friend name"
                        onChange={(e) => setSearchValue(e.target.value)}
                        style={{ flex: 4, width: "100%", marginRight: "16px" }}
                        onKeyPress={(e) =>
                            e.key === "Enter" &&
                            handleSearchFriends({ setFriends, name: searchValue })
                        }
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
                    />
                    <Button
                        color="primary"
                        variant="contained"
                        disabled={isLoadingSearchFriends}
                        onClick={() => handleSearchFriends({ setFriends, name: searchValue })}
                        style={{ flex: 1, width: "100%", borderRadius: "5px" }}
                    >
                        <LoadingIcon text={"Search"} isLoading={isLoadingSearchFriends} />
                    </Button>
                </div>
                <List>
                    {friends.map((friend) =>
                        chatRoomSelected.members.some((item) => item._id === friend._id) ? null : (
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
                                        checked={friendsSelected.some(
                                            (item) => item._id === friend._id
                                        )}
                                    />
                                </ListItemIcon>
                            </ListItem>
                        )
                    )}
                </List>
            </DialogContent>
        </Dialog>
    );
};

export default AddMembers;
