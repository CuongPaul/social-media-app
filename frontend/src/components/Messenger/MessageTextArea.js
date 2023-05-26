import { Send } from "@material-ui/icons";
import React, { useState, useEffect, useContext } from "react";
import { Paper, TextField, IconButton, InputAdornment } from "@material-ui/core";

import Emoji from "../Emoji";
import { UIContext } from "../../App";
import FilesUpload from "../Post/PostDialog/FilesUpload";
import FilePreview from "../Post/PostDialog/FilePreview";
import useSubmitMessage from "../../hooks/useSubmitMessage";

const MessageTextArea = ({ textValue, messageId, chatRoomId }) => {
    console.log({ textValue, messageId, chatRoomId });
    const { uiState } = useContext(UIContext);

    const [text, setText] = useState("");
    const [filePreview, setFilePreview] = useState("");
    const [fileUpload, setFileUpload] = useState(null);

    const handleRemoveFile = () => {
        setFilePreview("");
        setFileUpload(null);
    };

    const { handleSendMessage, handleUpdateMessage } = useSubmitMessage({
        text,
        setText,
        chatRoomId,
        fileUpload,
        handleRemoveFile,
    });

    useEffect(() => {
        if (textValue) setText(textValue);
    }, [textValue]);

    return (
        <Paper
            elevation={0}
            style={{
                width: "100%",
                padding: "16px",
                display: "flex",
                alignItems: "center",
                backgroundColor: uiState.darkMode && "rgb(36,37,38)",
            }}
        >
            <TextField
                value={text}
                placeholder="Enter message"
                onChange={(e) => setText(e.target.value)}
                InputProps={{
                    disableUnderline: true,
                    startAdornment: (
                        <InputAdornment
                            position="start"
                            style={{ top: "-55px", position: "absolute" }}
                        >
                            {filePreview && (
                                <FilePreview
                                    size="80px"
                                    filePreview={filePreview}
                                    handleRemoveFile={handleRemoveFile}
                                />
                            )}
                        </InputAdornment>
                    ),
                    endAdornment: (
                        <InputAdornment position="end">
                            <FilesUpload
                                multipleUpload={false}
                                setFilesUpload={setFileUpload}
                                setFilesPreview={setFilePreview}
                            />
                            <Emoji setText={setText} />
                        </InputAdornment>
                    ),
                }}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                style={{
                    width: "100%",
                    paddingLeft: "16px",
                    borderRadius: "20px",
                    paddingRight: "16px",
                    height: filePreview ? "150px" : "50px",
                    paddingTop: filePreview ? "100px" : "10px",
                    backgroundColor: uiState.darkMode ? "rgb(24,25,26)" : "whitesmoke",
                }}
            />
            <IconButton
                onClick={handleSendMessage}
                style={{
                    marginLeft: "16px",
                    color: "rgb(255,255,255)",
                    backgroundColor: "rgb(10,128,236)",
                }}
            >
                <Send fontSize="small" />
            </IconButton>
        </Paper>
    );
};

export default MessageTextArea;
