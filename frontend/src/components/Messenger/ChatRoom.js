import React, { useContext } from "react";
import { ListItem, ListItemText, ListItemAvatar } from "@material-ui/core";

import callApi from "../../api";
import AvatarIcon from "../UI/AvatarIcon";
import StyledBadge from "../UI/StyledBadge";
import { UIContext, ChatContext, UserContext } from "../../App";

const ChatRoom = ({ chatRoom }) => {
    const {
        chatDispatch,
        chatState: { chatRoomSelected },
    } = useContext(ChatContext);
    const {
        userState: { friendsOnline },
    } = useContext(UserContext);
    const { uiDispatch } = useContext(UIContext);

    const handleClickChat = async (chat) => {
        uiDispatch({ type: "SET_DRAWER", payload: false });
        chatDispatch({ type: "SET_CHATROOM_SELECTED", payload: chat });
        const { data } = await callApi({ url: `/message/chat-room/${chat._id}`, method: "GET" });
        chatDispatch({ type: "SET_MESSAGES", payload: data.rows });
    };

    return (
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
                        chatRoom.members.some((element) => element._id === item._id)
                    )}
                    badgeContent={chatRoom?.unseen_message && chatRoom?.unseen_message}
                >
                    <AvatarIcon text={chatRoom?.name} imageUrl={chatRoom?.avatar_image} />
                </StyledBadge>
            </ListItemAvatar>
            <ListItemText primary={chatRoom?.name} />
        </ListItem>
    );
};

export default ChatRoom;
