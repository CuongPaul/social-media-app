import React, { useRef, useState, useEffect, useContext } from "react";
import { Grid, List, Paper, Avatar, Typography } from "@material-ui/core";

import callApi from "../api";
import { ChatContext, UIContext } from "../App";
import AvatarIcon from "../components/UI/AvatarIcon";
import Message from "../components/Messenger/Message";
import ChatRoom from "../components/Messenger/ChatRoom";
import SearchGroups from "../components/Messenger/SearchGroups";
import SearchFriends from "../components/Messenger/SearchFriends";
import GroupChatCreate from "../components/Messenger/GroupChatCreate";
import MessageTextArea from "../components/Messenger/MessageTextArea";

const Messenger = () => {
    const { uiState } = useContext(UIContext);
    const { chatDispatch, chatState } = useContext(ChatContext);

    const scrollDiv = useRef(null);
    const [textValue, setTextValue] = useState("");
    const [messageId, setMessageId] = useState("");
    const [chatRoomSelected, setChatRoomSelected] = useState(null);

    useEffect(() => {
        (async () => {
            const { data } = await callApi({ url: "/chat-room", method: "GET" });
            chatDispatch({ type: "SET_CHATROOMS", payload: data.rows });
        })();
    }, []);

    useEffect(() => {
        console.log(scrollDiv.current);
        if (scrollDiv.current) {
            scrollDiv.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [chatState.messages]);

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
                        alignItems: "center",
                        flexDirection: "column",
                        justifyContent: "space-between",
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
                            width: "100%",
                            height: "70vh",
                            padding: "16px",
                            overflowX: "hidden",
                            overflowY: "scroll",
                            scrollbarColor: !uiState.darkMode
                                ? "#fff #fff"
                                : " rgb(36,37,38) rgb(36,37,38)",

                            backgroundColor: uiState.darkMode && "rgb(36,37,38)",
                        }}
                    >
                        {chatState?.messages?.map((message, index) => (
                            <Message
                                message={message}
                                setTextId={setMessageId}
                                setTextValue={setTextValue}
                            />
                        ))}
                        <div ref={scrollDiv}>Ta Cuong</div>
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
