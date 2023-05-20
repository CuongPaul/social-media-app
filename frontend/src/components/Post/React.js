import React, { useContext } from "react";
import {
    faSmile,
    // faFaceSadCry,
    // faFaceSurprise,
    // faThumbsUp,
    // faHeart,
    // faFaceLaughSquint,
    // faFaceAngry,
} from "@fortawesome/free-solid-svg-icons";
import { Badge, Tooltip, IconButton } from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import callApi from "../../api";
import AvatarIcon from "../UI/AvatarIcon";
import { PostContext, UIContext, UserContext } from "../../App";

const LikePost = ({ post }) => {
    const { uiDispatch } = useContext(UIContext);
    const { userState } = useContext(UserContext);
    const { postState, postDispatch } = useContext(PostContext);

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
                type: "SET_ALERT_MESSAGE",
                payload: { display: true, color: "error", text: err.message },
            });
        }
    };

    const TooltipTitle = () => {
        return (
            <div>
                {[0, 1, 2, 3, 4].map((item) => (
                    <AvatarIcon key={item} />
                ))}
            </div>
        );
    };

    return (
        <div style={{ display: "flex" }}>
            {[
                { icon: "faFaceSadCry", reactKey: "sad" },
                { icon: "faFaceSurprise", reactKey: "wow" },
                { icon: "faThumbsUp", reactKey: "like" },
                { icon: "faHeart", reactKey: "love" },
                { icon: "faFaceLaughSquint", reactKey: "haha" },
                { icon: "faFaceAngry", reactKey: "angry" },
            ].map((item) => (
                <div key={item.reactKey}>
                    <Tooltip arrow placement="bottom" title={<TooltipTitle />}>
                        <Badge
                            badgeContent={post?.react[item.reactKey]?.length}
                            overlap="rectangular"
                        >
                            <IconButton onClick={() => handleReactPost(item.reactKey)}>
                                <FontAwesomeIcon icon={faSmile} color="rgb(250,199,94)" />
                            </IconButton>
                        </Badge>
                    </Tooltip>
                    <span>
                        {post?.react[item.reactKey].find(
                            (item) => item._id === userState.currentUser._id
                        ) && "YOU"}
                    </span>
                </div>
            ))}
        </div>
    );
};

export default LikePost;
