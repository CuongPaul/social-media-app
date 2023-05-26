import React, { useContext, useState } from "react";
import { Avatar, Container, Grid, Paper, Typography } from "@material-ui/core";

import { ChatContext, UIContext } from "../App";
import ChatRooms from "../components/Messenger/ChatRooms";
import Message from "../components/Messenger/Message";
import AvatarIcon from "../components/UI/AvatarIcon";
import MessageTextArea from "../components/Messenger/MessageTextArea";

const Messenger = () => {
    const { uiState } = useContext(UIContext);
    const { chatState } = useContext(ChatContext);

    const [textValue, setTextValue] = useState("");
    const [messageId, setMessageId] = useState("");

    return (
        <Container style={{ minHeight: "100vh", paddingTop: "100px", paddingBottom: "40px" }}>
            <Paper style={{ backgroundColor: uiState.darkMode && "rgb(36,37,38)" }}>
                <Grid
                    container
                    spacing={2}
                    justifyContent="center"
                    alignItems="flex-start"
                    style={{ padding: "16px" }}
                >
                    <Grid
                        item
                        md={4}
                        xs={12}
                        sm={12}
                        style={{
                            height: "80vh",
                            overflowY: "scroll",
                            overflowX: "hidden",
                            scrollbarColor: uiState.darkMode
                                ? " rgb(36,37,38) rgb(24,25,26)"
                                : "#fff rgb(240,242,245)",
                        }}
                    >
                        <Paper elevation={0}>
                            <ChatRooms />
                        </Paper>
                    </Grid>
                    {chatState.selectedFriend ? (
                        <Grid
                            item
                            md={8}
                            xs={12}
                            sm={12}
                            style={{
                                height: "80vh",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between",
                                alignItems: "center",
                                margin: "auto",
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
                                    text={chatState?.selectedFriend?.name}
                                    imageUrl={chatState?.selectedFriend?.avatar_image}
                                />
                                <Typography style={{ marginLeft: "16px" }}>
                                    {chatState?.selectedFriend?.name}
                                </Typography>
                            </Paper>

                            <Paper
                                elevation={0}
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
                                <Grid container>
                                    {chatState?.messages?.map((message) => (
                                        <Message
                                            message={message}
                                            setTextValue={setTextValue}
                                            setTextId={setMessageId}
                                        />
                                    ))}
                                </Grid>
                            </Paper>
                            <MessageTextArea
                                textValue={textValue}
                                messageId={messageId}
                                chatRoomId={chatState?.selectedFriend?._id}
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
            </Paper>
        </Container>
    );
};

export default Messenger;
