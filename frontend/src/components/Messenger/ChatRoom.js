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
import React, { useState, useContext, useEffect } from "react";

import callApi from "../../api";
import AddMembers from "./AddMembers";
import ChangeAdmin from "./ChangeAdmin";
import AvatarIcon from "../UI/AvatarIcon";
import GroupMembers from "./GroupMembers";
import StyledBadge from "../UI/StyledBadge";
import ChatRoomUpdate from "./ChatRoomUpdate";
import { UIContext, ChatContext, UserContext } from "../../App";

const ChatRoom = ({ chatRoom }) => {
    const {
        chatDispatch,
        chatState: { chatRoomSelected },
    } = useContext(ChatContext);
    const { uiDispatch } = useContext(UIContext);
    const {
        userState: { currentUser, friendsOnline },
    } = useContext(UserContext);

    const history = useHistory();
    const [anchorEl, setAnchorEl] = useState(null);
    const [isDisplay, setIsDisplay] = useState(false);
    const [isOpenAddMembers, setIsOpenAddMembers] = useState(false);
    const [isOpenChangeAdmin, setIsOpenChangeAdmin] = useState(false);
    const [isOpenGroupMembers, setIsOpenGroupMembers] = useState(false);
    const [isOpenUpdateChatRoom, setIsOpenUpdateChatRoom] = useState(false);

    const handleClickChat = async (chat) => {
        try {
            const { data } = await callApi({
                method: "GET",
                url: `/message/chat-room/${chat._id}`,
            });

            chatDispatch({ type: "SET_MESSAGES", payload: data.rows });
            chatDispatch({ type: "SET_CHATROOM_SELECTED", payload: chat });
        } catch (err) {
            uiDispatch({
                type: "SET_ALERT_MESSAGE",
                payload: { display: true, color: "error", text: err.message },
            });
        }
    };

    const handleLeaveChat = async (chatRoomId) => {
        try {
            const { message } = await callApi({
                method: "PUT",
                url: `/chat-room/leave-chat/${chatRoomId}`,
            });

            chatDispatch({ payload: chatRoomId, type: "REMOVE_CHATROOM" });
            chatDispatch({ payload: null, type: "SET_CHATROOM_SELECTED" });
            uiDispatch({
                type: "SET_ALERT_MESSAGE",
                payload: { display: true, text: message, color: "success" },
            });
        } catch (err) {
            uiDispatch({
                type: "SET_ALERT_MESSAGE",
                payload: { display: true, color: "error", text: err.message },
            });
        }
    };

    const handleDeleteChat = async (chatRoomId) => {
        try {
            const { message } = await callApi({
                method: "DELETE",
                url: `/chat-room/${chatRoomId}`,
            });

            chatDispatch({ payload: chatRoomId, type: "REMOVE_CHATROOM" });
            chatDispatch({ payload: null, type: "SET_CHATROOM_SELECTED" });
            uiDispatch({
                type: "SET_ALERT_MESSAGE",
                payload: { display: true, text: message, color: "success" },
            });
        } catch (err) {
            uiDispatch({
                type: "SET_ALERT_MESSAGE",
                payload: { display: true, color: "error", text: err.message },
            });
        }
    };

    useEffect(() => {
        if (chatRoom._id !== chatRoomSelected?._id) {
            setIsDisplay(false);
        } else {
            setIsDisplay(true);
        }
    }, [chatRoomSelected]);

    return (
        <div style={{ position: "relative" }}>
            <ListItem
                button
                onClick={() => handleClickChat(chatRoom)}
                style={{
                    borderRadius: "10px",
                    backgroundColor: chatRoomSelected?._id === chatRoom._id && "rgb(245,245,245)",
                }}
            >
                <ListItemAvatar>
                    <StyledBadge
                        max={9}
                        isActive={friendsOnline.some((item) =>
                            chatRoom.members.some((element) => item._id === element._id)
                        )}
                        badgeContent={chatRoom?.unseen_message && chatRoom?.unseen_message}
                    >
                        <AvatarIcon text={chatRoom?.name} imageUrl={chatRoom?.avatar_image} />
                    </StyledBadge>
                </ListItemAvatar>
                <ListItemText primary={chatRoom?.name} style={{ marginLeft: "16px" }} />
            </ListItem>
            {isDisplay && (
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
                            <MenuItem
                                onClick={() => {
                                    const reciver = chatRoom.members.find(
                                        (item) => item._id !== currentUser._id
                                    );

                                    history.push(`/profile/${reciver._id}`);
                                }}
                            >
                                <Typography>View profile</Typography>
                            </MenuItem>
                        )}
                        {chatRoom.admin !== currentUser?._id && chatRoom.members.length > 2 && (
                            <div>
                                <MenuItem onClick={() => handleLeaveChat(chatRoom._id)}>
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
                                <MenuItem onClick={() => handleDeleteChat(chatRoom._id)}>
                                    <Typography>Delete</Typography>
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
                                        setIsOpenChangeAdmin(true);
                                    }}
                                >
                                    <Typography>Change admin</Typography>
                                </MenuItem>
                                <MenuItem
                                    onClick={() => {
                                        setAnchorEl(null);
                                        setIsOpenUpdateChatRoom(true);
                                    }}
                                >
                                    <Typography>Update chat room</Typography>
                                </MenuItem>
                            </div>
                        )}
                    </Menu>
                </div>
            )}
            <ChatRoomUpdate
                chatRoom={chatRoom}
                isOpen={isOpenUpdateChatRoom}
                setIsOpen={setIsOpenUpdateChatRoom}
            />
            <AddMembers isOpen={isOpenAddMembers} setIsOpen={setIsOpenAddMembers} />
            <ChangeAdmin isOpen={isOpenChangeAdmin} setIsOpen={setIsOpenChangeAdmin} />
            <GroupMembers isOpen={isOpenGroupMembers} setIsOpen={setIsOpenGroupMembers} />
        </div>
    );
};

export default ChatRoom;
