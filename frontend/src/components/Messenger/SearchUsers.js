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

import LoadingIcon from "../UI/Loading";
import { ChatContext } from "../../App";
import AvatarIcon from "../UI/AvatarIcon";
import { useChatRoom, useSearchUsers } from "../../hooks";

const SearchUsers = () => {
    const {
        chatState: { chatRooms },
    } = useContext(ChatContext);

    const [users, setUsers] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [searchValue, setSearchValue] = useState("");

    const { isLoading, handleSearchUsers } = useSearchUsers();
    const { handleSelectChatRoom, handleCreateChatRoomForTwoPeople } = useChatRoom();

    const handleClickUserItem = async (user) => {
        const chatRoomExisted = chatRooms.find(
            (chatRoom) =>
                chatRoom.members.length === 2 &&
                chatRoom.members.some((member) => member._id === user._id)
        );

        if (chatRoomExisted) {
            handleSelectChatRoom(chatRoomExisted);
        } else {
            handleCreateChatRoomForTwoPeople(user._id);
        }

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
                            label="User name"
                            variant="outlined"
                            value={searchValue}
                            placeholder="Enter user name"
                            onChange={(e) => setSearchValue(e.target.value)}
                            onKeyPress={(e) =>
                                e.key === "Enter" &&
                                handleSearchUsers({ setUsers, name: searchValue })
                            }
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
                        />
                        <Button
                            color="primary"
                            variant="contained"
                            disabled={isLoading}
                            style={{ flex: 1, width: "100%", borderRadius: "5px" }}
                            onClick={() => handleSearchUsers({ setUsers, name: searchValue })}
                        >
                            <LoadingIcon text={"Search"} isLoading={isLoading} />
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
