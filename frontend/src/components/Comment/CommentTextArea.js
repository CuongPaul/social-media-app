import EmojiPicker from "emoji-picker-react";
import { SendOutlined } from "@material-ui/icons";
import { faSmile } from "@fortawesome/free-solid-svg-icons";
import React, { useContext, useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Grid, Paper, Avatar, TextField, IconButton, LinearProgress } from "@material-ui/core";

import AvartarText from "../UI/AvartarText";
import StyledBadge from "../UI/StyledBadge";
import { UIContext, UserContext } from "../../App";
import useCreateComment from "../../hooks/useCreateComment";
import PreviewFile from "../Post/PostForm/PostDialog/PreviewFile";
import FilesField from "../Post/PostForm/PostDialog/FilesField";

const CommentTextArea = ({ post }) => {
    const { uiState } = useContext(UIContext);
    const { userState } = useContext(UserContext);

    const fileRef = useRef();
    const [error, setError] = useState("");
    const [showEmoji, setShowEmoji] = useState(false);
    const [commentText, setCommentText] = useState("");
    const [previewImage, setPreviewImage] = useState("");
    const [commentImage, setCommentImage] = useState(null);

    const handleImageChange = (e) => {
        const formData = new FormData();
        formData.append("files", e.target.files[0]);
        setCommentImage(formData);
        formData.append("folder", "comment");

        const reader = new FileReader();
        reader.readAsDataURL(e.target.files[0]);
        reader.onload = () => {
            setPreviewImage(reader.result);
        };
    };

    const removeFileImage = () => {
        setPreviewImage("");
        setCommentImage(null);
    };

    const handleCommentChange = (e) => {
        setError("");
        setCommentText(e.target.value);
    };

    const onEmojiClick = (e, emojiObject) => {
        setError("");
        setCommentText(commentText + emojiObject.emoji);
    };

    const { handleSubmitComment, loading } = useCreateComment({
        setError,
        commentText,
        setShowEmoji,
        commentImage,
        setCommentText,
        setCommentImage,
        removeFileImage,
        post_id: post._id,
    });

    return userState.currentUser ? (
        <>
            <Grid
                container
                spacing={1}
                justifyContent="flex-start"
                style={{
                    marginTop: "8px",
                    marginBottom: "8px",
                }}
            >
                <Grid item>
                    <StyledBadge isActive={userState.currentUser.is_active}>
                        {userState.currentUser.avatar_image ? (
                            <Avatar>
                                <img
                                    alt={userState.currentUser.name}
                                    src={userState.currentUser.avatar_image}
                                    style={{ width: "100%", height: "100%" }}
                                />
                            </Avatar>
                        ) : (
                            <AvartarText
                                text={userState?.currentUser?.name}
                                backgroundColor="tomato"
                            />
                        )}
                    </StyledBadge>
                </Grid>
                <Grid item md={8} sm={8} xs={8}>
                    <TextField
                        multiline
                        rowsMax={4}
                        helperText={error}
                        value={commentText}
                        error={error ? true : false}
                        onChange={handleCommentChange}
                        placeholder="Write a comments..."
                        style={{
                            width: "100%",
                            border: "none",
                            padding: "8px 16px",
                            borderRadius: "20px",
                            background: uiState.darkMode ? "rgb(24,25,26)" : "rgb(240,242,245)",
                        }}
                    />
                    {/* <FilesField fileRef={fileRef} /> */}
                    <FilesField
                        multipleUpload={false}
                        setFilesUpload={setCommentImage}
                        setFilesPreview={setPreviewImage}
                    />
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
                    {showEmoji && (
                        <EmojiPicker onEmojiClick={onEmojiClick} className="emoji-container" />
                    )}
                </Grid>
                <Grid item ms={2} sm={2} xs={2}>
                    <IconButton onClick={handleSubmitComment}>
                        <SendOutlined />
                    </IconButton>
                </Grid>
            </Grid>

            {loading ? (
                <Paper
                    elevation={0}
                    style={{
                        display: "flex",
                        padding: "16px",
                        alignItems: "center",
                        flexDirection: "column",
                        justifyContent: "center",
                    }}
                >
                    <LinearProgress color="primary" style={{ width: "100%" }} />
                </Paper>
            ) : null}

            {previewImage && (
                <>
                    <PreviewFile filePreview={previewImage} handleRemoveFile={removeFileImage} />
                </>
            )}
        </>
    ) : null;
};

export default CommentTextArea;
