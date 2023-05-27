import React, { useContext, useState, useEffect } from "react";
import { List, Avatar, Grid, Paper, Typography } from "@material-ui/core";

import callApi from "../api";
import { ChatContext, UIContext } from "../App";
import GroupChatCreate from "../components/Messenger/GroupChatCreate";
import SearchFriends from "../components/Messenger/SearchFriends";
import SearchGroups from "../components/Messenger/SearchGroups";
import ChatRoom from "../components/Messenger/ChatRoom";
import Message from "../components/Messenger/Message";
import AvatarIcon from "../components/UI/AvatarIcon";
import MessageTextArea from "../components/Messenger/MessageTextArea";

const Messenger = () => {
    const { uiState } = useContext(UIContext);
    const { chatDispatch, chatState } = useContext(ChatContext);

    const [textValue, setTextValue] = useState("");
    const [messageId, setMessageId] = useState("");
    const [chatRoomSelected, setChatRoomSelected] = useState(null);

    useEffect(() => {
        (async () => {
            const { data } = await callApi({ url: "/chat-room", method: "GET" });
            chatDispatch({ type: "SET_CHATROOMS", payload: data.rows });
        })();
    }, []);

    return (
        <Grid
            container
            style={{
                minHeight: "100vh",
                paddingTop: "64px",
                backgroundColor: uiState.darkMode && "rgb(36,37,38)",
            }}
        >
            <Grid item md={3} style={{ overflow: "hidden scroll" }}>
                <GroupChatCreate />
                <SearchFriends />
                <SearchGroups />
                <List>
                    {chatState.chatRooms?.map((chatRoom) => (
                        <ChatRoom
                            key={chatRoom._id}
                            chatRoom={chatRoom}
                            setChatRoomSelected={setChatRoomSelected}
                        />
                    ))}
                </List>
            </Grid>
            {chatRoomSelected ? (
                <Grid
                    item
                    md={9}
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <Paper
                        elevation={0}
                        style={{
                            top: "0px",
                            width: "100%",
                            display: "flex",
                            padding: "16px",
                            position: "sticky",
                            alignItems: "center",
                            backgroundColor: uiState.darkMode && "rgb(36,37,38)",
                        }}
                    >
                        <AvatarIcon
                            text={chatRoomSelected.name}
                            imageUrl={chatRoomSelected.avatar_image}
                        />
                        <Typography style={{ marginLeft: "16px" }}>
                            {chatRoomSelected.name}
                        </Typography>
                    </Paper>

                    <Paper
                        style={{
                            padding: "16px",
                            width: "100%",
                            height: "60vh",
                            overflowY: "scroll",
                            overflowX: "hidden",
                            scrollbarColor: !uiState.darkMode
                                ? "#fff #fff"
                                : " rgb(36,37,38) rgb(36,37,38)",

                            backgroundColor: uiState.darkMode && "rgb(36,37,38)",
                        }}
                    >
                        {chatState?.messages?.map((message) => (
                            <Message
                                message={message}
                                setTextId={setMessageId}
                                setTextValue={setTextValue}
                            />
                        ))}
                    </Paper>
                    <MessageTextArea
                        textValue={textValue}
                        messageId={messageId}
                        chatRoomId={chatRoomSelected._id}
                    />
                </Grid>
            ) : (
                <Grid
                    item
                    md={8}
                    style={{
                        margin: "auto",
                        display: "flex",
                        alignItems: "center",
                        flexDirection: "column",
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
