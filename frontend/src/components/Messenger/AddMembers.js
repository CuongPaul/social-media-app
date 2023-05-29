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
    CircularProgress,
} from "@material-ui/core";
import { Close } from "@material-ui/icons";
import React, { useState, Fragment, useContext } from "react";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { ChatContext } from "../../App";
import AvatarIcon from "../UI/AvatarIcon";
import { useChatRoom, useSearchFriends } from "../../hooks";

const AddMembers = () => {
    const { chatState } = useContext(ChatContext);

    const [isOpen, setIsOpen] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [friendsSelected, setFriendsSelected] = useState([]);

    const { friends, isLoading, setFriends, handleSearchFriends } = useSearchFriends();

    const handleClickFriend = async (friend) => {
        const isSelected = friendsSelected.findIndex((item) => item._id === friend._id);
        if (isSelected === -1) {
            setFriendsSelected([...friendsSelected, friend]);
        } else {
            setFriendsSelected(friendsSelected.filter((item) => item._id !== friend._id));
        }
    };

    const { loading, handleAddMembers } = useChatRoom();

    return (
        <Fragment>
            <Button color="primary" variant="contained" onClick={() => setIsOpen(true)}>
                Add members
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
                            Add members
                        </Typography>
                    }
                />
                <DialogContent>
                    <div style={{ marginBottom: "20px" }}>
                        {friendsSelected.map((friend) => (
                            <Chip
                                key={friend._id}
                                label={friend.name}
                                style={{ marginRight: "10px" }}
                                onDelete={() =>
                                    setFriendsSelected(
                                        friendsSelected.filter((item) => item._id !== friend._id)
                                    )
                                }
                            />
                        ))}
                    </div>
                    <Button
                        onClick={() =>
                            handleAddMembers(
                                chatState.chatRoomSelected._id,
                                friendsSelected.map((item) => item._id)
                            )
                        }
                    >
                        Add
                    </Button>
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
                                e.key === "Enter" && handleSearchFriends(searchValue)
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
                            disabled={isLoading}
                            onClick={() => handleSearchFriends(searchValue)}
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
                        {friends.map((friend) =>
                            chatState.chatRoomSelected.members.some(
                                (item) => item._id === friend._id
                            ) ? null : (
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
        </Fragment>
    );
};

export default AddMembers;
