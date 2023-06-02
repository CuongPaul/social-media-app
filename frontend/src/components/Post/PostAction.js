import { MoreHoriz } from "@material-ui/icons";
import React, { useState, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
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

import PostDialog from "./PostDialog";
import { UserContext } from "../../App";
import { usePostActions } from "../../hooks";

const PostAction = ({ post }) => {
    const { userState } = useContext(UserContext);

    const [postData, setPostData] = useState(null);
    const [isShowAction, setIsShowAction] = useState(null);
    const [isOpenPostDialog, setIsOpenPostDialog] = useState(false);
    const [isOpenConfirmDialog, setIsOpenConfirmDialog] = useState(false);

    const { loading, handleDeletePost } = usePostActions({ setIsOpen: setIsOpenConfirmDialog });

    return (
        post?.user?._id === userState?.currentUser?._id && (
            <div>
                <IconButton
                    onClick={(e) => {
                        setPostData(post);
                        setIsShowAction(e.currentTarget);
                    }}
                >
                    <MoreHoriz />
                </IconButton>
                <Menu
                    anchorEl={isShowAction}
                    open={Boolean(isShowAction)}
                    onClose={() => setIsShowAction(null)}
                >
                    <MenuItem
                        onClick={() => {
                            setIsShowAction(null);
                            setIsOpenPostDialog(true);
                        }}
                    >
                        <FontAwesomeIcon icon={faPen} />
                        <Typography style={{ marginLeft: "20px" }}>Edit</Typography>
                    </MenuItem>
                    <MenuItem
                        onClick={() => {
                            setIsShowAction(null);
                            setIsOpenConfirmDialog(true);
                        }}
                    >
                        <FontAwesomeIcon icon={faTrash} />
                        <Typography style={{ marginLeft: "20px" }}>Delete</Typography>
                    </MenuItem>
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
                            disable={loading}
                            variant="contained"
                            onClick={() => handleDeletePost(post._id)}
                        >
                            Delete
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
