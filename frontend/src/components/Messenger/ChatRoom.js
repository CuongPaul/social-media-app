import React, { useContext } from "react";
import { Badge, ListItem, ListItemText, ListItemAvatar } from "@material-ui/core";

import callApi from "../../api";
import AvatarIcon from "../UI/AvatarIcon";
import { ChatContext, UIContext } from "../../App";

const ChatRoom = ({ chatRoom }) => {
    const { chatDispatch } = useContext(ChatContext);
    const { uiDispatch } = useContext(UIContext);

    const handleClickChat = async (chat) => {
        uiDispatch({ type: "SET_DRAWER", payload: false });
        chatDispatch({ type: "SET_CHATROOM_SELECTED", payload: chat });
        const { data } = await callApi({ url: `/message/chat-room/${chat._id}`, method: "GET" });
        chatDispatch({ type: "SET_MESSAGES", payload: data.rows });
    };

    return (
        <ListItem button onClick={() => handleClickChat(chatRoom)}>
            <ListItemAvatar>
                <Badge
                    max={9}
                    color="error"
                    overlap="rectangular"
                    badgeContent={chatRoom?.unseen_message && chatRoom?.unseen_message}
                >
                    <AvatarIcon text={chatRoom?.name} imageUrl={chatRoom?.avatar_image} />
                </Badge>
            </ListItemAvatar>
            <ListItemText primary={chatRoom?.name} />
        </ListItem>
    );
};

export default ChatRoom;
