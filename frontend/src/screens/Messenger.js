import { useHistory } from "react-router-dom";
import React, { useRef, useState, useEffect, useContext } from "react";
import { Grid, List, Paper, Avatar, Typography } from "@material-ui/core";

import callApi from "../api";
import Message from "../components/Messenger/Message";
import AvatarIcon from "../components/common/AvatarIcon";
import ChatRooms from "../components/Messenger/ChatRooms";
import { UIContext, ChatContext, UserContext } from "../App";
import SearchUsers from "../components/Messenger/SearchUsers";
import MessageInput from "../components/Messenger/MessageInput";
import CreateChatRoom from "../components/Messenger/CreateChatRoom";
import SearchChatRooms from "../components/Messenger/SearchChatRooms";
import ChatRoomMembers from "../components/Messenger/ChatRoomMembers";

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
    const messageScroll = useRef(null);
    const chatRoomScroll = useRef(null);
    const [messagePage, setMessagePage] = useState(1);
    const [chatRoomPage, setChatRoomPage] = useState(1);
    const [isOpenGroupMembers, setIsOpenGroupMembers] = useState(false);

    const handleScrollMessage = async (e) => {
        const { scrollTop, clientHeight, scrollHeight } = e.target;

        const isTop = scrollHeight + scrollTop === clientHeight + 1;

        if (isTop) {
            try {
                const { data } = await callApi({
                    method: "GET",
                    query: { page: messagePage + 1 },
                    url: `/message/chat-room/${chatRoomSelected._id}`,
                });
                chatDispatch({ payload: data.rows, type: "ADD_MESSAGES" });

                setMessagePage(messagePage + 1);
            } catch (err) {
                uiDispatch({
                    type: "SET_ALERT_MESSAGE",
                    payload: { display: true, color: "error", text: err.message },
                });
            }
        }
    };

    const handleScrollChatRoom = async (e) => {
        const { scrollTop, clientHeight, scrollHeight } = e.target;

        const isBottom = scrollHeight - scrollTop === clientHeight + 0.5;

        if (isBottom) {
            try {
                const { data } = await callApi({
                    method: "GET",
                    url: `/chat-room`,
                    query: { page: chatRoomPage + 1 },
                });
                chatDispatch({ payload: data.rows, type: "ADD_CHATROOMS" });

                setChatRoomPage(chatRoomPage + 1);
            } catch (err) {
                uiDispatch({
                    type: "SET_ALERT_MESSAGE",
                    payload: { display: true, color: "error", text: err.message },
                });
            }
        }
    };

    useEffect(() => {
        if (messageScroll.current) {
            messageScroll.current.scrollTo(0, 0);
        }
    }, [chatRoomSelected?._id]);

    useEffect(() => {
        if (messagePage === 1 && messageScroll.current) {
            messageScroll.current.scrollTo(0, 0);
        }
    }, [messages?.length]);

    return (
        <Grid
            style={{
                display: "flex",
                height: "100vh",
                paddingTop: "64px",
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
                    <CreateChatRoom />
                    <SearchChatRooms />
                    <SearchUsers />
                </div>
                <List
                    ref={chatRoomScroll}
                    onScroll={handleScrollChatRoom}
                    style={{
                        flex: 1,
                        padding: "10px",
                        marginTop: "10px",
                        borderRadius: "10px",
                        overflow: "hidden auto",
                        backgroundColor: "rgb(255,255,255)",
                    }}
                >
                    {chatRooms?.map((chatRoom) => (
                        <ChatRooms
                            key={chatRoom._id}
                            chatRoom={chatRoom}
                            setIsOpenGroupMembers={setIsOpenGroupMembers}
                        />
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
                    <ChatRoomMembers
                        isOpen={isOpenGroupMembers}
                        setIsOpen={setIsOpenGroupMembers}
                    />
                    <Paper
                        ref={messageScroll}
                        onScroll={handleScrollMessage}
                        style={{
                            flex: 1,
                            display: "flex",
                            margin: "10px 0px",
                            borderRadius: "10px",
                            padding: "20px 30px ",
                            overflow: "hidden auto",
                            flexDirection: "column-reverse",
                            backgroundColor: darkMode && "rgb(36,37,38)",
                        }}
                    >
                        {messages?.map((message) => (
                            <Message key={message._id} message={message} />
                        ))}
                    </Paper>
                    <MessageInput chatRoomId={chatRoomSelected._id} />
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
                            backgroundColor: "transparent",
                        }}
                    >
                        <img alt={""} src={require("../assets/select-friends.svg")} />
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
