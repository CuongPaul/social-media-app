import { Send } from "@material-ui/icons";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import React, { useState, useEffect, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Paper,
  TextField,
  IconButton,
  InputAdornment,
} from "@material-ui/core";

import { useComment } from "../../hooks";
import { UIContext, PostContext } from "../../App";
import { Emoji, FilePreview, FilesUpload, LoadingIcon } from "../common";

const CommentInput = ({ postId }) => {
  const {
    uiState: { darkMode },
  } = useContext(UIContext);
  const {
    postState: { commentSelected },
  } = useContext(PostContext);

  const [text, setText] = useState("");
  const [filePreview, setFilePreview] = useState("");
  const [fileUpload, setFileUpload] = useState(null);

  const { isLoading, handleCreateComment, handleUpdateComment } = useComment();

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
  }, [commentSelected]);

  useEffect(() => {
    if (commentSelected) {
      setFileUpload(null);
      setText(commentSelected.text);

      if (commentSelected.image) {
        setFilePreview(commentSelected.image);
      }
    }
  }, [commentSelected]);

  return (
    <Paper
      elevation={0}
      style={{
        padding: "16px",
        display: "flex",
        alignItems: "center",
        borderRadius: "10px",
        backgroundColor: darkMode && "rgb(36,37,38)",
      }}
    >
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
              postId,
              fileUpload,
              handleRemoveFile,
            };

            if (commentSelected) {
              handleUpdateComment({
                ...argument,
                currentImage: filePreview,
                commentId: commentSelected._id,
              });
            } else {
              handleCreateComment(argument);
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
            postId,
            fileUpload,
            handleRemoveFile,
          };

          if (commentSelected) {
            handleUpdateComment({
              ...argument,
              currentImage: filePreview,
              commentId: commentSelected._id,
            });
          } else {
            handleCreateComment(argument);
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
    </Paper>
  );
};

export default CommentInput;
