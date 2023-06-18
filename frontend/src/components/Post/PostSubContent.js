import React from "react";
import { Link } from "react-router-dom";
import { Typography } from "@material-ui/core";

const PostSubContent = ({ user, postBody }) => {
    return (
        <Typography>
            <b>
                <Link to={`/profile/${user?._id}`} style={{ textDecoration: "none" }}>
                    {user?.name}
                </Link>
            </b>
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
                            <b>
                                <Link
                                    to={`/profile/${friend._id}`}
                                    style={{ textDecoration: "none" }}
                                >
                                    {friend.name}
                                </Link>
                            </b>
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
