import React from "react";
import { Typography } from "@material-ui/core";

const PostSubContent = ({ post }) => {
    const bodyPost = post.body;

    const isContent = () => {
        return bodyPost?.location || bodyPost?.feelings || bodyPost?.tag_friends?.length;
    };

    return (
        <div>
            <Typography>
                <b>{isContent() && post.user.name}</b>
                {bodyPost?.feelings ? (
                    <>
                        &nbsp; is feeling <b>{bodyPost?.feelings}</b>
                    </>
                ) : null}
                {bodyPost?.tag_friends?.length ? (
                    <>
                        {` with `}
                        <b>
                            {bodyPost?.tag_friends.map((u) => (
                                <span key={u.id}> &nbsp;{u.name},</span>
                            ))}
                        </b>
                    </>
                ) : null}
                {bodyPost?.location ? (
                    <>
                        {` at `} <b>{bodyPost.location} </b>
                    </>
                ) : null}
            </Typography>
        </div>
    );
};

export default PostSubContent;
