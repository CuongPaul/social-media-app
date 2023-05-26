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
import React, { Fragment, useContext, useState } from "react";

import { UIContext, UserContext } from "../../App";

const useStyles = makeStyles(() => ({
    me: {
        padding: "8px",
        maxWidth: "60%",
        float: "right",
        marginTop: "16px",
    },

    partner: {
        maxWidth: "60%",
        margin: "auto",
        float: "left",
        padding: "8px",
        marginTop: "16px",
    },
    date: {
        fontSize: "12px",

        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        padding: "8px",
        margin: "auto",
    },
}));

const Message = ({ message, setTextValue, setTextId }) => {
    const { uiState } = useContext(UIContext);
    const {
        userState: { currentUser },
    } = useContext(UserContext);

    const classes = useStyles();

    const isSender = currentUser._id !== message?.sender?._id;

    const [isOpen, setIsOpen] = useState(null);

    return (
        <Grid
            item
            xs={12}
            md={12}
            sm={12}
            style={{
                marginTop: !isSender && "16px",
                display: !isSender && "flex",
                flexDirection: !isSender && "row-reverse",
            }}
        >
            <Paper
                className={isSender ? classes.partner : classes.me}
                style={{
                    backgroundColor: isSender
                        ? uiState.darkMode
                            ? "seagreen"
                            : "rgb(240,242,245)"
                        : uiState.darkMode
                        ? "rgb(1,133,243)"
                        : "rgb(220,245,198)",
                    color: uiState.darkMode && "#fff",
                }}
            >
                {message?.text && (
                    <Typography style={{ wordWrap: "break-word" }}>{message.text}</Typography>
                )}
                {message?.image && (
                    <CardMedia
                        component={
                            message?.image.split(".").pop().substring(0, 3) === "mp4"
                                ? "video"
                                : "img"
                        }
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "contain",
                        }}
                        image={message.image}
                        title="Paella dish"
                        controls
                    />
                )}
                <Typography className={classes.date}>
                    {moment(message?.createdAt).fromNow()}
                </Typography>
                {!isSender && (
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
                                    console.log(message.text);
                                }}
                            >
                                Delete
                            </MenuItem>
                        </Menu>
                    </Fragment>
                )}
            </Paper>
        </Grid>
    );
};

export default Message;
