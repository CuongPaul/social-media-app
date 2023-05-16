import { Send } from "@material-ui/icons";
import EmojiPicker from "emoji-picker-react";
import { faSmile } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext, useState, useEffect } from "react";
import { IconButton, InputBase, Paper, makeStyles } from "@material-ui/core";

import { UIContext } from "../../App";
import useSendMessage from "../../hooks/useSendMessage";
import FilesUpload from "../Post/PostForm/PostDialog/FilesUpload";
import PreviewFile from "../Post/PostForm/PostDialog/PreviewFile";

const useStyles = makeStyles(() => ({
    inputInput: {
        flexGrow: 1,
        paddingLeft: "4px",
    },
    inputRoot: {
        padding: "16px 8px 16px 8px",
    },
}));

const MessageInputTextArea = ({ textValue, chatRoomId }) => {
    const classes = useStyles();
    const { uiState } = useContext(UIContext);

    const [textMessage, setTextMessage] = useState("");
    const [showEmoji, setShowEmoji] = useState(false);
    const [previewImage, setPreviewImage] = useState("");
    const [messageImage, setMessageImage] = useState(null);

    const removeFileImage = () => {
        setPreviewImage("");
        setMessageImage(null);
    };

    // const handleImageChange = (e) => {
    //     setMessageImage(e.target.files[0]);

    //     const reader = new FileReader();
    //     reader.readAsDataURL(e.target.files[0]);
    //     reader.onload = () => {
    //         setPreviewImage(reader.result);
    //     };
    // };

    const onEmojiClick = (e, emojiObject) => {
        setTextMessage(textMessage + emojiObject.emoji);
    };

    const { handleSubmitMessage } = useSendMessage({
        textMessage,
        setShowEmoji,
        messageImage,
        setTextMessage,
        removeFileImage,
        chatRoomId,
    });

    useEffect(() => {
        if (textValue) {
            setTextMessage(textValue);
        }
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
                maxRows={4}
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
            {/* <FilesUpload fileRef={fileRef} /> */}

            <FilesUpload
                multipleUpload={false}
                setFilesUpload={setMessageImage}
                setFilesPreview={setPreviewImage}
            />
            {/* <input
                type="file"
                ref={fileRef}
                capture="user"
                accept="image/*,video/*"
                style={{ display: "none" }}
                onChange={handleImageChange}
            /> */}
            <IconButton onClick={() => setShowEmoji(!showEmoji)}>
                <FontAwesomeIcon icon={faSmile} color="rgb(250,199,94)" />
            </IconButton>
            {showEmoji && <EmojiPicker onEmojiClick={onEmojiClick} className="emoji-container" />}
            <IconButton
                onClick={handleSubmitMessage}
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
                    <PreviewFile filePreview={previewImage} handleRemoveFile={removeFileImage} />
                </>
            )}
        </Paper>
    );
};

export default MessageInputTextArea;
