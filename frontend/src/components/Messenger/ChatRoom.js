import React, { useContext } from "react";
import { ListItem, ListItemText, ListItemAvatar } from "@material-ui/core";

import callApi from "../../api";
import AvatarIcon from "../UI/AvatarIcon";
import StyledBadge from "../UI/StyledBadge";
import { ChatContext, UserContext } from "../../App";

const ChatRoom = ({ chatRoom }) => {
    const {
        userState: { friendsOnline },
    } = useContext(UserContext);
    const {
        chatDispatch,
        chatState: { chatRoomSelected },
    } = useContext(ChatContext);

    const handleClickChat = async (chat) => {
        const { data } = await callApi({ method: "GET", url: `/message/chat-room/${chat._id}` });

        chatDispatch({ type: "SET_MESSAGES", payload: data.rows });
        chatDispatch({ type: "SET_CHATROOM_SELECTED", payload: chat });
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
                        chatRoom.members.some((element) => item._id === element._id)
                    )}
                    badgeContent={chatRoom?.unseen_message && chatRoom?.unseen_message}
                >
                    <AvatarIcon text={chatRoom?.name} imageUrl={chatRoom?.avatar_image} />
                </StyledBadge>
            </ListItemAvatar>
            <ListItemText primary={chatRoom?.name} style={{ marginLeft: "16px" }} />
        </ListItem>
    );
};

export default ChatRoom;
