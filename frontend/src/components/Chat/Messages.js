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
import React, { Fragment, useContext, useEffect, useRef, useState } from "react";

import { ChatContext, UIContext, UserContext } from "../../App";
import callApi from "../../api";

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

const Messages = ({ setTextValue }) => {
    const { uiState } = useContext(UIContext);
    const { chatState } = useContext(ChatContext);
    const { userState } = useContext(UserContext);

    const classes = useStyles();
    const scrollDiv = useRef(null);
    const [isOpen, setIsOpen] = useState(null);
    const [messages, setMessages] = useState([]);

    const scrollToBottom = () => {
        scrollDiv.current.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
        (async () => {
            const { data } = await callApi({
                url: `/message/chat-room/${chatState.selectedFriend._id}`,
                method: "GET",
            });
        })();
    }, [chatState.messages.length]);

    return (
        <Grid container>
            {chatState?.messages?.length
                ? chatState?.messages?.map((message) => (
                      <Fragment key={message._id}>
                          {userState.currentUser._id !== message.sender._id ? (
                              <Grid item xs={12} md={12} sm={12}>
                                  <Paper
                                      className={classes.partner}
                                      style={{
                                          backgroundColor: uiState.darkMode
                                              ? "seagreen"
                                              : "rgb(240,242,245)",
                                          color: uiState.darkMode && "#fff",
                                      }}
                                  >
                                      {message.text && (
                                          <Typography style={{ wordWrap: "break-word" }}>
                                              {message.text}
                                          </Typography>
                                      )}
                                      {message.image && (
                                          <CardMedia
                                              component={
                                                  message.image.split(".").pop().substring(0, 3) ===
                                                  "mp4"
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
                                          {moment(message.createdAt).fromNow()}
                                      </Typography>
                                  </Paper>
                              </Grid>
                          ) : (
                              <Grid
                                  item
                                  md={12}
                                  xs={12}
                                  sm={12}
                                  style={{
                                      marginTop: "16px",
                                      display: "flex",
                                      flexDirection: "row-reverse",
                                  }}
                              >
                                  <Paper
                                      className={classes.me}
                                      style={{
                                          backgroundColor: uiState.darkMode
                                              ? "rgb(1,133,243)"
                                              : "rgb(220,245,198)",
                                          color: uiState.darkMode && "#fff",
                                      }}
                                  >
                                      {message.text && (
                                          <Typography style={{ wordWrap: "break-word" }}>
                                              {message.text}
                                          </Typography>
                                      )}
                                      {message.image && (
                                          <CardMedia
                                              component={
                                                  message.image.split(".").pop().substring(0, 3) ===
                                                  "mp4"
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
                                      <Typography
                                          className={classes.date}
                                          style={{ color: uiState.darkMode ? "#fff" : "#00000099" }}
                                      >
                                          {moment(message.createdAt).fromNow()}
                                      </Typography>
                                  </Paper>
                                  <Fragment key={message._id}>
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
                                                  setTextValue(message.text);
                                              }}
                                          >
                                              Edit {message.text && message.text}
                                          </MenuItem>
                                          <MenuItem
                                              onClick={() => {
                                                  // deleteMessage(message.id).then((res) => {
                                                  //   if (res.data.message === "success") {
                                                  //     const newComments = postState.post.comments.filter(item => message.id !== item.id);
                                                  //     postDispatch({ type: 'DELETE_MESSAGE', payload: newComments })
                                                  //   }
                                                  // })
                                              }}
                                          >
                                              Delete
                                          </MenuItem>
                                      </Menu>
                                  </Fragment>
                              </Grid>
                          )}
                      </Fragment>
                  ))
                : null}
            <div ref={scrollDiv} />
        </Grid>
    );
};

export default Messages;
