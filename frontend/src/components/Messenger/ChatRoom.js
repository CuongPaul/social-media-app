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
import React, { useState, useContext } from "react";

import callApi from "../../api";
import AvatarIcon from "../UI/AvatarIcon";
import StyledBadge from "../UI/StyledBadge";
import { ChatContext, UserContext } from "../../App";

const ChatRoom = ({ chatRoom }) => {
    const {
        chatDispatch,
        chatState: { chatRoomSelected },
    } = useContext(ChatContext);
    const {
        userState: { currentUser, friendsOnline },
    } = useContext(UserContext);

    const history = useHistory();
    const [anchorEl, setAnchorEl] = useState(null);
    const [isDisplay, setIsDisplay] = useState(false);

    const handleClickChat = async (chat) => {
        const { data } = await callApi({ method: "GET", url: `/message/chat-room/${chat._id}` });

        chatDispatch({ type: "SET_MESSAGES", payload: data.rows });
        chatDispatch({ type: "SET_CHATROOM_SELECTED", payload: chat });
    };

    return (
        <div
            style={{ position: "relative" }}
            onMouseEnter={() => setIsDisplay(true)}
            onMouseLeave={() => setIsDisplay(false)}
        >
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
                <IconButton
                    onClick={(e) => setAnchorEl(e.currentTarget)}
                    style={{ top: "8px", right: "16px", position: "absolute" }}
                >
                    <MoreHoriz />
                </IconButton>
            )}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => {
                    setAnchorEl(null);
                    setIsDisplay(false);
                }}
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
                        <MenuItem onClick={() => console.log("Leave")}>
                            <Typography>Leave</Typography>
                        </MenuItem>
                        <MenuItem onClick={() => console.log("Members")}>
                            <Typography>Members</Typography>
                        </MenuItem>
                    </div>
                )}
                {chatRoom.admin === currentUser?._id && chatRoom.members.length > 2 && (
                    <div>
                        <MenuItem onClick={() => console.log("Delete")}>
                            <Typography>Delete</Typography>
                        </MenuItem>
                        <MenuItem onClick={() => console.log("Add members")}>
                            <Typography>Add members</Typography>
                        </MenuItem>
                        <MenuItem onClick={() => console.log("Change admin")}>
                            <Typography>Change admin</Typography>
                        </MenuItem>
                    </div>
                )}
            </Menu>
        </div>
    );
};

export default ChatRoom;
