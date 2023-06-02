import moment from "moment";
import React, { Fragment, useContext } from "react";
import { Card, Button, Divider, CardHeader, Typography, CardContent } from "@material-ui/core";

import PostAction from "./PostAction";
import PostFooter from "./PostFooter";
import SlideImage from "./SlideImage";
import { UIContext } from "../../App";
import AvatarIcon from "../UI/AvatarIcon";
import PostSubContent from "./PostSubContent";
import useFetchPost from "../../hooks/useFetchPost";

const Posts = ({ posts }) => {
    const { uiState } = useContext(UIContext);

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
                        action={<PostAction post={post} />}
                        subheader={moment(post.createdAt).fromNow()}
                        title={<PostSubContent postBody={post.body} username={post.user.name} />}
                        avatar={
                            <AvatarIcon text={post.user.name} imageUrl={post.user.avatar_image} />
                        }
                    />
                    <CardContent>
                        <Typography
                            style={{ fontWeight: "400", fontSize: "16px", fontFamily: "fantasy" }}
                        >
                            {post.text}
                        </Typography>
                    </CardContent>
                    {post?.images && <SlideImage images={post.images} />}
                    <Divider />
                    <PostFooter post={post} />
                </Card>
            ))}
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
