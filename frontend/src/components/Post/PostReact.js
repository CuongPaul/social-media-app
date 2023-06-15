import {
    List,
    Badge,
    Dialog,
    ListItem,
    CardHeader,
    IconButton,
    Typography,
    ListItemIcon,
    ListItemText,
    DialogContent,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import {
    faAngry,
    faHeart,
    faSadCry,
    faSurprise,
    faThumbsUp,
    faLaughSquint,
} from "@fortawesome/free-solid-svg-icons";
import { Close } from "@material-ui/icons";
import React, { useState, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import callApi from "../../api";
import AvatarIcon from "../UI/AvatarIcon";
import ButtonGroupUserActions from "../ButtonGroupUserActions";
import { UIContext, PostContext, UserContext } from "../../App";

const PostReact = ({ post }) => {
    const {
        uiDispatch,
        uiState: { darkMode },
    } = useContext(UIContext);
    const {
        userState: { currentUser },
    } = useContext(UserContext);
    const { postDispatch } = useContext(PostContext);

    const [react, setReact] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [usersReact, setUsersReact] = useState([]);

    const handleReactPost = async (type) => {
        try {
            await callApi({
                method: "PUT",
                query: { key: type },
                url: `/post/react-post/${post?._id}`,
            });
            postDispatch({
                type: "REACT_POST",
                payload: { key: type, user: currentUser, post_id: post?._id },
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
                <div key={item.reactKey} style={{ margin: "0px 10px", position: "relative" }}>
                    <Badge
                        overlap="rectangular"
                        style={{
                            borderRadius: "50%",
                            backgroundColor: "rgb(169,169,169)",
                        }}
                        badgeContent={
                            post?.react[item.reactKey]?.length && (
                                <h4
                                    onClick={() => {
                                        setReact({ icon: item.icon, color: item.color });
                                        setUsersReact(post?.react[item.reactKey]);
                                        setIsOpen(true);
                                    }}
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
                                        : `9+`}
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
                                left: "18px",
                                width: "10px",
                                height: "10px",
                                bottom: "-12px",
                                borderRadius: "50%",
                                position: "absolute",
                                display: "inline-block",
                                backgroundColor: "rgb(63,162,76)",
                            }}
                        />
                    )}
                </div>
            ))}
            <Dialog fullWidth open={isOpen} onClose={() => setIsOpen(false)}>
                <CardHeader
                    action={
                        <IconButton onClick={() => setIsOpen(false)}>
                            <Close />
                        </IconButton>
                    }
                    subheader={
                        <Typography
                            style={{ fontWeight: 800, fontSize: "20px", marginLeft: "10px" }}
                        >
                            Emoji <FontAwesomeIcon icon={react?.icon} color={react?.color} />
                        </Typography>
                    }
                />
                <DialogContent>
                    <List>
                        {usersReact.map((user) => (
                            <div
                                key={user._id}
                                style={{
                                    display: "flex",
                                    cursor: "pointer",
                                    borderRadius: "5px",
                                    alignItems: "center",
                                    marginBottom: "10px",
                                    backgroundColor: darkMode
                                        ? "rgb(58,59,60)"
                                        : "rgb(240,242,245)",
                                }}
                            >
                                <ListItem
                                    component={Link}
                                    to={`/profile/${user._id}`}
                                    onClick={() => setIsOpen(false)}
                                >
                                    <ListItemIcon>
                                        <AvatarIcon text={user.name} imageUrl={user.avatar_image} />
                                    </ListItemIcon>
                                    <ListItemText style={{ marginLeft: "6px" }}>
                                        <Typography
                                            style={{
                                                fontWeight: 700,
                                                fontSize: "17px",
                                                color: darkMode
                                                    ? "rgb(255,255,255)"
                                                    : "rgb(33,33,33)",
                                            }}
                                        >
                                            {user.name}
                                        </Typography>
                                    </ListItemText>
                                </ListItem>
                                {user._id === currentUser._id ? (
                                    <span style={{ margin: "0px 40px" }}>You</span>
                                ) : (
                                    <ButtonGroupUserActions userId={user._id} />
                                )}
                            </div>
                        ))}
                    </List>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default PostReact;
