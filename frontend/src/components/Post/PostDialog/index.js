import {
  Grid,
  Paper,
  Button,
  Dialog,
  Select,
  MenuItem,
  TextField,
  CardHeader,
  IconButton,
  InputLabel,
  Typography,
  FormControl,
  DialogActions,
  DialogContent,
  LinearProgress,
  InputAdornment,
} from "@material-ui/core";
import { Close } from "@material-ui/icons";
import React, { useState, Fragment, useEffect, useContext } from "react";

import Camera from "./Camera";
import Feelings from "./Feelings";
import Location from "./Location";
import TagFriends from "./TagFriends";
import { usePost } from "../../../hooks";
import PostSubContent from "../PostSubContent";
import { UIContext, UserContext } from "../../../App";
import { FilePreview, FilesUpload } from "../../common";
import { Emoji, AvatarIcon, LoadingIcon } from "../../common";

const PostDialog = ({ isOpen, postData, setIsOpen }) => {
  const {
    uiState: { darkMode },
  } = useContext(UIContext);
  const {
    userState: { currentUser },
  } = useContext(UserContext);

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

    if (
      !newFilesPreview[fileIndex].includes("https://firebasestorage.googleapis")
    ) {
      newFilesUpload.splice(fileIndex, 1);
    }
    newFilesPreview.splice(fileIndex, 1);

    setFilesPreview(newFilesPreview);
    setFilesUpload(newFilesUpload);
  };

  const { isLoading, handleUpdatePost, handleCreatePost } = usePost();

  useEffect(() => {
    if (postData) {
      setText(postData.text);
      setPrivacy(postData.privacy);
      setFilesPreview(postData.images);
      setFeelings(postData.body.feelings);
      setLocation(postData.body.location);
      setTagFriends(postData.body.tag_friends);
    } else {
      if (!isOpen) {
        return () => {
          setText("");
          setFeelings("");
          setLocation("");
          setTagFriends([]);
          setFilesPreview([]);
          setPrivacy("PUBLIC");
        };
      }
    }
  }, [isOpen, postData]);

  return (
    <Fragment>
      <Dialog fullWidth open={isOpen} onClose={() => setIsOpen(false)}>
        <CardHeader
          action={
            <IconButton onClick={() => setIsOpen(false)}>
              <Close />
            </IconButton>
          }
          title={
            <PostSubContent
              user={currentUser}
              postBody={{ feelings, location, tag_friends: tagFriends }}
            />
          }
          avatar={
            <AvatarIcon
              text={currentUser?.name}
              imageUrl={currentUser?.avatar_image}
            />
          }
        />
        <DialogContent>
          <FormControl style={{ minWidth: "120px", marginBottom: "16px" }}>
            <InputLabel>Privacy</InputLabel>
            <Select
              value={privacy}
              onChange={(e) => setPrivacy(e.target.value)}
            >
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
              backgroundColor: darkMode ? null : "rgb(255,255,255)",
            }}
            placeholder={`What's in your mind, ${currentUser?.name}?`}
            InputProps={{
              endAdornment: (
                <InputAdornment
                  position="end"
                  style={{
                    right: "-10px",
                    bottom: "25px",
                    position: "absolute",
                  }}
                >
                  <Emoji setText={setText} />
                </InputAdornment>
              ),
            }}
          />
          <Grid container alignItems="center" justifyContent="center">
            <FilesUpload
              multipleUpload={true}
              setFilesUpload={setFilesUpload}
              setFilesPreview={setFilesPreview}
            />
            <Camera
              setFilesUpload={setFilesUpload}
              setFilesPreview={setFilesPreview}
            />
            <Feelings feelings={feelings} setFeelings={setFeelings} />
            {privacy !== "ONLY_ME" && (
              <TagFriends
                tagFriends={tagFriends}
                setTagFriends={setTagFriends}
              />
            )}
            <Location location={location} setLocation={setLocation} />
          </Grid>
          {filesPreview.map((item, index) => (
            <FilePreview
              key={index}
              filePreview={item}
              handleRemoveFile={() => handleRemoveFilePreview(index)}
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button
            color="primary"
            disabled={isLoading}
            variant="contained"
            style={{ width: "100%", margin: "10px" }}
            onClick={() => {
              if (postData) {
                return handleUpdatePost({
                  setIsOpen,
                  filesUpload,
                  filesPreview,
                  postId: postData._id,
                  postData: {
                    text,
                    privacy,
                    images: postData?.images,
                    body: {
                      feelings,
                      location,
                      tag_friends: tagFriends.map((item) => item._id),
                    },
                  },
                });
              }

              return handleCreatePost({
                setIsOpen,
                filesUpload,
                postData: {
                  text,
                  privacy,
                  images: postData?.images,
                  body: {
                    feelings,
                    location,
                    tag_friends: tagFriends.map((item) => item._id),
                  },
                },
              });
            }}
          >
            <LoadingIcon
              isLoading={isLoading}
              text={postData ? "Update post" : "Create post"}
            />
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog fullWidth open={isLoading} style={{ width: "100%" }}>
        <Paper
          style={{
            display: "flex",
            padding: "32px 0px",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <Typography
            style={{
              fontWeight: 800,
              fontSize: "20px",
              marginBottom: "16px",
            }}
          >
            Creating post ...
          </Typography>
          <LinearProgress color="secondary" style={{ width: "75%" }} />
        </Paper>
      </Dialog>
    </Fragment>
  );
};

export default PostDialog;
