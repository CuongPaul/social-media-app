import {
    Card,
    Grid,
    Paper,
    Button,
    Divider,
    CardHeader,
    Typography,
    CardContent,
} from "@material-ui/core";
import moment from "moment";
import { useParams } from "react-router-dom";
import React, { useEffect, useState, useContext } from "react";

import callApi from "../api";
import { UIContext, PostContext } from "../App";
import useFetchPost from "../hooks/useFetchPost";
import Comment from "../components/Comment/Comment";
import AvatarIcon from "../components/UI/AvatarIcon";
import PostAction from "../components/Post/PostAction";
import PostFooter from "../components/Post/PostFooter";
import SlideImage from "../components/Post/SlideImage";
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
    const [page, setPage] = useState(1);

    const { handleGetComments } = useFetchPost();

    useEffect(() => {
        (async () => {
            try {
                const { data } = await callApi({
                    method: "GET",
                    url: "/comment",
                    query: { post_id: postId },
                });
                postDispatch({ type: "SET_COMMENTS", payload: data.rows });

                const { data: postData } = await callApi({
                    method: "GET",
                    url: `/post/${postId}`,
                });
                postDispatch({ type: "SET_CURRENT_POST", payload: postData });
            } catch (err) {
                uiDispatch({
                    type: "SET_ALERT_MESSAGE",
                    payload: { display: true, color: "error", text: err.message },
                });
            }
        })();
    }, []);

    return postSelected ? (
        <div
            style={{
                display: "flex",
                padding: "30px",
                marginTop: "64px",
                height: `calc(100vh - 64px)`,
                justifyContent: "space-around",
            }}
        >
            <Grid item md={7}>
                <Card
                    style={{
                        backgroundColor: darkMode && "rgb(36,37,38)",
                    }}
                >
                    <CardHeader
                        action={<PostAction post={postSelected} />}
                        subheader={moment(postSelected.createdAt).fromNow()}
                        title={
                            <PostSubContent
                                postBody={postSelected.body}
                                username={postSelected.user.name}
                            />
                        }
                        avatar={
                            <AvatarIcon
                                text={postSelected.user.name}
                                imageUrl={postSelected.user.avatar_image}
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
                            {postSelected.text}
                        </Typography>
                    </CardContent>
                    {postSelected.images && <SlideImage images={postSelected.images} />}
                    <Divider />
                    <PostFooter post={postSelected} />
                </Card>
            </Grid>
            <Grid item md={4} sm={12} xs={12} style={{ marginBottom: "0px", overflowX: "auto" }}>
                <Paper
                    style={{
                        padding: "16px",
                        backgroundColor: darkMode && "rgb(36,37,38)",
                    }}
                >
                    <CommentInput postId={postSelected?._id} />
                </Paper>
                {comments && comments.length ? (
                    <>
                        {comments.map((comment) => (
                            <div key={comment?._id}>
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
                                onClick={() => {
                                    setPage(page + 1);
                                    handleGetComments(page + 1, postId);
                                }}
                            >
                                More Comments
                            </Button>
                        </div>
                    </>
                ) : null}
            </Grid>
        </div>
    ) : null;
};

export default Post;
