import React from "react";
import { Link } from "react-router-dom";
import { Grid, Button } from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-regular-svg-icons";

import LikePost from "./React";

const PostFooter = ({ post }) => {
    return (
        <div style={{ display: "flex", margin: "8px 16px" }}>
            <LikePost post={post} />
            <Button
                component={Link}
                to={`/post/${post._id}`}
                style={{ width: "100%" }}
                startIcon={<FontAwesomeIcon icon={faPaperPlane} />}
            >
                View
            </Button>
        </div>
    );
};

export default PostFooter;
