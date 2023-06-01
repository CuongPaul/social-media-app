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
import { Link } from "react-router-dom";
import React, { useState, useContext } from "react";
import { Close, ArrowForward } from "@material-ui/icons";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import AvatarIcon from "../UI/AvatarIcon";
import { useChatRoom } from "../../hooks";
import { UIContext, ChatContext, UserContext } from "../../App";

const GroupMembers = ({ isOpen, setIsOpen }) => {
    const {
        uiState: { darkMode },
    } = useContext(UIContext);
    const {
        userState: { currentUser },
    } = useContext(UserContext);
    const {
        chatState: { chatRoomSelected },
    } = useContext(ChatContext);

    const [searchValue, setSearchValue] = useState("");
    const [memberSelected, setMemberSelected] = useState([]);
    const [members, setMembers] = useState(chatRoomSelected.members);

    const { handleRemoveMembers } = useChatRoom();

    const handleSearchMembers = (searchValue) => {
        const regex = new RegExp(searchValue, "i");
        setMembers(chatRoomSelected.members.filter((item) => regex.test(item.name)));
    };

    const handleClickMember = (friend) => {
        const isSelected = memberSelected.findIndex((item) => item._id === friend._id);
        if (isSelected === -1) {
            setMemberSelected([...memberSelected, friend]);
        } else {
            setMemberSelected(memberSelected.filter((item) => item._id !== friend._id));
        }
    };

    return (
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
                        Group members
                    </Typography>
                }
            />
            <DialogContent>
                {memberSelected.length ? (
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
                            {memberSelected.map((friend) => (
                                <Chip
                                    key={friend._id}
                                    label={friend.name}
                                    style={{ margin: "10px" }}
                                    onDelete={() =>
                                        setMemberSelected(
                                            memberSelected.filter((item) => item._id !== friend._id)
                                        )
                                    }
                                />
                            ))}
                        </Paper>
                        <Button
                            color="primary"
                            variant="contained"
                            onClick={() =>
                                handleRemoveMembers(
                                    chatRoomSelected._id,
                                    memberSelected.map((item) => item._id)
                                )
                            }
                            style={{ flex: 1, width: "100%", borderRadius: "5px" }}
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
                                setMembers(chatRoomSelected.members);
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
                                            setMembers(chatRoomSelected.members);
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
                    {members.map((member) => (
                        <div
                            key={member._id}
                            style={{
                                display: "flex",
                                cursor: "pointer",
                                borderRadius: "5px",
                                marginBottom: "10px",
                                background: darkMode ? "rgb(58,59,60)" : "rgb(240,242,245)",
                            }}
                        >
                            <ListItem
                                component={currentUser._id === chatRoomSelected.admin ? null : Link}
                                to={
                                    currentUser._id === chatRoomSelected.admin
                                        ? null
                                        : `/profile/${member._id}`
                                }
                                onClick={() => {
                                    if (currentUser._id === chatRoomSelected.admin) {
                                        if (currentUser._id !== member._id) {
                                            handleClickMember(member);
                                        }
                                    } else {
                                        setIsOpen(false);
                                    }
                                }}
                            >
                                <ListItemIcon>
                                    <AvatarIcon text={member.name} imageUrl={member.avatar_image} />
                                </ListItemIcon>
                                <ListItemText style={{ marginLeft: "32px" }}>
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
                                    {chatRoomSelected.admin === member._id ? (
                                        "Boss"
                                    ) : currentUser._id === chatRoomSelected.admin ? (
                                        <Checkbox
                                            checked={memberSelected.some(
                                                (item) => item._id === member._id
                                            )}
                                        />
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

export default GroupMembers;
