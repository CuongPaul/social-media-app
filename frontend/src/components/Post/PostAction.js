import {
    Menu,
    Button,
    Dialog,
    MenuItem,
    IconButton,
    Typography,
    DialogTitle,
    DialogActions,
    DialogContent,
    DialogContentText,
} from "@material-ui/core";
import { MoreHoriz } from "@material-ui/icons";
import React, { useState, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTag, faTrash } from "@fortawesome/free-solid-svg-icons";

import { usePost } from "../../hooks";
import PostDialog from "./PostDialog";
import { LoadingIcon } from "../common";
import { UserContext } from "../../App";

const PostAction = ({ post }) => {
    const {
        userState: { currentUser },
    } = useContext(UserContext);

    const [anchorEl, setAnchorEl] = useState(null);
    const [postData, setPostData] = useState(null);
    const [isOpenPostDialog, setIsOpenPostDialog] = useState(false);
    const [isOpenConfirmDialog, setIsOpenConfirmDialog] = useState(false);

    const { isLoading, handleRemoveTag, handleDeletePost } = usePost();

    const isOwnerPost = post?.user._id === currentUser?._id;
    const isTaged = post?.body.tag_friends.some((item) => item._id === currentUser?._id);

    return (
        (isTaged || isOwnerPost) && (
            <div>
                <IconButton
                    onClick={(e) => {
                        setPostData(post);
                        setAnchorEl(e.currentTarget);
                    }}
                >
                    <MoreHoriz />
                </IconButton>
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={() => setAnchorEl(null)}
                >
                    {isOwnerPost && (
                        <div>
                            <MenuItem
                                onClick={() => {
                                    setAnchorEl(null);
                                    setIsOpenPostDialog(true);
                                }}
                            >
                                <FontAwesomeIcon icon={faPen} />
                                <Typography style={{ marginLeft: "20px" }}>Edit</Typography>
                            </MenuItem>
                            <MenuItem
                                onClick={() => {
                                    setAnchorEl(null);
                                    setIsOpenConfirmDialog(true);
                                }}
                            >
                                <FontAwesomeIcon icon={faTrash} />
                                <Typography style={{ marginLeft: "20px" }}>Delete</Typography>
                            </MenuItem>
                        </div>
                    )}
                    {isTaged && (
                        <MenuItem
                            onClick={() => {
                                setAnchorEl(null);
                                handleRemoveTag(post?._id);
                            }}
                        >
                            <FontAwesomeIcon icon={faTag} />
                            <Typography style={{ marginLeft: "20px" }}>Remove tag</Typography>
                        </MenuItem>
                    )}
                </Menu>
                <PostDialog
                    postData={postData}
                    isOpen={isOpenPostDialog}
                    setIsOpen={setIsOpenPostDialog}
                />
                <Dialog open={isOpenConfirmDialog} onClose={() => setIsOpenConfirmDialog(false)}>
                    <DialogTitle>Delete post</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Do you really want to delete this post?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions style={{ marginBottom: "10px", paddingRight: "20px" }}>
                        <Button
                            variant="contained"
                            disabled={isLoading}
                            onClick={() =>
                                handleDeletePost({
                                    postId: post?._id,
                                    setIsOpen: setIsOpenConfirmDialog,
                                })
                            }
                        >
                            <LoadingIcon text={"Delete"} isLoading={isLoading} />
                        </Button>
                        <Button
                            color="primary"
                            variant="contained"
                            onClick={() => setIsOpenConfirmDialog(false)}
                        >
                            Cancel
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        )
    );
};

export default PostAction;
