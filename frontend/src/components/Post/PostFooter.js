import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@material-ui/core";
import { faComment } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import PostReact from "./PostReact";

const PostFooter = ({ post }) => {
    return (
        <div style={{ display: "flex", margin: "20px" }}>
            <PostReact post={post} />
            <Button
                component={Link}
                to={`/post/${post?._id}`}
                style={{ width: "100%" }}
                startIcon={<FontAwesomeIcon icon={faComment} />}
            >
                Comment
            </Button>
        </div>
    );
};

export default PostFooter;
