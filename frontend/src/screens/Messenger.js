import { useHistory } from "react-router-dom";
import React, { useRef, useState, useEffect, useContext } from "react";
import { Grid, List, Paper, Avatar, Typography } from "@material-ui/core";

import callApi from "../api";
import AvatarIcon from "../components/UI/AvatarIcon";
import Message from "../components/Messenger/Message";
import ChatRoom from "../components/Messenger/ChatRoom";
import { UIContext, ChatContext, UserContext } from "../App";
import SearchUsers from "../components/Messenger/SearchUsers";
import GroupMembers from "../components/Messenger/GroupMembers";
import SearchGroups from "../components/Messenger/SearchGroups";
import GroupChatCreate from "../components/Messenger/GroupChatCreate";
import MessageTextArea from "../components/Messenger/MessageTextArea";

const Messenger = () => {
    const {
        uiDispatch,
        uiState: { darkMode },
    } = useContext(UIContext);
    const {
        userState: { currentUser },
    } = useContext(UserContext);
    const {
        chatDispatch,
        chatState: { messages, chatRooms, chatRoomSelected },
    } = useContext(ChatContext);

    const history = useHistory();
    const scrollMessage = useRef(null);
    const scrollChatRoom = useRef(null);
    const [messagePage, setMessagePage] = useState(1);
    const [chatRoomPage, setChatRoomPage] = useState(1);
    const [isOpenGroupMembers, setIsOpenGroupMembers] = useState(false);

    const handleScrollChatRoom = async (event) => {
        const bottom =
            event.target.scrollHeight - event.target.scrollTop === event.target.clientHeight + 0.5;

        if (bottom) {
            try {
                const nextPage = chatRoomPage + 1;

                const { data } = await callApi({
                    method: "GET",
                    url: `/chat-room`,
                    query: { page: nextPage },
                });

                setChatRoomPage(chatRoomPage + 1);
                chatDispatch({ payload: data.rows, type: "ADD_CHATROOMS" });
            } catch (err) {
                uiDispatch({
                    type: "SET_ALERT_MESSAGE",
                    payload: { display: true, color: "error", text: err.message },
                });
            }
        }
    };

    const handleScrollMessage = async (event) => {
        const top =
            event.target.scrollHeight + event.target.scrollTop === event.target.clientHeight + 1;

        if (top) {
            try {
                const nextPage = messagePage + 1;

                const { data } = await callApi({
                    method: "GET",
                    query: { page: nextPage },
                    url: `/message/chat-room/${chatRoomSelected._id}`,
                });

                setMessagePage(messagePage + 1);
                chatDispatch({ payload: data.rows, type: "ADD_MESSAGES" });
            } catch (err) {
                uiDispatch({
                    type: "SET_ALERT_MESSAGE",
                    payload: { display: true, color: "error", text: err.message },
                });
            }
        }
    };

    useEffect(() => {
        if (scrollMessage.current) {
            scrollMessage.current.scrollTo(0, 0);
        }
    }, [chatRoomSelected?._id]);

    useEffect(() => {
        if (messagePage === 1 && scrollMessage.current) {
            scrollMessage.current.scrollTo(0, 0);
        }
    }, [messages?.length]);

    return (
        <Grid
            style={{
                display: "flex",
                height: "100vh",
                paddingTop: "64px",
                justifyContent: "space-evenly",
                backgroundColor: darkMode && "rgb(36,37,38)",
            }}
        >
            <Grid item md={3} style={{ margin: "20px", display: "flex", flexDirection: "column" }}>
                <div
                    style={{
                        display: "flex",
                        padding: "20px 0px",
                        borderRadius: "10px",
                        justifyContent: "space-evenly",
                        backgroundColor: "rgb(255,255,255)",
                    }}
                >
                    <GroupChatCreate />
                    <SearchGroups />
                    <SearchUsers />
                </div>
                <List
                    ref={scrollChatRoom}
                    onScroll={handleScrollChatRoom}
                    style={{
                        padding: "10px",
                        marginTop: "10px",
                        borderRadius: "10px",
                        overflow: "hidden scroll",
                        backgroundColor: "rgb(255,255,255)",
                    }}
                >
                    {chatRooms?.map((chatRoom) => (
                        <ChatRoom key={chatRoom._id} chatRoom={chatRoom} />
                    ))}
                </List>
            </Grid>
            {chatRoomSelected ? (
                <Grid
                    item
                    md={9}
                    style={{ margin: "20px", display: "flex", flexDirection: "column" }}
                >
                    <Paper
                        elevation={0}
                        style={{
                            display: "flex",
                            padding: "16px",
                            alignItems: "center",
                            borderRadius: "10px",
                            justifyContent: "space-between",
                            backgroundColor: darkMode && "rgb(36,37,38)",
                        }}
                    >
                        <div
                            onClick={() => {
                                if (chatRoomSelected.members.length === 2) {
                                    const friend = chatRoomSelected.members.find(
                                        (item) => item._id !== currentUser._id
                                    );
                                    history.push(`/profile/${friend._id}`);
                                } else {
                                    setIsOpenGroupMembers(true);
                                }
                            }}
                            style={{ display: "flex", cursor: "pointer", alignItems: "center" }}
                        >
                            <AvatarIcon
                                text={chatRoomSelected.name}
                                imageUrl={chatRoomSelected.avatar_image}
                            />
                            <Typography style={{ marginLeft: "16px" }}>
                                {chatRoomSelected.name}
                            </Typography>
                        </div>
                    </Paper>
                    <GroupMembers isOpen={isOpenGroupMembers} setIsOpen={setIsOpenGroupMembers} />
                    <Paper
                        ref={scrollMessage}
                        onScroll={handleScrollMessage}
                        style={{
                            flex: 1,
                            display: "flex",
                            margin: "10px 0px",
                            borderRadius: "10px",
                            padding: "20px 30px ",
                            overflow: "hidden scroll",
                            flexDirection: "column-reverse",
                            scrollbarColor: !darkMode
                                ? "#fff #fff"
                                : " rgb(36,37,38) rgb(36,37,38)",

                            backgroundColor: darkMode && "rgb(36,37,38)",
                        }}
                    >
                        {messages?.map((message) => (
                            <Message key={message._id} message={message} />
                        ))}
                    </Paper>
                    <MessageTextArea chatRoomId={chatRoomSelected._id} />
                </Grid>
            ) : (
                <Grid
                    item
                    md={8}
                    style={{
                        margin: "20px",
                        display: "flex",
                        alignItems: "center",
                        borderRadius: "10px",
                        flexDirection: "column",
                        justifyContent: "center",
                        backgroundColor: "rgb(255,255,255)",
                    }}
                >
                    <Avatar
                        variant="square"
                        style={{
                            width: "120px",
                            height: "120px",
                            background: "transparent",
                        }}
                    >
                        <img alt="" src={require("../assets/select-friends.svg")} />
                    </Avatar>
                    <Typography style={{ fontWeight: 800, marginTop: "16px" }}>
                        Select friends from friend lists to start chat
                    </Typography>
                </Grid>
            )}
        </Grid>
    );
};

export default Messenger;
