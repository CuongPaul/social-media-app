import {
    Menu,
    ListItem,
    MenuItem,
    IconButton,
    Typography,
    ListItemText,
    ListItemAvatar,
} from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { MoreHoriz } from "@material-ui/icons";
import React, { useMemo, useState, useContext, useEffect } from "react";

import AddMembers from "./AddMembers";
import ChangeAdmin from "./ChangeAdmin";
import UpdateChatRoom from "./UpdateChatRoom";
import { useUser, useChatRoom } from "../../hooks";
import { AvatarIcon, BadgeStyled } from "../common";
import { ChatContext, UserContext } from "../../App";

const ChatRooms = ({ chatRoom, setIsOpenGroupMembers }) => {
    const {
        chatDispatch,
        chatState: { chatRoomSelected },
    } = useContext(ChatContext);
    const {
        userState: { currentUser, friendsOnline },
    } = useContext(UserContext);

    const history = useHistory();
    const [anchorEl, setAnchorEl] = useState(null);
    const [isOpenActions, setIsOpenActions] = useState(false);
    const [isOpenAddMembers, setIsOpenAddMembers] = useState(false);
    const [isOpenChangeAdmin, setIsOpenChangeAdmin] = useState(false);
    const [isOpenUpdateChatRoom, setIsOpenUpdateChatRoom] = useState(false);

    const { handleBlockUser, handleUnblockUser } = useUser();
    const { handleLeaveChatRoom, handleDeleteChatRoom, handleSelectChatRoom } = useChatRoom();

    const isBlockUser = useMemo(() => {
        if (chatRoom.members.length === 2) {
            const reciver = chatRoom.members.find((item) => item._id !== currentUser._id);

            return currentUser?.block_users.includes(reciver._id);
        }
    }, [chatRoom._id, currentUser?.block_users]);

    useEffect(() => {
        if (chatRoom._id === chatRoomSelected?._id && chatRoom.members.length > 1) {
            setIsOpenActions(true);
        } else {
            setIsOpenActions(false);
        }
    }, [chatRoomSelected]);

    return (
        <div style={{ position: "relative" }}>
            <ListItem
                button
                onClick={() => handleSelectChatRoom(chatRoom)}
                style={{
                    margin: "5px 0",
                    borderRadius: "10px",
                    backgroundColor: chatRoomSelected?._id === chatRoom._id && "rgb(245,245,245)",
                }}
            >
                <ListItemAvatar>
                    <BadgeStyled
                        max={9}
                        isActive={friendsOnline.some((item) =>
                            chatRoom.members.some((element) => item._id === element._id)
                        )}
                        badgeContent={chatRoom?.unseen_message && chatRoom?.unseen_message}
                    >
                        <AvatarIcon text={chatRoom?.name} imageUrl={chatRoom?.avatar_image} />
                    </BadgeStyled>
                </ListItemAvatar>
                <ListItemText primary={chatRoom?.name} style={{ marginLeft: "16px" }} />
            </ListItem>
            {isOpenActions && (
                <div>
                    <IconButton
                        onClick={(e) => setAnchorEl(e.currentTarget)}
                        style={{ top: "8px", right: "16px", position: "absolute" }}
                    >
                        <MoreHoriz />
                    </IconButton>
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={() => setAnchorEl(null)}
                    >
                        {chatRoom.members.length === 2 && (
                            <>
                                <MenuItem
                                    onClick={() => {
                                        const reciver = chatRoom.members.find(
                                            (item) => item._id !== currentUser._id
                                        );

                                        if (isBlockUser) {
                                            handleUnblockUser(reciver._id);
                                            chatDispatch({ type: "SET_TYPE_BLOCK" });
                                        } else {
                                            handleBlockUser(reciver._id);
                                            chatDispatch({
                                                type: "SET_TYPE_BLOCK",
                                                payload: "block_reciver",
                                            });
                                        }
                                    }}
                                >
                                    <Typography>{isBlockUser ? "Unblock" : "Block"}</Typography>
                                </MenuItem>
                                <MenuItem
                                    onClick={() => {
                                        const friend = chatRoom.members.find(
                                            (item) => item._id !== currentUser._id
                                        );

                                        history.push(`/profile/${friend._id}`);
                                    }}
                                >
                                    <Typography>View profile</Typography>
                                </MenuItem>
                            </>
                        )}
                        {chatRoom.admin !== currentUser?._id && chatRoom.members.length > 2 && (
                            <div>
                                <MenuItem onClick={() => handleLeaveChatRoom(chatRoom._id)}>
                                    <Typography>Leave</Typography>
                                </MenuItem>
                                <MenuItem
                                    onClick={() => {
                                        setAnchorEl(null);
                                        setIsOpenGroupMembers(true);
                                    }}
                                >
                                    <Typography>Members</Typography>
                                </MenuItem>
                            </div>
                        )}
                        {chatRoom.admin === currentUser?._id && chatRoom.members.length > 2 && (
                            <div>
                                <MenuItem onClick={() => handleDeleteChatRoom(chatRoom._id)}>
                                    <Typography>Delete</Typography>
                                </MenuItem>
                                <MenuItem
                                    onClick={() => {
                                        setAnchorEl(null);
                                        setIsOpenGroupMembers(true);
                                    }}
                                >
                                    <Typography>Members</Typography>
                                </MenuItem>
                                <MenuItem
                                    onClick={() => {
                                        setAnchorEl(null);
                                        setIsOpenAddMembers(true);
                                    }}
                                >
                                    <Typography>Add members</Typography>
                                </MenuItem>
                                <MenuItem
                                    onClick={() => {
                                        setAnchorEl(null);
                                        setIsOpenUpdateChatRoom(true);
                                    }}
                                >
                                    <Typography>Update group</Typography>
                                </MenuItem>
                                <MenuItem
                                    onClick={() => {
                                        setAnchorEl(null);
                                        setIsOpenChangeAdmin(true);
                                    }}
                                >
                                    <Typography>Change admin</Typography>
                                </MenuItem>
                            </div>
                        )}
                    </Menu>
                </div>
            )}
            <UpdateChatRoom
                chatRoom={chatRoom}
                isOpen={isOpenUpdateChatRoom}
                setIsOpen={setIsOpenUpdateChatRoom}
            />
            <AddMembers isOpen={isOpenAddMembers} setIsOpen={setIsOpenAddMembers} />
            <ChangeAdmin isOpen={isOpenChangeAdmin} setIsOpen={setIsOpenChangeAdmin} />
        </div>
    );
};

export default ChatRooms;
