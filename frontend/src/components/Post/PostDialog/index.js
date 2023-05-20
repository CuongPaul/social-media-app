import {
    Grid,
    Button,
    Dialog,
    Select,
    TextField,
    InputLabel,
    FormControl,
    DialogActions,
    DialogContent,
    InputAdornment,
    CircularProgress,
} from "@material-ui/core";
import React, { lazy, useState, Fragment, useEffect, useContext } from "react";

import Emoji from "../../Emoji";
import Feelings from "./Feelings";
import Location from "./Location";
import TagFriends from "./TagFriends";
import FilesUpload from "./FilesUpload";
import PreviewFile from "./PreviewFile";
import DialogHeader from "./DialogHeader";
import { useCreatePost } from "../../../hooks";
import DialogLoading from "../../UI/DialogLoading";
import { UIContext, UserContext } from "../../../App";

const Camera = lazy(() => import("./Camera"));

const PostFormDialog = ({ postData, isOpen, setIsOpenPostDialog }) => {
    const { uiState } = useContext(UIContext);
    const { userState } = useContext(UserContext);

    const [text, setText] = useState("");
    const [feelings, setFeelings] = useState("");
    const [location, setLocation] = useState("");
    const [privacy, setPrivacy] = useState("PUBLIC");
    const [tagFriends, setTagFriends] = useState([]);
    const [filesUpload, setFilesUpload] = useState([]);
    const [filesPreview, setFilesPreview] = useState([]);

    const handleRemoveFilePreview = (fileIndex) => {
        const newFilesPreview = [...filesPreview];
        const newFilesUpload = [...filesUpload];

        newFilesPreview.splice(fileIndex, 1);
        newFilesUpload.splice(fileIndex, 1);

        setFilesPreview(newFilesPreview);
        setFilesUpload(newFilesUpload);
    };

    const { handleSubmitPost, loading } = useCreatePost({
        postData: {
            text,
            privacy,
            body: { feelings, location, tag_friends: tagFriends },
        },
        filesUpload,
    });
    const handleUpdatePost = (postId) => {};

    useEffect(() => {
        if (postData) {
            setText(postData.text);
            setPrivacy(postData.privacy);
            setFilesPreview(postData.images);
            setFeelings(postData.body.feelings);
            setLocation(postData.body.location);
            setTagFriends(postData.body.tag_friends);
        }
    }, [postData]);

    return (
        <Fragment>
            {loading ? (
                <DialogLoading loading={loading} text="Uploading post..." />
            ) : (
                <Dialog
                    fullWidth
                    open={isOpen}
                    style={{ width: "100%" }}
                    onClose={() => setIsOpenPostDialog(false)}
                >
                    <DialogHeader
                        user={userState.currentUser}
                        postBody={{ feelings, location, tag_friends: tagFriends }}
                        handleCloseDialog={() => setIsOpenPostDialog(false)}
                    />
                    <DialogContent>
                        <FormControl style={{ marginBottom: "16px" }}>
                            <InputLabel>Privacy</InputLabel>
                            <Select value={privacy} onChange={(e) => setPrivacy(e.target.value)}>
                                <option value={"PUBLIC"}>Public</option>
                                <option value={"FRIEND"}>Friend</option>
                                <option value={"ONLY_ME"}>Only me</option>
                            </Select>
                        </FormControl>
                        <TextField
                            multiline
                            minRows={8}
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            style={{
                                width: "100%",
                                border: "none",
                                background: uiState.darkMode ? null : "#fff",
                            }}
                            placeholder={`What's in your mind, ${userState?.currentUser?.name}?`}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <Emoji setText={setText} />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <Grid container alignItems="center" justifyContent="center">
                            <Grid item md={6} sm={6} xs={12}>
                                <FilesUpload
                                    multipleUpload={true}
                                    setFilesUpload={setFilesUpload}
                                    setFilesPreview={setFilesPreview}
                                />
                                <Camera
                                    setFilesUpload={setFilesUpload}
                                    setFilesPreview={setFilesPreview}
                                />
                                <Location location={location} setLocation={setLocation} />
                                <Feelings feelings={feelings} setFeelings={setFeelings} />
                                <TagFriends tagFriends={tagFriends} setTagFriends={setTagFriends} />
                            </Grid>
                        </Grid>

                        {filesPreview.length
                            ? filesPreview.map((item, index) => (
                                  <PreviewFile
                                      key={index}
                                      filePreview={item}
                                      handleRemoveFile={() => handleRemoveFilePreview(index)}
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
