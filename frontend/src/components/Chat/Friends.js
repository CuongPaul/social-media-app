import {
    List,
    Avatar,
    ListItem,
    Typography,
    ListItemText,
    ListSubheader,
    ListItemAvatar,
} from "@material-ui/core";
import React, { useContext, useEffect, useState } from "react";

import AvartarText from "../UI/AvartarText";
import { getMessages } from "../../services/MessageService";
import { UserContext, ChatContext, UIContext } from "../../App";
import callApi from "../../api";

const Friends = () => {
    const { userState } = useContext(UserContext);
    const { chatDispatch } = useContext(ChatContext);
    const { uiState, uiDispatch } = useContext(UIContext);

    const [chatRooms, setChatRooms] = useState([]);

    useEffect(() => {
        (async () => {
            const { data } = await callApi({ url: "/chat-room", method: "GET" });
            setChatRooms(data.rows);
        })();
    }, []);

    const handleClickChat = async (chat) => {
        uiDispatch({ type: "SET_DRAWER", payload: false });
        chatDispatch({ type: "SET_SELECTED_FRIEND", payload: chat });
        const { data } = await callApi({ url: `/message/chat-room/${chat._id}`, method: "GET" });
        chatDispatch({ type: "SET_MESSAGES", payload: data.rows });
    };

    const handleClickFriend = async (friend) => {
        uiDispatch({ type: "SET_DRAWER", payload: false });
        chatDispatch({ type: "SET_SELECTED_FRIEND", payload: friend });
        const { message } = await callApi({
            url: `/chat-room/two-people`,
            method: "POST",
            data: { reciver: friend._id },
        });
        // getMessages(friend._id)
        //     .then((res) => {
        //         if (res.data) {
        //             chatDispatch({ type: "SET_MESSAGES", payload: res.data.data });
        //         }
        //     })
        //     .catch((err) => console.log(err));
    };

    return (
        <List
            style={{ backgroundColor: uiState.darkMode && "rgb(36,37,38)" }}
            subheader={<ListSubheader component="div">Your Friends</ListSubheader>}
        >
            {chatRooms && chatRooms.length ? (
                chatRooms.map((friend) => {
                    return (
                        <ListItem key={friend._id} button onClick={() => handleClickChat(friend)}>
                            <ListItemAvatar>
                                {friend.avatar_image ? (
                                    <Avatar alt={friend.name} src={friend.avatar_image} />
                                ) : friend.members.length === 2 ? (
                                    <Avatar
                                        alt={
                                            friend.members.find(
                                                (item) => item._id !== userState.currentUser._id
                                            ).name
                                        }
                                        src={
                                            friend.members.find(
                                                (item) => item._id !== userState.currentUser._id
                                            ).avatar_image
                                        }
                                    />
                                ) : (
                                    <AvartarText
                                        text={friend?.name}
                                        backgroundColor={friend.is_active ? "seagreen" : "tomato"}
                                    />
                                )}
                            </ListItemAvatar>
                            <ListItemText
                                primary={
                                    friend.members.length === 2
                                        ? friend.members.find(
                                              (item) => item._id !== userState.currentUser._id
                                          ).name
                                        : friend.name
                                }
                            />
                        </ListItem>
                    );
                })
            ) : (
                <Typography>No chats</Typography>
            )}
            <hr />
            {userState?.currentUser?.friends && userState?.currentUser?.friends?.length ? (
                userState.currentUser.friends.map((friend) => {
                    return (
                        <ListItem key={friend._id} button onClick={() => handleClickFriend(friend)}>
                            <ListItemAvatar>
                                {friend.avatar_image ? (
                                    <Avatar alt={friend.name} src={friend.avatar_image} />
                                ) : (
                                    <AvartarText
                                        text={friend?.name}
                                        backgroundColor={friend.is_active ? "seagreen" : "tomato"}
                                    />
                                )}
                            </ListItemAvatar>
                            <ListItemText primary={friend.name} />
                        </ListItem>
                    );
                })
            ) : (
                <Typography>No friends</Typography>
            )}
        </List>
    );
};

export default Friends;
