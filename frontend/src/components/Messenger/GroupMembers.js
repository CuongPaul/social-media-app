import {
    Chip,
    List,
    Button,
    Dialog,
    Checkbox,
    ListItem,
    CardHeader,
    IconButton,
    Typography,
    ListItemIcon,
    ListItemText,
    DialogContent,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import React, { useState, useContext } from "react";
import { Close, ArrowForward } from "@material-ui/icons";

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

    const [memberSelected, setMemberSelected] = useState([]);

    const handleClickMember = (friend) => {
        const isSelected = memberSelected.findIndex((item) => item._id === friend._id);
        if (isSelected === -1) {
            setMemberSelected([...memberSelected, friend]);
        } else {
            setMemberSelected(memberSelected.filter((item) => item._id !== friend._id));
        }
    };

    const { loading, handleRemoveMembers } = useChatRoom();

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
                <div style={{ marginBottom: "20px" }}>
                    {memberSelected.map((friend) => (
                        <Chip
                            key={friend._id}
                            label={friend.name}
                            style={{ marginRight: "10px" }}
                            onDelete={() =>
                                setMemberSelected(
                                    memberSelected.filter((item) => item._id !== friend._id)
                                )
                            }
                        />
                    ))}
                </div>
                <Button
                    onClick={() =>
                        handleRemoveMembers(
                            chatRoomSelected._id,
                            memberSelected.map((item) => item._id)
                        )
                    }
                >
                    Remove
                </Button>
                <List>
                    {chatRoomSelected.members.map((member) => (
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
