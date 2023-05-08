import { Button } from "@material-ui/core";
import React, { Fragment, useContext } from "react";
import {
    SentimentDissatisfied,
    TwoWheeler,
    ThumbUp,
    Favorite,
    EmojiEmotions,
    Error,
} from "@material-ui/icons";

import callApi from "../../api";
import { PostContext, UIContext, UserContext } from "../../App";

const LikePost = ({ post }) => {
    const { uiDispatch } = useContext(UIContext);
    const { userState } = useContext(UserContext);
    const { postState, postDispatch } = useContext(PostContext);

    const isLiked = () => {
        return post?.react?.like.includes(userState.currentUser._id);
    };

    const handleReactPost = async (type) => {
        try {
            await callApi({
                method: "PUT",
                query: { key: type },
                url: `/post/react-post/${post._id}`,
            });
            const newPostReact = [...postState.posts];
            for (const item of newPostReact) {
                if (item._id === post._id) {
                    const abc = item.react[type].findIndex(
                        (ele) => ele._id === userState.currentUser._id
                    );

                    if (abc == -1) {
                        const pushItem = {
                            avatar_image: userState.currentUser.avatar_image,
                            _id: userState.currentUser._id,
                            name: userState.currentUser.name,
                        };
                        item.react[type].push(pushItem);
                    } else {
                        item.react[type].splice(abc, 1);
                    }
                }
            }

            postDispatch({
                type: "REACT_POST",
                payload: newPostReact,
            });
        } catch (err) {
            uiDispatch({
                type: "SET_NOTIFICATION",
                payload: { display: true, color: "error", text: err.message },
            });
        }
    };

    return (
        <Fragment>
            <Button
                onClick={() => handleReactPost("sad")}
                style={{ width: "100%" }}
                color={isLiked() ? "primary" : "inherit"}
                startIcon={<SentimentDissatisfied />}
            >
                ({post?.react?.sad.length})
                {post?.react?.sad.find((item) => item._id === userState.currentUser._id) && "YOU"}
            </Button>
            <Button
                onClick={() => handleReactPost("wow")}
                style={{ width: "100%" }}
                color={isLiked() ? "primary" : "inherit"}
                startIcon={<TwoWheeler />}
            >
                ({post?.react?.wow.length})
                {post?.react?.wow.find((item) => item._id === userState.currentUser._id) && "YOU"}
            </Button>
            <Button
                onClick={() => handleReactPost("like")}
                style={{ width: "100%" }}
                color={isLiked() ? "primary" : "inherit"}
                startIcon={<ThumbUp />}
            >
                ({post?.react?.like.length})
                {post?.react?.like.find((item) => item._id === userState.currentUser._id) && "YOU"}
            </Button>
            <Button
                onClick={() => handleReactPost("love")}
                style={{ width: "100%" }}
                color={isLiked() ? "primary" : "inherit"}
                startIcon={<Favorite />}
            >
                ({post?.react?.love.length})
                {post?.react?.love.find((item) => item._id === userState.currentUser._id) && "YOU"}
            </Button>
            <Button
                onClick={() => handleReactPost("haha")}
                style={{ width: "100%" }}
                color={isLiked() ? "primary" : "inherit"}
                startIcon={<EmojiEmotions />}
            >
                ({post?.react?.haha.length})
                {post?.react?.haha.find((item) => item._id === userState.currentUser._id) && "YOU"}
            </Button>
            <Button
                onClick={() => handleReactPost("angry")}
                style={{ width: "100%" }}
                color={isLiked() ? "primary" : "inherit"}
                startIcon={<Error />}
            >
                ({post?.react?.angry.length})
                {post?.react?.angry.find((item) => item._id === userState.currentUser._id) && "YOU"}
            </Button>
        </Fragment>
    );
};

export default LikePost;
