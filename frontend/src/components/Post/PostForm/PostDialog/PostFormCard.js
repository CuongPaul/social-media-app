import {
    Grid,
    Button,
    Dialog,
    Avatar,
    Select,
    TextField,
    IconButton,
    InputLabel,
    Typography,
    FormControl,
    DialogActions,
    DialogContent,
    CircularProgress,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { Close } from "@material-ui/icons";
import EmojiPicker from "emoji-picker-react";
import React, { lazy, Fragment, useState, useEffect, useContext } from "react";

import FileField from "./FileField";
import TagUserCard from "./TagUserCard";
import DialogHeader from "./DialogHeader";
import PreviewImage from "./PreviewImage";
import FeelingsCard from "./FeelingsCard";
import LocationField from "./LocationField";
import DialogLoading from "../../../UI/DialogLoading";
import useCreatePost from "../../../../hooks/useCreatePost";
import { updatePost } from "../../../../services/PostServices";
import { UIContext, UserContext, PostContext } from "../../../../App";

const CameraField = lazy(() => import("./CameraField"));

const PostFormDialog = () => {
    const { postDispatch } = useContext(PostContext);
    const { uiState, uiDispatch } = useContext(UIContext);

    const [blob, setBlob] = useState(null);
    const [postImage, setPostImage] = useState(null);
    const [showEmoji, setShowEmoji] = useState(false);
    const [previewImage, setPreviewImage] = useState([]);
    const [isImageCaptured, setIsImageCaptured] = useState(false);
    const [postData, setPostData] = useState({ privacy: "public", content: "" });

    const [body, setBody] = useState({
        tag_friends: [],
        feelings: "",
        location: "",
    });

    const { userState } = useContext(UserContext);

    const handleContentChange = (e) => {
        setPostData({
            ...postData,
            content: e.target.value,
        });
    };
    const handleImageChange = (e) => {
        const { files } = e.target;

        setPostImage(files);

        for (const file of files) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                setBlob(null);
                setIsImageCaptured(false);
                setPreviewImage((pre) => [...pre, reader.result]);
            };
        }
    };

    const onEmojiClick = (e, emojiObject) => {
        setPostData({
            ...postData,
            content: postData.content + emojiObject.emoji,
        });
    };

    const handleCloseDialog = () => {
        uiDispatch({ type: "EDIT_POST", payload: null });
        uiDispatch({ type: "SET_POST_MODEL", payload: false });
    };

    const removeFileImage = () => {
        setPreviewImage("");
        setPostImage(null);
    };

    const removeCameraImage = () => {
        setBlob(null);
        setIsImageCaptured(false);
    };

    const showCapturedImage = () => {
        if (blob) {
            return (
                <div>
                    <Alert>
                        <b>Image Size ({Math.round(blob.size / 1024)} Kb)</b>
                    </Alert>
                    <img
                        src={URL.createObjectURL(blob)}
                        style={{ width: "100%", height: "100%" }}
                        alt=""
                    />
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                            marginTop: "16px",
                            marginBottom: "16px",
                        }}
                    >
                        <IconButton onClick={removeCameraImage} size="medium">
                            <Avatar style={{ background: "tomato", color: "white" }}>
                                <Close />
                            </Avatar>
                        </IconButton>
                    </div>
                </div>
            );
        }
    };

    useEffect(() => {
        setPostData({
            privacy: uiState.post ? uiState.post.privacy : "public",
            content: uiState.post ? uiState.post.content : "",
        });
    }, [uiState.post]);

    const { handleSubmitPost, loading } = useCreatePost({
        blob,
        body,
        postData,
        postImage,
        isImageCaptured,
    });

    const handleUpdatePost = (postId) => {
        updatePost({ ...postData, id: postId }).then((res) => {
            if (res.data.message === "success") {
                uiDispatch({ type: "SET_POST_MODEL", payload: false });
                postDispatch({ type: "EDIT_POST", payload: { ...postData, id: postId } });
            }
        });
    };

    return (
        <Fragment>
            <Typography
                style={{
                    color: !uiState.darkMode ? "grey" : null,
                    padding: "8px",
                    background: !uiState.darkMode ? "rgb(240,242,245)" : null,
                    borderRadius: "20px",

                    cursor: "pointer",
                }}
                onClick={() => uiDispatch({ type: "SET_POST_MODEL", payload: true })}
            >
                What`s in your mind, {userState.currentUser.name} ?
            </Typography>
            {loading ? (
                <DialogLoading loading={loading} text="Uploading Post..." />
            ) : (
                <Dialog
                    fullWidth
                    scroll="body"
                    maxWidth="sm"
                    disableEscapeKeyDown
                    open={uiState.postModel}
                    style={{ width: "100%" }}
                    onClose={() => uiDispatch({ type: "SET_POST_MODEL", payload: false })}
                >
                    <DialogHeader body={body} handleCloseDialog={handleCloseDialog} />
                    <DialogContent>
                        <FormControl style={{ marginBottom: "16px" }}>
                            <InputLabel>Privacy</InputLabel>
                            <Select
                                native
                                value={postData.privacy}
                                onChange={(e) =>
                                    setPostData({ ...postData, privacy: e.target.value })
                                }
                            >
                                <option value={"only_me"}>Only me</option>
                                <option value={"public"}>Public</option>
                            </Select>
                        </FormControl>

                        <TextField
                            placeholder={`Whats in your mind ${userState.currentUser.name}`}
                            multiline
                            minRows={8}
                            value={postData.content}
                            onChange={handleContentChange}
                            style={{
                                background: !uiState.darkMode ? "#fff" : null,
                                border: "none",
                                width: "100%",
                            }}
                        />

                        <Grid
                            container
                            justifyContent="center"
                            style={{ marginTop: "16px", marginBottom: "16px" }}
                        >
                            <Button
                                onClick={() => setShowEmoji(!showEmoji)}
                                variant="contained"
                                color="secondary"
                                size="small"
                            >
                                {showEmoji ? "Hide Emoji Panel" : "Show Emoji Panel"}
                            </Button>
                        </Grid>
                        <Grid
                            container
                            alignItems="center"
                            justifyContent="center"
                            style={{ marginTop: "16px", marginBottom: "16px" }}
                        >
                            <Grid item xs={12} sm={6} md={6}>
                                {showEmoji && (
                                    <EmojiPicker
                                        onEmojiClick={onEmojiClick}
                                        className="emoji-container"
                                    />
                                )}
                            </Grid>
                        </Grid>

                        <Grid container alignItems="center" justifyContent="center">
                            <Grid item xs={12} sm={6} md={6}>
                                <FileField handleImageChange={handleImageChange} />
                                <CameraField
                                    setBlob={setBlob}
                                    isImageCaptured={isImageCaptured}
                                    setIsImageCaptured={setIsImageCaptured}
                                    setPreviewImage={setPreviewImage}
                                    setPostImage={setPostImage}
                                />
                                <LocationField body={body} setBody={setBody} />
                                <FeelingsCard body={body} setBody={setBody} />
                                <TagUserCard body={body} setBody={setBody} />
                            </Grid>
                        </Grid>

                        {previewImage.length
                            ? previewImage.map((item) => (
                                  // <div>
                                  // <Alert>
                                  //     <b>Image Size ({Math.round(postImage.size / 1024)} Kb)</b>
                                  // </Alert>
                                  <PreviewImage
                                      previewImage={item}
                                      removeFileImage={removeFileImage}
                                  />
                                  // </div>
                              ))
                            : null}

                        {showCapturedImage()}
                    </DialogContent>
                    <DialogActions>
                        <Button
                            disabled={loading}
                            onClick={(e) => {
                                if (uiState.post) {
                                    return handleUpdatePost(uiState.post.id);
                                }

                                return handleSubmitPost(e);
                            }}
                            variant="contained"
                            color="primary"
                            style={{ width: "100%" }}
                        >
                            {loading ? (
                                <CircularProgress
                                    variant="indeterminate"
                                    size={25}
                                    style={{ color: "#fff" }}
                                />
                            ) : uiState.post ? (
                                "Update Post"
                            ) : (
                                "Create Post"
                            )}
                        </Button>
                    </DialogActions>
                </Dialog>
            )}
        </Fragment>
    );
};

export default PostFormDialog;
