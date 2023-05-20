import {
    Card,
    Grid,
    Paper,
    Button,
    Container,
    CardHeader,
    Typography,
    CardContent,
    Divider,
} from "@material-ui/core";
import moment from "moment";
import { useParams } from "react-router-dom";
import React, { useEffect, useContext, useState } from "react";

import SlideImage from "../components/Post/SlideImage";

import PostFooter from "../components/Post/PostFooter";
import callApi from "../api";
import { UIContext } from "../App";
import useFetchPost from "../hooks/useFetchPost";
import Comment from "../components/Comment/Comment";
import AvatarIcon from "../components/UI/AvatarIcon";
import PostSubContent from "../components/Post/PostSubContent";
import CommentTextArea from "../components/Comment/CommentTextArea";

const Post = () => {
    const { uiState, uiDispatch } = useContext(UIContext);

    const [post, setPost] = useState(null);
    const [comments, setComments] = useState(null);

    const { postId } = useParams();

    const { fetchComments } = useFetchPost();

    useEffect(() => {
        (async () => {
            try {
                const { data } = await callApi({
                    method: "GET",
                    url: "/comment",
                    query: { post_id: postId },
                });
                setComments(data.rows);

                const { data: postData } = await callApi({
                    method: "GET",
                    url: `/post/${postId}`,
                });
                setPost(postData);
            } catch (err) {
                uiDispatch({
                    type: "SET_NOTIFICATION",
                    payload: { display: true, color: "error", text: err.message },
                });
            }
        })();
    }, []);

    // useEffect(() => {
    //     const post = post.posts.find((post) => post._id === postId);
    //     setPost({ type: "SET_CURRENT_POST", payload: post });
    //     fetchComments(postId);
    // }, [postId, setPost, post.posts]);

    const isContent = () => {
        return post.body.location || post.body.feelings || post.body.tag_friends.length;
    };
    const handleFetchComments = () => {
        fetchComments(postId);
    };

    return post ? (
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
                            {post.user && (
                                <CardHeader
                                    avatar={
                                        <AvatarIcon
                                            text={post?.post?.user?.name}
                                            imageUrl={post.user.avatar_image}
                                        />
                                    }
                                    title={
                                        post && (
                                            <Typography style={{ fontWeight: "800" }}>
                                                {post.user.name}
                                            </Typography>
                                        )
                                    }
                                    subheader={moment(post.createdAt).fromNow()}
                                />
                            )}
                            {post.body && isContent() && (
                                <CardContent
                                    style={{
                                        marginBottom: "16px",
                                        background: uiState.darkMode ? null : "rgb(240,242,245)",
                                        padding: "16px",
                                    }}
                                >
                                    <PostSubContent post={post} />
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
                                    {post.text && post.text}
                                </Typography>
                            </CardContent>

                            {post.images && <SlideImage images={post.images} />}

                            <Divider />
                            <PostFooter post={post} />
                        </Card>
                    </Grid>

                    <Grid item md={5} sm={12} xs={12} style={{ marginBottom: "0px" }}>
                        <Paper
                            style={{
                                padding: "16px",
                                backgroundColor: uiState.darkMode && "rgb(36,37,38)",
                            }}
                        >
                            <CommentTextArea post={post} />
                        </Paper>
                        {comments && comments.length ? (
                            <>
                                {comments.map((comment) => (
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
                                    {post.commentPagination.totalPage ===
                                    post.commentPagination.currentPage ? (
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
