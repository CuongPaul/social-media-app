import { MoreHoriz } from "@material-ui/icons";
import React, { useState, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Menu, MenuItem, IconButton, Typography } from "@material-ui/core";

import PostDialog from "./PostDialog";
import { UserContext } from "../../App";

const PostAction = ({ post }) => {
    const { userState } = useContext(UserContext);

    const [postData, setPostData] = useState(null);
    const [isShowAction, setIsShowAction] = useState(null);
    const [isOpenPostDialog, setIsOpenPostDialog] = useState(false);

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
                        }}
                    >
                        <FontAwesomeIcon icon={faTrash} />
                        <Typography style={{ marginLeft: "20px" }}>Delete</Typography>
                    </MenuItem>
                </Menu>
                <PostDialog
                    postData={postData}
                    isOpen={isOpenPostDialog}
                    setIsOpenPostDialog={setIsOpenPostDialog}
                />
            </div>
        )
    );
};

export default PostAction;