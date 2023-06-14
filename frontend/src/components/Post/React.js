import {
    List,
    Badge,
    Button,
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
import { useUser, useFriendRequest } from "../../hooks";
import { UIContext, PostContext, UserContext } from "../../App";

const LikePost = ({ post }) => {
    const {
        uiDispatch,
        uiState: { darkMode },
    } = useContext(UIContext);
    const { postDispatch } = useContext(PostContext);
    const {
        userState: { currentUser, sendedFriendRequests },
    } = useContext(UserContext);

    const [react, setReact] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [usersReact, setUsersReact] = useState([]);

    const { handleUnfriend, handleBlockUser, handleUnblockUser } = useUser();
    const { handleSendFriendRequest, handleCancelFriendRequest } = useFriendRequest();

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

    const ButtonGroup = ({ user }) => (
        <>
            {currentUser?.friends.find((friend) => friend._id === user._id) ? (
                <Button
                    variant="contained"
                    style={{
                        color: "white",
                        margin: "10px",
                        minWidth: "80px",
                        fontSize: "10px",
                        background: "rgb(108,117,125)",
                    }}
                    onClick={() => handleUnfriend(user._id)}
                >
                    Unfriend
                </Button>
            ) : sendedFriendRequests?.find((item) => item.receiver._id === user._id) ? (
                <Button
                    variant="contained"
                    style={{
                        color: "white",
                        margin: "10px",
                        minWidth: "80px",
                        fontSize: "10px",
                        background: "rgb(255,193,7)",
                    }}
                    onClick={() =>
                        handleCancelFriendRequest(
                            sendedFriendRequests?.find((item) => item.receiver._id === user._id)._id
                        )
                    }
                >
                    Cancel
                </Button>
            ) : (
                <Button
                    variant="contained"
                    style={{
                        color: "white",
                        margin: "10px",
                        minWidth: "80px",
                        fontSize: "10px",
                        background: "rgb(0,123,255)",
                    }}
                    onClick={() => handleSendFriendRequest(user._id)}
                >
                    Add
                </Button>
            )}
            {currentUser.block_users.includes(user._id) ? (
                <Button
                    variant="contained"
                    style={{
                        color: "white",
                        margin: "10px",
                        minWidth: "80px",
                        fontSize: "10px",
                        background: "rgb(23,162,184)",
                    }}
                    onClick={() => handleUnblockUser(user._id)}
                >
                    Unblock
                </Button>
            ) : (
                <Button
                    variant="contained"
                    style={{
                        color: "white",
                        margin: "10px",
                        minWidth: "80px",
                        fontSize: "10px",
                        background: "rgb(220,53,69)",
                    }}
                    onClick={() => handleBlockUser(user._id)}
                >
                    Block
                </Button>
            )}
        </>
    );

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
                            Emoji{" "}
                            {react && <FontAwesomeIcon icon={react.icon} color={react.color} />}
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
                                    background: darkMode ? "rgb(58,59,60)" : "rgb(240,242,245)",
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
                                {user._id !== currentUser._id ? (
                                    <ButtonGroup user={user} />
                                ) : (
                                    <span style={{ margin: "0px 40px" }}>You</span>
                                )}
                            </div>
                        ))}
                    </List>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default LikePost;
