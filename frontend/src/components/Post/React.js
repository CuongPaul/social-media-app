import React, { useContext } from "react";
import {
    faAngry,
    faHeart,
    faSadCry,
    faSurprise,
    faThumbsUp,
    faLaughSquint,
} from "@fortawesome/free-solid-svg-icons";
import { Badge, IconButton } from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import callApi from "../../api";
import { PostContext, UIContext, UserContext } from "../../App";

const LikePost = ({ post }) => {
    const {
        userState: { currentUser },
    } = useContext(UserContext);
    const { uiDispatch } = useContext(UIContext);
    const { postDispatch } = useContext(PostContext);

    const handleReactPost = async (type) => {
        try {
            await callApi({
                method: "PUT",
                query: { key: type },
                url: `/post/react-post/${post?._id}`,
            });

            postDispatch({
                type: "REACT_POST",
                payload: {
                    key: type,
                    user: currentUser,
                    post_id: post?._id,
                },
            });
        } catch (err) {
            uiDispatch({
                type: "SET_ALERT_MESSAGE",
                payload: { display: true, color: "error", text: err.message },
            });
        }
    };

    return (
        <div style={{ display: "flex" }}>
            {[
                { icon: faThumbsUp, reactKey: "like", color: "rgb(5,134,238)" },
                { icon: faHeart, reactKey: "love", color: "rgb(242,65,91)" },
                { icon: faLaughSquint, reactKey: "haha", color: "rgb(254,25,173)" },
                { icon: faSurprise, reactKey: "wow", color: "rgb(94,229,38)" },
                { icon: faSadCry, reactKey: "sad", color: "rgb(251,202,102)" },
                { icon: faAngry, reactKey: "angry", color: "rgb(248,134,20)" },
            ].map((item) => (
                <div
                    key={item.reactKey}
                    style={{
                        margin: "0px 10px",
                    }}
                >
                    <Badge
                        style={{
                            borderRadius: "50%",
                            backgroundColor: "rgb(169,169,169)",
                        }}
                        overlap="rectangular"
                        badgeContent={
                            post?.react[item.reactKey]?.length && (
                                <h4
                                    onClick={() =>
                                        console.log(`${item.reactKey}:`, post?.react[item.reactKey])
                                    }
                                    style={{
                                        top: "-8px",
                                        right: "4px",
                                        width: "22px",
                                        height: "22px",
                                        cursor: "pointer",
                                        lineHeight: "22px",
                                        borderRadius: "50%",
                                        textAlign: "center",
                                        position: "absolute",
                                        color: "rgb(255,255,255)",
                                        backgroundColor: "rgb(244,67,54)",
                                    }}
                                >
                                    {post?.react[item.reactKey]?.length < 10
                                        ? post?.react[item.reactKey]?.length
                                        : `${post?.react[item.reactKey]?.length}+`}
                                </h4>
                            )
                        }
                    >
                        <IconButton onClick={() => handleReactPost(item.reactKey)}>
                            <FontAwesomeIcon icon={item.icon} color={item.color} />
                        </IconButton>
                    </Badge>
                    {post?.react[item.reactKey].find((item) => item?._id === currentUser?._id) && (
                        <span
                            style={{
                                width: "10px",
                                height: "10px",
                                marginLeft: "19px",
                                borderRadius: "50%",
                                display: "inline-block",
                                backgroundColor: "rgb(63,162,76)",
                            }}
                        />
                    )}
                </div>
            ))}
        </div>
    );
};

export default LikePost;
