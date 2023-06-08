import {
    Menu,
    List,
    Button,
    Divider,
    ListItem,
    MenuItem,
    TextField,
    CardMedia,
    Typography,
    IconButton,
    ListItemText,
    ListItemAvatar,
} from "@material-ui/core";
import React, { useContext, useState } from "react";
import { MoreHoriz, SendOutlined } from "@material-ui/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp } from "@fortawesome/free-regular-svg-icons";
import { faThumbsUp as filledLike } from "@fortawesome/free-solid-svg-icons";

import AvatarIcon from "../UI/AvatarIcon";
import { UserContext, UIContext } from "../../App";

const Comment = ({ comment }) => {
    const { uiState } = useContext(UIContext);
    const { userState } = useContext(UserContext);

    const [error, setError] = useState("");
    const [isOpen, setIsOpen] = useState(null);
    const [isEdit, setIsEdit] = useState(false);
    const [commentText, setCommentText] = useState(comment.text ? comment.text : "");

    const handleLikeComment = () => {
        console.log("ABC");
    };

    const isLiked = () => {
        return comment.react.like.includes(userState.currentUser._id);
    };

    const handleEditComment = (e) => {
        setError("");
        setCommentText(e.target.value);
    };

    const listItems = (
        <ListItem alignItems="flex-start">
            <ListItemAvatar>
                <AvatarIcon text={comment.user.name} imageUrl={comment.user.avatar_image} />
            </ListItemAvatar>
            <ListItemText
                primary={
                    <Typography style={{ color: uiState.darkMode && "#fff" }}>
                        {comment.user.name}
                    </Typography>
                }
                secondary={
                    <>
                        {isEdit ? (
                            <div style={{ display: "flex" }}>
                                <TextField
                                    error={error ? true : false}
                                    helperText={error}
                                    value={commentText}
                                    onChange={handleEditComment}
                                    multiline
                                    maxRows={4}
                                    style={{
                                        width: "100%",
                                        borderRadius: "20px",
                                        border: "none",
                                        background: uiState.darkMode
                                            ? "rgb(24,25,26)"
                                            : "rgb(240,242,245)",
                                        padding: "8px 16px",
                                    }}
                                />
                                <IconButton
                                    onClick={() => {
                                        // updateComment({
                                        //     id: comment._id,
                                        //     body: { text: commentText },
                                        // }).then((res) => {
                                        //     if (res.data.message === "success") {
                                        //         setIsEdit(false);
                                        //     }
                                        // });
                                    }}
                                >
                                    <SendOutlined />
                                </IconButton>
                            </div>
                        ) : (
                            commentText
                        )}

                        {comment.image && (
                            <CardMedia
                                component={
                                    comment.image.split(".").pop().substring(0, 3) === "mp4"
                                        ? "video"
                                        : "img"
                                }
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "contain",
                                }}
                                image={comment.image}
                                title="Paella dish"
                                controls
                            />
                        )}
                    </>
                }
            />
            <div>
                <IconButton onClick={(e) => setIsOpen(e.currentTarget)}>
                    <MoreHoriz />
                </IconButton>

                <Menu
                    id="comment-action-menu"
                    anchorEl={isOpen}
                    open={Boolean(isOpen)}
                    onClose={() => setIsOpen(null)}
                >
                    <MenuItem
                        onClick={() => {
                            setIsOpen(null);
                            setIsEdit(true);
                        }}
                    >
                        Edit
                    </MenuItem>
                    <MenuItem
                        onClick={() => {
                            // deleteComment(comment._id).then((res) => {
                            //     if (res.data.message === "success") {
                            //         const newComments = postState.post.comments.filter(
                            //             (item) => comment._id !== item.id
                            //         );
                            //         postDispatch({ type: "DELETE_COMMENT", payload: newComments });
                            //     }
                            // });
                        }}
                    >
                        Delete
                    </MenuItem>
                </Menu>
            </div>
        </ListItem>
    );
    return (
        <div style={{ marginTop: "16px" }}>
            <List>
                {listItems}

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-end",
                    }}
                >
                    <Button
                        onClick={handleLikeComment}
                        size="small"
                        color="primary"
                        startIcon={
                            isLiked() ? (
                                <FontAwesomeIcon icon={filledLike} size="sm" />
                            ) : (
                                <FontAwesomeIcon icon={faThumbsUp} size="sm" />
                            )
                        }
                    >
                        ({comment.react.like.length})
                    </Button>
                </div>
                <Divider variant="inset" component="li" />
            </List>
        </div>
    );
};

export default Comment;
