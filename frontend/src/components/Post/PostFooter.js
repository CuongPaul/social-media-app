import { Link } from "react-router-dom";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Grid, Button } from "@material-ui/core";
import { faPaperPlane } from "@fortawesome/free-regular-svg-icons";

import LikePost from "./React";

const PostFooter = ({ post }) => {
    return (
        <div style={{ margin: "8px 16px" }}>
            <Grid container style={{ padding: "8px 0px" }}>
                <Grid item xs={6}>
                    <LikePost post={post} />
                </Grid>
                <Grid item xs={6}>
                    <Button
                        component={Link}
                        to={`/post/${post._id}`}
                        style={{ width: "100%" }}
                        startIcon={<FontAwesomeIcon icon={faPaperPlane} />}
                    >
                        View
                    </Button>
                </Grid>
            </Grid>
        </div>
    );
};

export default PostFooter;
