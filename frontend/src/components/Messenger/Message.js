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
import React, { useState, Fragment, useContext } from "react";

import { UIContext, UserContext } from "../../App";

const useStyles = makeStyles(() => ({
    me: {
        float: "right",
        maxWidth: "50%",
        minWidth: "20%",
        padding: "8px 12px",
    },

    partner: {
        float: "left",
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

const Message = ({ message, setTextValue, setTextId }) => {
    const {
        uiState: { darkMode },
    } = useContext(UIContext);
    const {
        userState: { currentUser },
    } = useContext(UserContext);

    const classes = useStyles();
    const [isOpen, setIsOpen] = useState(null);
    const [isShowActions, setIsShowActions] = useState(false);

    const isSender = currentUser._id === message?.sender?._id;

    return (
        <Grid
            onMouseEnter={() => {
                setIsShowActions(true);
            }}
            onMouseLeave={() => {
                setIsShowActions(false);
            }}
            style={{
                marginTop: "16px",
                alignItems: "center",
                display: isSender && "flex",
                flexDirection: isSender && "row-reverse",
            }}
        >
            <Paper
                style={{
                    height: "fit-content",
                    color: darkMode && "#fff",
                    backgroundColor: isSender
                        ? darkMode
                            ? "rgb(1,133,243)"
                            : "rgb(220,245,198)"
                        : darkMode
                        ? "rgb(46,139,87)"
                        : "rgb(240,242,245)",
                }}
                className={isSender ? classes.me : classes.partner}
            >
                {message?.text && (
                    <Typography style={{ wordWrap: "break-word" }}>{message.text}</Typography>
                )}
                {message?.image && (
                    <CardMedia
                        controls
                        image={message.image}
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "contain",
                        }}
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
                <Fragment>
                    <IconButton onClick={(e) => setIsOpen(e.currentTarget)}>
                        <MoreHoriz />
                    </IconButton>

                    <Menu
                        id="message-action-menu"
                        anchorEl={isOpen}
                        open={Boolean(isOpen)}
                        onClose={() => setIsOpen(null)}
                    >
                        <MenuItem
                            onClick={() => {
                                setIsOpen(null);
                                setTextValue(message?.text);
                                setTextId(message._id);
                            }}
                        >
                            Edit {message?.text && message?.text}
                        </MenuItem>
                        <MenuItem
                            onClick={() => {
                                console.log({ _id: message._id, text: message.text });
                            }}
                        >
                            Delete
                        </MenuItem>
                    </Menu>
                </Fragment>
            )}
        </Grid>
    );
};

export default Message;
