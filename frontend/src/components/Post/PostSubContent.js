import React from "react";
import { Typography } from "@material-ui/core";

const PostSubContent = ({ postBody, username }) => {
    return (
        <Typography>
            <b>{username}</b>
            {postBody?.feelings ? (
                <>
                    {` is feeling `}
                    <b>{postBody.feelings}</b>
                </>
            ) : null}
            {postBody?.tag_friends?.length ? (
                <>
                    {" with "}
                    {postBody.tag_friends.map((friend, index) => (
                        <span key={index}>
                            <b>{friend.name}</b>
                            {index < postBody.tag_friends.length - 1 ? "and " : " "}
                        </span>
                    ))}
                </>
            ) : null}
            {postBody?.location ? (
                <>
                    {` at `}
                    <b>{postBody.location}</b>
                </>
            ) : null}
        </Typography>
    );
};

export default PostSubContent;
