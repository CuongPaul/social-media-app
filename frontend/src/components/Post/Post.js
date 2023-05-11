import {
    Card,
    Menu,
    Avatar,
    MenuItem,
    CardHeader,
    IconButton,
    Typography,
    Divider,
} from "@material-ui/core";
import moment from "moment";
import { MoreHoriz } from "@material-ui/icons";
import React, { useState, useContext } from "react";

import { UIContext } from "../../App";
import PostFooter from "./PostFooter";
import PostContent from "./PostContent";
import AvartarText from "../UI/AvartarText";
import { deletePost } from "../../services/PostServices";

const Post = ({ post, handleDeletePost }) => {
    const { uiState, uiDispatch } = useContext(UIContext);

    const [isOpen, setIsOpen] = useState(false);

    return (
        <Card
            style={{
                marginTop: "20px",
                backgroundColor: uiState.darkMode && "rgb(36,37,38)",
            }}
        >
            <CardHeader
                avatar={
                    post.user && post.user.avatar_image ? (
                        <Avatar>
                            <img
                                alt="avatar"
                                src={post.user.avatar_image}
                                style={{ width: "100%", height: "100%" }}
                            />
                        </Avatar>
                    ) : (
                        <AvartarText
                            text={post?.user?.name}
                            backgroundColor={post?.user?.active ? "seagreen" : "tomato"}
                        />
                    )
                }
                action={
                    <div>
                        <IconButton onClick={(e) => setIsOpen(e.currentTarget)}>
                            <MoreHoriz />
                        </IconButton>

                        <Menu
                            id="post-action-menu"
                            anchorEl={isOpen}
                            open={Boolean(isOpen)}
                            onClose={() => setIsOpen(null)}
                        >
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
                                    uiDispatch({ type: "SET_POST_MODEL", payload: true });
                                }}
                            >
                                Edit
                            </MenuItem>
                            <MenuItem
                                onClick={() => {
                                    deletePost(post.id).then((res) => {
                                        if (res.data.message === "success") {
                                            handleDeletePost(post.id);
                                        }
                                    });
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
