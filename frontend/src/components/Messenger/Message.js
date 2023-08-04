import {
    Menu,
    Grid,
    Paper,
    MenuItem,
    CardMedia,
    IconButton,
    makeStyles,
    Typography,
} from "@material-ui/core";
import moment from "moment";
import { useHistory } from "react-router-dom";
import { MoreHoriz } from "@material-ui/icons";
import React, { useState, useContext } from "react";

import { AvatarIcon } from "../common";
import MessageReact from "./MessageReact";
import { UIContext, ChatContext, UserContext } from "../../App";

const useStyles = makeStyles(() => ({
    reciver: {
        float: "left",
        maxWidth: "50%",
        minWidth: "20%",
        padding: "8px 12px",
    },

    sender: {
        float: "right",
        maxWidth: "50%",
        minWidth: "20%",
        padding: "8px 12px",
    },

    date: {
        display: "flex",
        fontSize: "10px",
        marginTop: "5px",
        justifyContent: "flex-end",
    },
}));

const Message = ({ message, isShowAvatar }) => {
    const {
        uiState: { darkMode },
    } = useContext(UIContext);
    const { chatDispatch } = useContext(ChatContext);
    const {
        userState: { currentUser },
    } = useContext(UserContext);

    const classes = useStyles();
    const history = useHistory();
    const [anchorEl, setAnchorEl] = useState(null);
    const [isShowActions, setIsShowActions] = useState(false);

    const isSender = currentUser._id === message?.sender?._id;

    const handleClickMessage = () => {
        setAnchorEl(null);

        chatDispatch({ payload: message, type: "SET_MESSAGE_SELECTED" });
    };

    return (
        <Grid
            onMouseEnter={() => setIsShowActions(true)}
            onMouseLeave={() => setIsShowActions(false)}
            style={{
                display: "flex",
                alignItems: "center",
                flexDirection: isSender && "row-reverse",
                marginTop: isShowAvatar ? "30px" : "6px",
            }}
        >
            {!isSender && (
                <div
                    style={{ marginRight: "10px", visibility: isShowAvatar ? "visible" : "hidden" }}
                >
                    <AvatarIcon
                        text={message.sender.name}
                        style={{ cursor: "pointer" }}
                        imageUrl={message.sender.avatar_image}
                        onClick={() => history.push(`/profile/${message.sender._id}`)}
                    />
                </div>
            )}
            <Paper
                style={{
                    position: "relative",
                    backgroundColor: isSender
                        ? darkMode
                            ? "rgb(1,133,243)"
                            : "rgb(220,245,198)"
                        : darkMode
                        ? "rgb(46,139,87)"
                        : "rgb(240,242,245)",
                    color: darkMode && "rgb(255,255,255)",
                }}
                className={isSender ? classes.sender : classes.reciver}
            >
                {message?.text && (
                    <Typography style={{ marginBottom: "10px", wordWrap: "break-word" }}>
                        {message.text}
                    </Typography>
                )}
                {message?.image && (
                    <CardMedia
                        controls
                        image={message.image}
                        component={
                            message?.image.split(".").pop().substring(0, 3) === "mp4"
                                ? "video"
                                : "img"
                        }
                    />
                )}
                <Typography className={classes.date}>
                    {moment(message?.createdAt).fromNow()}
                </Typography>
                {Boolean(
                    isShowActions ||
                        message.react?.like.length ||
                        message.react?.love.length ||
                        message.react?.haha.length ||
                        message.react?.wow.length ||
                        message.react?.sad.length ||
                        message.react?.wow.angry
                ) && <MessageReact message={message} />}
            </Paper>
            {isSender && isShowActions && (
                <div>
                    <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
                        <MoreHoriz />
                    </IconButton>
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={() => setAnchorEl(null)}
                    >
                        <MenuItem onClick={() => handleClickMessage()}>Edit</MenuItem>
                    </Menu>
                </div>
            )}
        </Grid>
    );
};

export default Message;
