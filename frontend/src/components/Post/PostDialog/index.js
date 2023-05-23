import {
    Grid,
    Button,
    Dialog,
    Select,
    MenuItem,
    TextField,
    CardHeader,
    IconButton,
    InputLabel,
    FormControl,
    DialogActions,
    DialogContent,
    InputAdornment,
    CircularProgress,
} from "@material-ui/core";
import { Close } from "@material-ui/icons";
import React, { useState, Fragment, useEffect, useContext } from "react";

import Camera from "./Camera";
import Emoji from "../../Emoji";
import Feelings from "./Feelings";
import Location from "./Location";
import TagFriends from "./TagFriends";
import FilesUpload from "./FilesUpload";
import PreviewFile from "./PreviewFile";
import AvatarIcon from "../../UI/AvatarIcon";
import { useSubmitPost } from "../../../hooks";
import PostSubContent from "../PostSubContent";
import DialogLoading from "../../UI/DialogLoading";
import { UIContext, UserContext } from "../../../App";

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

    const { loading, handleUpdatePost, handleCreatePost } = useSubmitPost({
        postData: {
            text,
            privacy,
            body: { feelings, location, tag_friends: tagFriends.map((item) => item._id) },
        },
        filesUpload,
    });

    useEffect(() => {
        if (postData) {
            setText(postData.text);
            setPrivacy(postData.privacy);
            setFeelings(postData.body.feelings);
            setLocation(postData.body.location);
        }
    }, [postData]);

    return (
        <Fragment>
            <Dialog fullWidth open={isOpen} onClose={() => setIsOpenPostDialog(false)}>
                <CardHeader
                    avatar={
                        <AvatarIcon
                            text={userState?.currentUser?.name}
                            imageUrl={userState?.currentUser?.avatar_image}
                        />
                    }
                    title={
                        <PostSubContent
                            username={userState?.currentUser?.name}
                            postBody={{ feelings, location, tag_friends: tagFriends }}
                        />
                    }
                    action={
                        <IconButton onClick={() => setIsOpenPostDialog(false)}>
                            <Close />
                        </IconButton>
                    }
                />
                <DialogContent>
                    <FormControl style={{ minWidth: "120px", marginBottom: "16px" }}>
                        <InputLabel>Privacy</InputLabel>
                        <Select value={privacy} onChange={(e) => setPrivacy(e.target.value)}>
                            <MenuItem value={"PUBLIC"}>Public</MenuItem>
                            <MenuItem value={"FRIEND"}>Friend</MenuItem>
                            <MenuItem value={"ONLY_ME"}>Only me</MenuItem>
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
                            position: "relative",
                            background: uiState.darkMode ? null : "#fff",
                        }}
                        placeholder={`What's in your mind, ${userState?.currentUser?.name}?`}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment
                                    position="end"
                                    style={{ right: "-10px", bottom: "25px", position: "absolute" }}
                                >
                                    <Emoji setText={setText} />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <Grid container alignItems="center" justifyContent="center">
                        {!postData && (
                            <>
                                <FilesUpload
                                    multipleUpload={true}
                                    setFilesUpload={setFilesUpload}
                                    setFilesPreview={setFilesPreview}
                                />
                                <Camera
                                    setFilesUpload={setFilesUpload}
                                    setFilesPreview={setFilesPreview}
                                />
                            </>
                        )}
                        <Feelings feelings={feelings} setFeelings={setFeelings} />
                        {privacy !== "ONLY_ME" && !postData && (
                            <TagFriends tagFriends={tagFriends} setTagFriends={setTagFriends} />
                        )}
                        <Location location={location} setLocation={setLocation} />
                    </Grid>
                    {filesPreview.map((item, index) => (
                        <PreviewFile
                            key={index}
                            filePreview={item}
                            handleRemoveFile={() => handleRemoveFilePreview(index)}
                        />
                    ))}
                </DialogContent>
                <DialogActions>
                    <Button
                        color="primary"
                        disabled={loading}
                        variant="contained"
                        style={{ width: "100%", margin: "10px" }}
                        onClick={(e) => {
                            if (postData) {
                                return handleUpdatePost(postData._id);
                            }

                            return handleCreatePost(e);
                        }}
                    >
                        {loading ? (
                            <CircularProgress
                                size={25}
                                variant="indeterminate"
                                style={{ color: "#fff" }}
                            />
                        ) : postData ? (
                            "Update post"
                        ) : (
                            "Create post"
                        )}
                    </Button>
                </DialogActions>
            </Dialog>
            <DialogLoading loading={loading} text="Creating post ..." />
        </Fragment>
    );
};

export default PostFormDialog;
