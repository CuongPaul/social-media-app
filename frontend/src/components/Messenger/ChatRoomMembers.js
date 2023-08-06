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
import { Close, ArrowForward } from "@material-ui/icons";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import React, { useState, useEffect, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useChatRoom } from "../../hooks";
import { AvatarIcon, BadgeStyled } from "../common";
import { UIContext, ChatContext, UserContext } from "../../App";

const ChatRoomMembers = ({ isOpen, setIsOpen }) => {
    const {
        uiState: { darkMode },
    } = useContext(UIContext);
    const {
        userState: { currentUser, friendsOnline },
    } = useContext(UserContext);
    const {
        chatState: { chatRooms, chatRoomSelected },
    } = useContext(ChatContext);

    const [members, setMembers] = useState([]);
    const [searchValue, setSearchValue] = useState("");
    const [membersSelected, setMembersSelected] = useState([]);

    const { handleRemoveMembers, handleSelectChatRoom, handleCreateChatRoomForTwoPeople } =
        useChatRoom();

    const handleSearchMembers = (searchValue) => {
        const regex = new RegExp(searchValue, "i");
        setMembers(chatRoomSelected?.members.filter((item) => regex.test(item.name)));
    };

    const handleClickMemberItem = (member) => {
        if (currentUser._id === chatRoomSelected?.admin) {
            if (currentUser._id !== member._id) {
                const isSelected = membersSelected.findIndex((item) => item._id === member._id);

                if (isSelected === -1) {
                    setMembersSelected([...membersSelected, member]);
                } else {
                    setMembersSelected(membersSelected.filter((item) => item._id !== member._id));
                }
            }
        } else {
            if (member._id !== currentUser._id) {
                const chatRoom = chatRooms.find(
                    (chatRoom) =>
                        chatRoom.members.length === 2 &&
                        chatRoom.members.some((item) => item._id === member._id)
                );

                if (chatRoom) {
                    handleSelectChatRoom(chatRoom);
                } else {
                    handleCreateChatRoomForTwoPeople(member._id);
                }
            }

            setIsOpen(false);
        }
    };

    useEffect(() => {
        setSearchValue("");
        setMembersSelected([]);
        setMembers(chatRoomSelected?.members);
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
                        Members group {chatRoomSelected?.name}
                    </Typography>
                }
            />
            <DialogContent>
                {membersSelected.length ? (
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
                            {membersSelected.map((friend) => (
                                <Chip
                                    key={friend._id}
                                    label={friend.name}
                                    style={{ margin: "12px" }}
                                    onDelete={() =>
                                        setMembersSelected(
                                            membersSelected.filter(
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
                            onClick={() =>
                                handleRemoveMembers({
                                    chatRoomId: chatRoomSelected?._id,
                                    members: membersSelected.map((item) => item._id),
                                })
                            }
                            disabled={chatRoomSelected.members.length - membersSelected.length < 3}
                        >
                            Remove
                        </Button>
                    </div>
                ) : null}
                <div style={{ display: "flex", marginBottom: "32px" }}>
                    <TextField
                        autoFocus
                        label="Name"
                        variant="outlined"
                        value={searchValue}
                        placeholder="Enter name"
                        onChange={(e) => {
                            setSearchValue(e.target.value);
                            if (!e.target.value) {
                                setMembers(chatRoomSelected?.members);
                            }
                        }}
                        style={{ flex: 4, width: "100%", marginRight: "16px" }}
                        onKeyPress={(e) => e.key === "Enter" && handleSearchMembers(searchValue)}
                        InputProps={{
                            endAdornment: searchValue && (
                                <InputAdornment position="end">
                                    <FontAwesomeIcon
                                        icon={faTimes}
                                        onClick={() => {
                                            setSearchValue("");
                                            setMembers(chatRoomSelected?.members);
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
                        onClick={() => handleSearchMembers(searchValue)}
                        style={{ flex: 1, width: "100%", borderRadius: "5px" }}
                    >
                        Search
                    </Button>
                </div>
                <List>
                    {members?.map((member) => (
                        <div
                            key={member._id}
                            style={{
                                display: "flex",
                                cursor: "pointer",
                                borderRadius: "5px",
                                marginBottom: "10px",
                                backgroundColor: darkMode ? "rgb(58,59,60)" : "rgb(240,242,245)",
                            }}
                        >
                            <ListItem onClick={() => handleClickMemberItem(member)}>
                                <ListItemIcon>
                                    <BadgeStyled
                                        isActive={friendsOnline.some(
                                            (item) => item._id === member._id
                                        )}
                                    >
                                        <AvatarIcon
                                            text={member.name}
                                            imageUrl={member.avatar_image}
                                        />
                                    </BadgeStyled>
                                </ListItemIcon>
                                <ListItemText style={{ marginLeft: "16px" }}>
                                    <Typography
                                        style={{
                                            fontWeight: 700,
                                            fontSize: "17px",
                                            color: darkMode ? "rgb(255,255,255)" : "rgb(33,33,33)",
                                        }}
                                    >
                                        {member.name}
                                    </Typography>
                                </ListItemText>
                                <ListItemIcon>
                                    {chatRoomSelected?.admin === member._id ? (
                                        "Admin"
                                    ) : currentUser._id === chatRoomSelected?.admin ? (
                                        <Checkbox
                                            checked={membersSelected.some(
                                                (item) => item._id === member._id
                                            )}
                                        />
                                    ) : member._id === currentUser._id ? (
                                        "You"
                                    ) : (
                                        <ArrowForward />
                                    )}
                                </ListItemIcon>
                            </ListItem>
                        </div>
                    ))}
                </List>
            </DialogContent>
        </Dialog>
    );
};

export default ChatRoomMembers;
