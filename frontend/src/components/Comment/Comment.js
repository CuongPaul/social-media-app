import {
    Menu,
    List,
    Divider,
    ListItem,
    MenuItem,
    CardMedia,
    Typography,
    IconButton,
    ListItemText,
    ListItemAvatar,
} from "@material-ui/core";
import { MoreHoriz } from "@material-ui/icons";
import React, { useState, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";

import { useComment } from "../../hooks";
import AvatarIcon from "../common/AvatarIcon";
import { UIContext, UserContext, PostContext } from "../../App";

const Comment = ({ comment }) => {
    const {
        uiState: { darkMode },
    } = useContext(UIContext);
    const {
        userState: { currentUser },
    } = useContext(UserContext);
    const { postDispatch } = useContext(PostContext);

    const [anchorEl, setAnchorEl] = useState(null);

    const { handleDeleteComment } = useComment();

    return (
        <List>
            <ListItem style={{ display: "flex", alignItems: "start" }}>
                <ListItemAvatar>
                    <AvatarIcon text={comment.user.name} imageUrl={comment.user.avatar_image} />
                </ListItemAvatar>
                <ListItemText
                    primary={
                        <Typography style={{ color: darkMode && "rgb(255,255,255)" }}>
                            {comment.user.name}
                        </Typography>
                    }
                    secondary={
                        <div style={{ marginTop: "5px" }}>
                            <Typography style={{ color: darkMode && "rgb(255,255,255)" }}>
                                {comment.text}
                            </Typography>
                            {comment.image && (
                                <CardMedia
                                    controls
                                    title={""}
                                    image={comment.image}
                                    component={
                                        comment.image.split(".").pop().substring(0, 3) === "mp4"
                                            ? "video"
                                            : "img"
                                    }
                                    style={{ width: "100%", height: "100%", objectFit: "contain" }}
                                />
                            )}
                        </div>
                    }
                />
                {currentUser?._id === comment.user._id && (
                    <div>
                        <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
                            <MoreHoriz />
                        </IconButton>
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={() => setAnchorEl(null)}
                        >
                            <MenuItem
                                onClick={() => {
                                    setAnchorEl(null);
                                    postDispatch({
                                        payload: comment,
                                        type: "SET_COMMENT_SELECTED",
                                    });
                                }}
                            >
                                <FontAwesomeIcon icon={faPen} />
                                <Typography style={{ marginLeft: "20px" }}>Edit</Typography>
                            </MenuItem>
                            <MenuItem
                                onClick={() => {
                                    setAnchorEl(null);
                                    handleDeleteComment(comment._id);
                                }}
                            >
                                <FontAwesomeIcon icon={faTrash} />
                                <Typography style={{ marginLeft: "20px" }}>Delete</Typography>
                            </MenuItem>
                        </Menu>
                    </div>
                )}
            </ListItem>
            <Divider variant="inset" />
        </List>
    );
};

export default Comment;
