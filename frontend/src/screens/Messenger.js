import React, { useContext, useEffect, useState } from "react";
import { Avatar, Container, Grid, Paper, Typography } from "@material-ui/core";
import { ChatContext, UIContext } from "../App";
import Messages from "../components/Chat/Messages";

import Friends from "../components/Chat/Friends";
import InputTextArea from "../components/Chat/InputTextArea";
import EmptyMessageArea from "../components/Chat/EmptyMessageArea";
import AvartaText from "../components/UI/AvartaText";

function Messenger() {
    const { uiDispatch, uiState } = useContext(UIContext);
    const { chatState, chatDispatch } = useContext(ChatContext);
    const [textValue, setTextValue] = useState("");
    useEffect(() => {
        uiDispatch({ type: "SET_NAV_MENU", payload: true });
        uiDispatch({ type: "SET_DRAWER", payload: false });

        return () => {
            uiDispatch({ type: "SET_NAV_MENU", payload: false });
            uiDispatch({ type: "SET_DRAWER", payload: false });
            chatDispatch({ type: "SET_SELECTED_FRIEND", payload: null });
        };
    }, [uiDispatch, chatDispatch]);

    return (
        <div
            style={{
                paddingTop: "100px",
                paddingBottom: "40px",
                minHeight: "100vh",
            }}
        >
            <Container>
                <Paper style={{ backgroundColor: uiState.darkMode && "rgb(36,37,38)" }}>
                    <Grid
                        container
                        justifyContent="center"
                        alignItems="flex-start"
                        spacing={2}
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
                                <Friends />
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
                                        display: "flex",
                                        alignItems: "center",
                                        padding: "16px",
                                        width: "100%",
                                        position: "sticky",
                                        top: 0,
                                        backgroundColor: uiState.darkMode && "rgb(36,37,38)",
                                    }}
                                >
                                    {chatState.selectedFriend.avatar_image ? (
                                        <Avatar>
                                            <img
                                                alt="avatar"
                                                src={chatState.selectedFriend.avatar_image}
                                                style={{ width: "100%", height: "100%" }}
                                            />
                                        </Avatar>
                                    ) : (
                                        <AvartaText text={chatState?.selectedFriend?.name} />
                                    )}
                                    <Typography style={{ marginLeft: "16px" }}>
                                        {chatState.selectedFriend.name}
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
                                    <Messages setTextValue={setTextValue} />
                                </Paper>

                                <div
                                    style={{
                                        position: "sticky",
                                        bottom: 0,
                                        left: 0,
                                        width: "100%",
                                    }}
                                >
                                    <InputTextArea
                                        textValue={textValue}
                                        chatRoomId={chatState.selectedFriend._id}
                                    />
                                </div>
                            </Grid>
                        ) : (
                            <EmptyMessageArea />
                        )}
                    </Grid>
                </Paper>
            </Container>
        </div>
    );
}

export default Messenger;
