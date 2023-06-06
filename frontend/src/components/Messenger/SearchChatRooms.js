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

import { UserContext } from "../../App";
import AvatarIcon from "../UI/AvatarIcon";
import { useChatRoom } from "../../hooks";

const SearchChatRooms = () => {
    const {
        userState: { currentUser },
    } = useContext(UserContext);

    const [isOpen, setIsOpen] = useState(false);
    const [chatRooms, setChatRooms] = useState([]);
    const [searchValue, setSearchValue] = useState("");

    const { isLoading, handleJoinChatRoom, handleSelectChatRoom, handleSearchChatRooms } =
        useChatRoom();

    const handleClickChatItem = async (chat) => {
        const isMemberOfChat = chat.members.find((item) => item === currentUser._id);

        if (isMemberOfChat) {
            handleSelectChatRoom(chat);
        } else {
            handleJoinChatRoom(chat);
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
                            label="Group name"
                            variant="outlined"
                            value={searchValue}
                            placeholder="Enter group name"
                            onChange={(e) => setSearchValue(e.target.value)}
                            style={{ flex: 4, width: "100%", marginRight: "16px" }}
                            onKeyPress={(e) =>
                                e.key === "Enter" &&
                                handleSearchChatRooms({ setChatRooms, name: searchValue })
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
                            style={{ flex: 1, width: "100%", borderRadius: "5px" }}
                            onClick={() =>
                                handleSearchChatRooms({ setChatRooms, name: searchValue })
                            }
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

export default SearchChatRooms;
