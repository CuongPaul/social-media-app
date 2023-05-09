import React, { Fragment, useContext } from "react";
import { Divider, Typography, CardContent } from "@material-ui/core";

import { UIContext } from "../../App";
import SlideImage from "./SlideImage";
import PostSubContent from "./PostSubContent";

const PostContent = ({ post }) => {
    const { uiState } = useContext(UIContext);

    const isContent = () => {
        const bodyPost = post.body;

        return bodyPost?.feelings || bodyPost?.tag_friends?.length || bodyPost?.location;
    };

    return (
        <Fragment>
            {isContent() && (
                <CardContent
                    style={{
                        marginBottom: "16px",
                        background: uiState.darkMode ? "rgb(76,76,76)" : "rgb(240,242,245)",
                        padding: "16px",
                    }}
                >
                    <PostSubContent post={post} />
                </CardContent>
            )}
            <CardContent>
                <Typography style={{ fontWeight: "400", fontSize: "16px", fontFamily: "fantasy" }}>
                    {post?.text}
                </Typography>
            </CardContent>
            {post?.images && <SlideImage images={post.images} />}
            <Divider />
        </Fragment>
    );
};

export default PostContent;
