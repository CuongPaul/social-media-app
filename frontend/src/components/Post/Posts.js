import moment from "moment";
import { MoreHoriz } from "@material-ui/icons";
import React, { useState, Fragment, useContext } from "react";
import { Card, Menu, Button, Divider, MenuItem, CardHeader, IconButton } from "@material-ui/core";

import PostDialog from "./PostDialog";
import PostFooter from "./PostFooter";
import PostContent from "./PostContent";
import AvatarIcon from "../UI/AvatarIcon";
import PostSubContent from "./PostSubContent";
import { UIContext, UserContext } from "../../App";
import useFetchPost from "../../hooks/useFetchPost";

const Posts = ({ posts }) => {
    const { uiState } = useContext(UIContext);
    const { userState } = useContext(UserContext);

    const [postData, setPostData] = useState(null);
    const [isShowAction, setIsShowAction] = useState(null);
    const [isOpenPostDialog, setIsOpenPostDialog] = useState(false);

    const { fetchPosts } = useFetchPost();

    const handleFetchPosts = () => {
        fetchPosts();
    };

    return (
        <Fragment>
            {posts.map((post) => (
                <Card
                    key={post._id}
                    style={{
                        marginTop: "20px",
                        borderRadius: "15px",
                        backgroundColor: uiState.darkMode && "rgb(36,37,38)",
                    }}
                >
                    <CardHeader
                        subheader={moment(post.createdAt).fromNow()}
                        title={<PostSubContent postBody={post.body} username={post.user.name} />}
                        avatar={
                            <AvatarIcon text={post.user.name} imageUrl={post.user.avatar_image} />
                        }
                        action={
                            post.user._id === userState.currentUser._id && (
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
                                            Edit
                                        </MenuItem>
                                        <MenuItem
                                            onClick={() => {
                                                setIsShowAction(null);
                                            }}
                                        >
                                            Delete
                                        </MenuItem>
                                    </Menu>
                                </div>
                            )
                        }
                    />
                    <PostContent post={post} />
                    <Divider />
                    <PostFooter post={post} />
                </Card>
            ))}
            <PostDialog
                postData={postData}
                isOpen={isOpenPostDialog}
                setIsOpenPostDialog={setIsOpenPostDialog}
            />
            <div
                style={{
                    display: "flex",
                    marginTop: "20px",
                    justifyContent: "center",
                }}
            >
                <Button variant="contained" color="primary" onClick={handleFetchPosts}>
                    More Posts
                </Button>
            </div>
        </Fragment>
    );
};

export default Posts;
