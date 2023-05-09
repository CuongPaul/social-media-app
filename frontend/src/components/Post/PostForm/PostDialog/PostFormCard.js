import {
    Grid,
    Button,
    Dialog,
    Select,
    TextField,
    InputLabel,
    Typography,
    FormControl,
    DialogActions,
    DialogContent,
    CircularProgress,
} from "@material-ui/core";
import EmojiPicker from "emoji-picker-react";
import React, { lazy, useState, Fragment, useEffect, useContext } from "react";

import FilesField from "./FilesField";
import TagUserCard from "./TagUserCard";
import DialogHeader from "./DialogHeader";
import PreviewFile from "./PreviewFile";
import FeelingsCard from "./FeelingsCard";
import LocationField from "./LocationField";
import DialogLoading from "../../../UI/DialogLoading";
import useCreatePost from "../../../../hooks/useCreatePost";
import { updatePost } from "../../../../services/PostServices";
import { UIContext, UserContext, PostContext } from "../../../../App";

const CameraField = lazy(() => import("./CameraField"));

const PostFormDialog = () => {
    const { userState } = useContext(UserContext);
    const { postDispatch } = useContext(PostContext);
    const { uiState, uiDispatch } = useContext(UIContext);

    const [filesUpload, setFilesUpload] = useState([]);
    const [filesPreview, setFilesPreview] = useState([]);
    const [isShowEmoji, setIsShowEmoji] = useState(false);
    const [postData, setPostData] = useState({
        text: "",
        privacy: "public",
        body: { feelings: "", location: "", tag_friends: [] },
    });

    const handleClickEmoji = (e, emojiObject) => {
        setPostData({
            ...postData,
            text: postData.text + emojiObject.emoji,
        });
    };

    const handleChangeContent = (e) => {
        setPostData({
            ...postData,
            text: e.target.value,
        });
    };

    const handleCloseDialog = () => {
        uiDispatch({ type: "EDIT_POST", payload: null });
        uiDispatch({ type: "SET_POST_MODEL", payload: false });
    };

    const handleRemoveFile = () => {
        setFilesPreview("");
        setFilesUpload(null);
    };

    useEffect(() => {
        setPostData({
            privacy: uiState.post ? uiState.post.privacy : "PUBLIC",
            text: uiState.post ? uiState.post.text : "",
        });
    }, [uiState.post]);

    const { handleSubmitPost, loading } = useCreatePost({
        postData,
        filesUpload,
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
                    padding: "8px",
                    cursor: "pointer",
                    borderRadius: "20px",
                    color: uiState.darkMode ? null : "grey",
                    background: uiState.darkMode ? null : "rgb(240,242,245)",
                }}
                onClick={() => uiDispatch({ type: "SET_POST_MODEL", payload: true })}
            >
                What's in your mind, {userState.currentUser.name}?
            </Typography>
            {loading ? (
                <DialogLoading loading={loading} text="Uploading post..." />
            ) : (
                <Dialog
                    fullWidth
                    open={uiState.postModel}
                    style={{ width: "100%" }}
                    onClose={() => uiDispatch({ type: "SET_POST_MODEL", payload: false })}
                >
                    <DialogHeader body={postData.body} handleCloseDialog={handleCloseDialog} />
                    <DialogContent>
                        <FormControl style={{ marginBottom: "16px" }}>
                            <InputLabel>Privacy</InputLabel>
                            <Select
                                value={postData.privacy}
                                onChange={(e) => {
                                    console.log(e.target.value);
                                    setPostData({ ...postData, privacy: e.target.value });
                                }}
                            >
                                <option value={"PUBLIC"}>Public</option>
                                <option value={"FRIEND"}>Friend</option>
                                <option value={"ONLY_ME"}>Only me</option>
                            </Select>
                        </FormControl>
                        <TextField
                            multiline
                            minRows={8}
                            value={postData.text}
                            onChange={handleChangeContent}
                            style={{
                                width: "100%",
                                border: "none",
                                background: uiState.darkMode ? null : "#fff",
                            }}
                            placeholder={`What's in your mind, ${userState.currentUser.name}?`}
                        />

                        <Grid
                            container
                            justifyContent="center"
                            style={{ marginTop: "16px", marginBottom: "16px" }}
                        >
                            <Button
                                size="small"
                                color="secondary"
                                variant="contained"
                                onClick={() => setIsShowEmoji(!isShowEmoji)}
                            >
                                {isShowEmoji ? "Hide" : "Show"} emoji panel
                            </Button>
                        </Grid>
                        <Grid
                            container
                            alignItems="center"
                            justifyContent="center"
                            style={{ marginTop: "16px", marginBottom: "16px" }}
                        >
                            <Grid item md={6} sm={6} xs={12}>
                                {isShowEmoji && (
                                    <EmojiPicker
                                        className="emoji-container"
                                        onEmojiClick={handleClickEmoji}
                                    />
                                )}
                            </Grid>
                        </Grid>
                        <Grid container alignItems="center" justifyContent="center">
                            <Grid item md={6} sm={6} xs={12}>
                                <FilesField
                                    multipleUpload={true}
                                    setFilesUpload={setFilesUpload}
                                    setFilesPreview={setFilesPreview}
                                />
                                <CameraField
                                    setFilesUpload={setFilesUpload}
                                    setFilesPreview={setFilesPreview}
                                />
                                <LocationField body={postData.body} setPostData={setPostData} />
                                <FeelingsCard body={postData.body} setPostData={setPostData} />
                                <TagUserCard body={postData.body} setPostData={setPostData} />
                            </Grid>
                        </Grid>

                        {filesPreview.length
                            ? filesPreview.map((item) => (
                                  <PreviewFile
                                      filePreview={item}
                                      handleRemoveFile={handleRemoveFile}
                                  />
                              ))
                            : null}
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
