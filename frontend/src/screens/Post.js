import {
    Card,
    Grid,
    Paper,
    Avatar,
    Button,
    Container,
    CardHeader,
    Typography,
    CardContent,
    Divider,
} from "@material-ui/core";
import moment from "moment";
import { useParams } from "react-router-dom";
import React, { useEffect, useContext } from "react";

import SlideImage from "../components/Post/SlideImage";

import PostFooter from "../components/Post/PostFooter";
import callApi from "../api";
import { PostContext, UIContext } from "../App";
import useFetchPost from "../hooks/useFetchPost";
import Comment from "../components/Comment/Comment";
import AvartaText from "../components/UI/AvartaText";
import PostSubContent from "../components/Post/PostSubContent";
import CommentTextArea from "../components/Comment/CommentTextArea";

const Post = () => {
    const { uiState, uiDispatch } = useContext(UIContext);
    const { postState, postDispatch } = useContext(PostContext);

    const { postId } = useParams();

    const { fetchComments } = useFetchPost();

    useEffect(() => {
        (async () => {
            try {
                const { data } = await callApi({ url: "/post", method: "GET" });
                postDispatch({ type: "SET_POSTS", payload: data.rows });

                const { data: abc } = await callApi({
                    url: "/comment",
                    method: "GET",
                    query: { post_id: postId },
                });
                postDispatch({ type: "SET_POST_COMMENTS", payload: abc.rows });
            } catch (err) {
                uiDispatch({
                    type: "SET_NOTIFICATION",
                    payload: { display: true, color: "error", text: err.message },
                });
            }
        })();
    }, []);

    useEffect(() => {
        const post = postState.posts.find((post) => post._id === postId);
        postDispatch({ type: "SET_CURRENT_POST", payload: post });
        fetchComments(postId);
    }, [postId, postDispatch, postState.posts]);

    const isContent = () => {
        return (
            postState.post.body.location ||
            postState.post.body.feelings ||
            postState.post.body.tag_friends.length
        );
    };
    const handleFetchComments = () => {
        fetchComments(postId);
    };

    return postState.post ? (
        <div style={{ minHeight: "100vh", paddingTop: "100px" }}>
            <Container>
                <Grid spacing={3} container>
                    <Grid item md={7} xs={12} sm={12}>
                        <Card
                            style={{
                                top: "100px",
                                width: "100%",
                                height: "80vh",
                                position: "sticky",
                                backgroundColor: uiState.darkMode && "rgb(36,37,38)",
                            }}
                        >
                            {postState.post.user && (
                                <CardHeader
                                    avatar={
                                        postState.post.user.avatar_image ? (
                                            <Avatar>
                                                <img
                                                    alt=""
                                                    src={postState.post.user.avatar_image}
                                                    style={{ width: "100%", height: "100%" }}
                                                />
                                            </Avatar>
                                        ) : (
                                            <AvartaText text={postState?.post?.user?.name} />
                                        )
                                    }
                                    title={
                                        postState.post && (
                                            <Typography style={{ fontWeight: "800" }}>
                                                {postState.post.user.name}
                                            </Typography>
                                        )
                                    }
                                    subheader={moment(postState.post.createdAt).fromNow()}
                                />
                            )}
                            {postState.post.body && isContent() && (
                                <CardContent
                                    style={{
                                        marginBottom: "16px",
                                        background: uiState.darkMode ? null : "rgb(240,242,245)",
                                        padding: "16px",
                                    }}
                                >
                                    <PostSubContent post={postState.post} />
                                </CardContent>
                            )}

                            <CardContent>
                                <Typography
                                    style={{
                                        fontSize: "16px",
                                        fontWeight: "400",
                                        fontFamily: "fantasy",
                                    }}
                                >
                                    {postState.post.text && postState.post.text}
                                </Typography>
                            </CardContent>

                            {postState.post.images && <SlideImage images={postState.post.images} />}

                            <Divider />
                            <PostFooter post={postState.post} />
                        </Card>
                    </Grid>

                    <Grid item md={5} sm={12} xs={12} style={{ marginBottom: "0px" }}>
                        <Paper
                            style={{
                                padding: "16px",
                                backgroundColor: uiState.darkMode && "rgb(36,37,38)",
                            }}
                        >
                            <CommentTextArea post={postState.post} />
                        </Paper>
                        {postState.post.comments && postState.post.comments.length ? (
                            <>
                                {postState.post.comments.map((comment) => (
                                    <div key={comment.id}>
                                        <Comment comment={comment} />
                                    </div>
                                ))}
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "center",
                                    }}
                                >
                                    {postState.post.commentPagination.totalPage ===
                                    postState.post.commentPagination.currentPage ? (
                                        <Typography variant="h6" color="primary">
                                            No more comments
                                        </Typography>
                                    ) : (
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={handleFetchComments}
                                        >
                                            More Comments
                                        </Button>
                                    )}
                                </div>
                            </>
                        ) : null}
                    </Grid>
                </Grid>
            </Container>
        </div>
    ) : null;
};

export default Post;
