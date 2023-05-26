import {
    Card,
    Grid,
    Paper,
    Button,
    Divider,
    Container,
    CardHeader,
    Typography,
    CardContent,
} from "@material-ui/core";
import moment from "moment";
import { useParams } from "react-router-dom";
import React, { useState, useEffect, useContext } from "react";

import callApi from "../api";
import { UIContext } from "../App";
import useFetchPost from "../hooks/useFetchPost";
import Comment from "../components/Comment/Comment";
import AvatarIcon from "../components/UI/AvatarIcon";
import PostAction from "../components/Post/PostAction";
import PostFooter from "../components/Post/PostFooter";
import SlideImage from "../components/Post/SlideImage";
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
                    type: "SET_ALERT_MESSAGE",
                    payload: { display: true, color: "error", text: err.message },
                });
            }
        })();
    }, []);

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
                            <CardHeader
                                action={<PostAction post={post} />}
                                subheader={moment(post.createdAt).fromNow()}
                                title={
                                    <PostSubContent
                                        postBody={post.body}
                                        username={post.user.name}
                                    />
                                }
                                avatar={
                                    <AvatarIcon
                                        text={post.user.name}
                                        imageUrl={post.user.avatar_image}
                                    />
                                }
                            />
                            <CardContent>
                                <Typography
                                    style={{
                                        fontSize: "16px",
                                        fontWeight: "400",
                                        fontFamily: "fantasy",
                                    }}
                                >
                                    {post.text}
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
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={handleFetchComments}
                                    >
                                        More Comments
                                    </Button>
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
