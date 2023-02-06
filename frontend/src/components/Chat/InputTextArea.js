import { Send } from "@material-ui/icons";
import EmojiPicker from "emoji-picker-react";
import { faSmile } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext, useState, useRef, useEffect } from "react";
import { IconButton, InputBase, Paper, makeStyles } from "@material-ui/core";

import { UIContext } from "../../App";
import useSendMessage from "../../hooks/useSendMessage";
import FileField from "../Post/PostForm/PostDialog/FileField";
import PreviewImage from "../Post/PostForm/PostDialog/PreviewImage";

const useStyles = makeStyles(() => ({
    inputInput: {
        flexGrow: 1,
        paddingLeft: "4px",
    },
    inputRoot: {
        padding: "16px 8px 16px 8px",
    },
}));

const MessageInputTextArea = ({ textValue }) => {
    const classes = useStyles();
    const { uiState } = useContext(UIContext);
    const [textMessage, setTextMessage] = useState("");

    const fileRef = useRef();
    const [showEmoji, setShowEmoji] = useState(false);
    const [previewImage, setPreviewImage] = useState("");
    const [messageImage, setMessageImage] = useState(null);

    const removeFileImage = () => {
        setPreviewImage("");
        setMessageImage(null);
    };

    const handleImageChange = (e) => {
        setMessageImage(e.target.files[0]);

        const reader = new FileReader();
        reader.readAsDataURL(e.target.files[0]);
        reader.onload = () => {
            setPreviewImage(reader.result);
        };
    };

    const onEmojiClick = (e, emojiObject) => {
        setTextMessage(textMessage + emojiObject.emoji);
    };

    const { handleSubmitMessage } = useSendMessage({
        textMessage,
        setShowEmoji,
        messageImage,
        setTextMessage,
        removeFileImage,
    });

    const handleSendMessage = (e) => {
        e.preventDefault();
        handleSubmitMessage();
    };

    useEffect(() => {
        setTextMessage(textValue);
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
            <InputBase
                multiline
                rowsMax={4}
                value={textMessage}
                classes={{
                    root: classes.inputRoot,
                    input: classes.inputInput,
                }}
                placeholder="Enter Your Text..."
                onChange={(e) => setTextMessage(e.target.value)}
                style={{
                    width: "100%",
                    borderRadius: "20px 20px 20px 20px",
                    backgroundColor: uiState.darkMode ? "rgb(24,25,26)" : "whitesmoke",
                }}
            />
            <FileField fileRef={fileRef} />
            <input
                type="file"
                ref={fileRef}
                capture="user"
                accept="image/*,video/*"
                style={{ display: "none" }}
                onChange={handleImageChange}
            />
            <IconButton onClick={() => setShowEmoji(!showEmoji)}>
                <FontAwesomeIcon icon={faSmile} color="rgb(250,199,94)" />
            </IconButton>
            {showEmoji && <EmojiPicker onEmojiClick={onEmojiClick} className="emoji-container" />}
            <IconButton
                onClick={handleSendMessage}
                style={{
                    backgroundColor: "rgb(1,133,243)",
                    color: "#fff",
                    marginLeft: "16px",
                }}
            >
                <Send fontSize="small" />
            </IconButton>
            {previewImage && (
                <>
                    <PreviewImage previewImage={previewImage} removeFileImage={removeFileImage} />
                </>
            )}
        </Paper>
    );
};

export default MessageInputTextArea;
