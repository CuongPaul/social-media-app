import { useHistory } from "react-router-dom";
import React, { useRef, useState, useEffect, useContext } from "react";
import { Grid, List, Paper, Avatar, Typography } from "@material-ui/core";

import callApi from "../api";
import AvatarIcon from "../components/UI/AvatarIcon";
import Message from "../components/Messenger/Message";
import ChatRoom from "../components/Messenger/ChatRoom";
import AddMembers from "../components/Messenger/AddMembers";
import { UIContext, ChatContext, UserContext } from "../App";
import GroupMembers from "../components/Messenger/GroupMembers";
import SearchGroups from "../components/Messenger/SearchGroups";
import SearchFriends from "../components/Messenger/SearchFriends";
import GroupChatCreate from "../components/Messenger/GroupChatCreate";
import MessageTextArea from "../components/Messenger/MessageTextArea";

const Messenger = () => {
    const {
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
    const scrollDiv = useRef(null);
    const [textValue, setTextValue] = useState("");
    const [messageId, setMessageId] = useState("");
    const [isOpenGroupMembers, setIsOpenGroupMembers] = useState(false);

    useEffect(() => {
        (async () => {
            const { data } = await callApi({ url: "/chat-room", method: "GET" });
            chatDispatch({ type: "SET_CHATROOMS", payload: data.rows });
        })();
    }, []);

    useEffect(() => {
        if (scrollDiv?.current) {
            scrollDiv.current.scrollTo(0, 0);
        }
    }, [chatRoomSelected]);

    const handleScroll = (event) => {
        if (event.currentTarget.scrollTop < -450) {
            console.log("Call API get more messages");
        } else {
            console.log(event.currentTarget.scrollTop);
        }
    };

    return (
        <Grid
            style={{
                display: "flex",
                minHeight: "100vh",
                paddingTop: "64px",
                backgroundColor: darkMode && "rgb(36,37,38)",
            }}
        >
            <Grid item md={3}>
                <div
                    style={{
                        display: "flex",
                        padding: "18.5px 0px",
                        justifyContent: "space-evenly",
                        borderBottom: "2px solid rgb(101,103,107)",
                    }}
                >
                    <GroupChatCreate />
                    <SearchFriends />
                    <SearchGroups />
                </div>
                <List style={{ maxHeight: "77vh", overflowX: "auto" }}>
                    {chatRooms?.map((chatRoom) => (
                        <ChatRoom key={chatRoom._id} chatRoom={chatRoom} />
                    ))}
                </List>
            </Grid>
            {chatRoomSelected ? (
                <Grid
                    item
                    md={9}
                    style={{
                        height: "92vh",
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <div
                        style={{
                            flex: 1,
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
                            backgroundColor: "rgb(255,255,255)",
                        }}
                    >
                        <Paper
                            elevation={0}
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
                            style={{
                                top: "0px",
                                width: "100%",
                                display: "flex",
                                padding: "16px",
                                cursor: "pointer",
                                position: "sticky",
                                alignItems: "center",
                                backgroundColor: darkMode && "rgb(36,37,38)",
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
                        {chatRoomSelected.members.length > 2 &&
                            currentUser._id === chatRoomSelected.admin && <AddMembers />}
                    </div>
                    <GroupMembers isOpen={isOpenGroupMembers} setIsOpen={setIsOpenGroupMembers} />
                    <Paper
                        ref={scrollDiv}
                        onScroll={handleScroll}
                        style={{
                            flex: 10,
                            width: "100%",
                            display: "flex",
                            overflow: "hidden scroll",
                            padding: "0px 30px 16px 30px",
                            flexDirection: "column-reverse",
                            scrollbarColor: !darkMode
                                ? "#fff #fff"
                                : " rgb(36,37,38) rgb(36,37,38)",

                            backgroundColor: darkMode && "rgb(36,37,38)",
                        }}
                    >
                        {messages?.map((message) => (
                            <Message
                                key={message._id}
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
