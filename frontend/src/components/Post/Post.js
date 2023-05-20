import {
    Card,
    Menu,
    Divider,
    MenuItem,
    CardHeader,
    IconButton,
    Typography,
} from "@material-ui/core";
import moment from "moment";
import { MoreHoriz } from "@material-ui/icons";
import React, { useState, useContext } from "react";

import { UIContext } from "../../App";
import PostFooter from "./PostFooter";
import PostContent from "./PostContent";
import AvatarIcon from "../UI/AvatarIcon";

const Post = ({ post, handleDeletePost }) => {
    const [isOpen, setIsOpen] = useState(false);

    const { uiState, uiDispatch } = useContext(UIContext);

    return (
        <Card
            style={{
                marginTop: "20px",
                backgroundColor: uiState.darkMode && "rgb(36,37,38)",
            }}
        >
            <CardHeader
                avatar={<AvatarIcon text={post.user.name} imageUrl={post.user.avatar_image} />}
                action={
                    <div>
                        <IconButton onClick={(e) => setIsOpen(e.currentTarget)}>
                            <MoreHoriz />
                        </IconButton>
                        <Menu open={Boolean(isOpen)} onClose={() => setIsOpen(null)}>
                            <MenuItem
                                onClick={() => {
                                    setIsOpen(null);
                                    uiDispatch({
                                        type: "EDIT_POST",
                                        payload: {
                                            privacy: post.privacy,
                                            content: post.content,
                                            id: post.id,
                                        },
                                    });
                                    uiDispatch({ type: "DISPLAY_POST_DIALOG", payload: true });
                                }}
                            >
                                Edit
                            </MenuItem>
                            <MenuItem
                                onClick={() => {
                                    // deletePost(post.id).then((res) => {
                                    //     if (res.data.message === "success") {
                                    //         handleDeletePost(post.id);
                                    //     }
                                    // });
                                }}
                            >
                                Delete
                            </MenuItem>
                        </Menu>
                    </div>
                }
                title={
                    post && <Typography style={{ fontWeight: "800" }}>{post.user.name}</Typography>
                }
                subheader={post && moment(post.createdAt).fromNow()}
            />
            <PostContent post={post} />
            <Divider />
            <PostFooter post={post} />
        </Card>
    );
};

export default Post;
