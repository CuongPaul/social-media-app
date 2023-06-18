import { Send } from "@material-ui/icons";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, Fragment, useEffect, useContext } from "react";
import { Paper, TextField, IconButton, Typography, InputAdornment } from "@material-ui/core";

import useMessage from "../../hooks/useMessage";
import { UIContext, ChatContext } from "../../App";
import { Emoji, FilePreview, FilesUpload, LoadingIcon } from "../common";

const MessageInput = ({ chatRoomId }) => {
    const {
        uiState: { darkMode },
    } = useContext(UIContext);
    const {
        chatState: { messageSelected, chatRoomSelected },
    } = useContext(ChatContext);

    const [text, setText] = useState("");
    const [filePreview, setFilePreview] = useState("");
    const [fileUpload, setFileUpload] = useState(null);

    const { isLoading, handleCreateMessage, handleUpdateMessage } = useMessage();

    const handleClear = () => {
        setText("");
        handleRemoveFile("");
    };

    const handleRemoveFile = () => {
        setFilePreview("");
        setFileUpload(null);
    };

    useEffect(() => {
        handleClear();
    }, [chatRoomSelected]);

    useEffect(() => {
        if (messageSelected) {
            setFileUpload(null);
            setText(messageSelected.text);

            if (messageSelected.image) {
                setFilePreview(messageSelected.image);
            }
        }
    }, [messageSelected]);

    return (
        <Paper
            elevation={0}
            style={{
                padding: "16px",
                display: "flex",
                alignItems: "center",
                borderRadius: "10px",
                justifyContent: "center",
                backgroundColor: darkMode && "rgb(36,37,38)",
            }}
        >
            {chatRoomSelected?.type_block ? (
                <Typography>
                    {chatRoomSelected?.type_block === "is_blocked"
                        ? "Currently unable to send messages"
                        : "Unblock this user to send message"}
                </Typography>
            ) : (
                <Fragment>
                    <TextField
                        autoFocus
                        value={text}
                        placeholder="Enter message"
                        onChange={(e) => setText(e.target.value)}
                        InputProps={{
                            disableUnderline: true,
                            startAdornment: (
                                <InputAdornment
                                    position="start"
                                    style={{ top: "-45px", position: "absolute" }}
                                >
                                    {filePreview && (
                                        <FilePreview
                                            size="80px"
                                            zoomOutVideo
                                            filePreview={filePreview}
                                            handleRemoveFile={handleRemoveFile}
                                        />
                                    )}
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
                                    {text || fileUpload || filePreview ? (
                                        <FontAwesomeIcon
                                            icon={faTimes}
                                            onClick={handleClear}
                                            style={{ marginRight: "10px", cursor: "pointer" }}
                                        />
                                    ) : null}
                                    <FilesUpload
                                        multipleUpload={false}
                                        setFilesUpload={setFileUpload}
                                        setFilesPreview={setFilePreview}
                                    />
                                    <Emoji setText={setText} />
                                </InputAdornment>
                            ),
                        }}
                        onKeyPress={(e) => {
                            if (e.key === "Enter") {
                                const argument = {
                                    text,
                                    setText,
                                    chatRoomId,
                                    fileUpload,
                                    handleRemoveFile,
                                };

                                if (messageSelected) {
                                    handleUpdateMessage({
                                        ...argument,
                                        currentImage: filePreview,
                                        messageId: messageSelected._id,
                                    });
                                } else {
                                    handleCreateMessage(argument);
                                }
                            }
                        }}
                        style={{
                            width: "100%",
                            paddingLeft: "16px",
                            borderRadius: "20px",
                            paddingRight: "16px",
                            height: filePreview ? "145px" : "50px",
                            paddingTop: filePreview ? "100px" : "10px",
                            backgroundColor: darkMode ? "rgb(24,25,26)" : "whitesmoke",
                        }}
                    />
                    <IconButton
                        onClick={() => {
                            const argument = {
                                text,
                                setText,
                                chatRoomId,
                                fileUpload,
                                handleRemoveFile,
                            };

                            if (messageSelected) {
                                handleUpdateMessage({
                                    ...argument,
                                    currentImage: filePreview,
                                    messageId: messageSelected._id,
                                });
                            } else {
                                handleCreateMessage(argument);
                            }
                        }}
                        style={{
                            marginLeft: "16px",
                            color: "rgb(255,255,255)",
                            backgroundColor: "rgb(10,128,236)",
                        }}
                    >
                        <LoadingIcon text={<Send fontSize="small" />} isLoading={isLoading} />
                    </IconButton>
                </Fragment>
            )}
        </Paper>
    );
};

export default MessageInput;
