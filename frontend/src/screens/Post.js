import moment from "moment";
import { useParams } from "react-router-dom";
import React, { useRef, useState, useEffect, useContext } from "react";
import { Card, Grid, Paper, Divider, CardHeader, Typography, CardContent } from "@material-ui/core";

import callApi from "../api";
import { useComment } from "../hooks";
import { UIContext, PostContext } from "../App";
import Comment from "../components/Comment/Comment";
import PostAction from "../components/Post/PostAction";
import PostFooter from "../components/Post/PostFooter";
import SlideImage from "../components/Post/SlideImage";
import AvatarIcon from "../components/common/AvatarIcon";
import CommentInput from "../components/Comment/CommentInput";
import PostSubContent from "../components/Post/PostSubContent";

const Post = () => {
    const {
        uiState: { darkMode },
        uiDispatch,
    } = useContext(UIContext);
    const {
        postDispatch,
        postState: { comments, postSelected },
    } = useContext(PostContext);

    const { postId } = useParams();
    const postAreaRef = useRef(null);
    const [page, setPage] = useState(1);
    const [commentAreaHeight, setCommentAreaHeight] = useState(0);

    const { handleGetComments } = useComment();

    const handleScrollComment = async (e) => {
        const { scrollTop, clientHeight, scrollHeight } = e.target;

        const isBottom = scrollHeight - scrollTop === clientHeight + 0.5;

        if (isBottom) {
            setPage(page + 1);
            handleGetComments(page + 1, postId);
        }
    };

    useEffect(() => {
        (async () => {
            try {
                const { data: commentsData } = await callApi({
                    method: "GET",
                    url: "/comment",
                    query: { post_id: postId },
                });
                postDispatch({ type: "SET_COMMENTS", payload: commentsData.rows });

                const { data: postData } = await callApi({ method: "GET", url: `/post/${postId}` });
                postDispatch({ payload: postData, type: "SET_CURRENT_POST" });
            } catch (err) {
                uiDispatch({
                    type: "SET_ALERT_MESSAGE",
                    payload: { display: true, color: "error", text: err.message },
                });
            }
        })();

        return () => {
            postDispatch({ type: "SET_CURRENT_POST", payload: null });
            postDispatch({ type: "SET_COMMENT_SELECTED", payload: null });
        };
    }, []);

    useEffect(() => {
        setTimeout(() => {
            setCommentAreaHeight(postAreaRef.current?.clientHeight - 92 - 20);
        }, 1000);
    }, [postAreaRef.current?.clientHeight]);

    return (
        <div
            style={{
                display: "flex",
                padding: "20px",
                marginTop: "64px",
                justifyContent: "space-around",
                minHeight: `calc(100vh - 64px)`,
            }}
        >
            <Grid item md={7}>
                <Card
                    ref={postAreaRef}
                    style={{ borderRadius: "10px", backgroundColor: darkMode && "rgb(36,37,38)" }}
                >
                    <CardHeader
                        title={
                            <PostSubContent
                                postBody={postSelected?.body}
                                username={postSelected?.user.name}
                            />
                        }
                        action={<PostAction post={postSelected} />}
                        avatar={
                            <AvatarIcon
                                text={postSelected?.user.name}
                                imageUrl={postSelected?.user.avatar_image}
                            />
                        }
                        subheader={moment(postSelected?.createdAt).fromNow()}
                    />
                    <CardContent>
                        <Typography
                            style={{ fontWeight: 400, fontSize: "16px", fontFamily: "fantasy" }}
                        >
                            {postSelected?.text}
                        </Typography>
                    </CardContent>
                    {postSelected?.images && <SlideImage images={postSelected?.images} />}
                    <Divider />
                    <PostFooter post={postSelected} />
                </Card>
            </Grid>
            <Grid item md={4}>
                <Paper
                    style={{
                        padding: "5px",
                        borderRadius: "10px",
                        backgroundColor: darkMode && "rgb(36,37,38)",
                    }}
                >
                    <CommentInput postId={postSelected?._id} />
                </Paper>
                {Boolean(comments.length) && (
                    <Paper
                        onScroll={handleScrollComment}
                        style={{
                            marginTop: "20px",
                            minHeight: "550px",
                            borderRadius: "10px",
                            overflow: "hidden auto",
                            height: `${commentAreaHeight}px`,
                            backgroundColor: "rgb(255,255,255)",
                        }}
                    >
                        {comments.map((comment) => (
                            <Comment comment={comment} key={comment?._id} />
                        ))}
                    </Paper>
                )}
            </Grid>
        </div>
    );
};

export default Post;
