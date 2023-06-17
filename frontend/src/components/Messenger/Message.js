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
import { MoreHoriz } from "@material-ui/icons";
import React, { useState, useContext } from "react";

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

const Message = ({ message }) => {
    const {
        uiState: { darkMode },
    } = useContext(UIContext);
    const { chatDispatch } = useContext(ChatContext);
    const {
        userState: { currentUser },
    } = useContext(UserContext);

    const classes = useStyles();
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
                marginTop: "16px",
                display: isSender && "flex",
                alignItems: isSender && "center",
                flexDirection: isSender && "row-reverse",
            }}
        >
            <Paper
                style={{
                    color: darkMode && "rgb(255,255,255)",
                    backgroundColor: isSender
                        ? darkMode
                            ? "rgb(1,133,243)"
                            : "rgb(220,245,198)"
                        : darkMode
                        ? "rgb(46,139,87)"
                        : "rgb(240,242,245)",
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
