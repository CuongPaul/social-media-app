import {
  List,
  Badge,
  Dialog,
  Tooltip,
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
  faGrinStars,
  faLaughSquint,
} from "@fortawesome/free-solid-svg-icons";
import { Close } from "@material-ui/icons";
import React, { useState, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import callApi from "../../api";
import { AvatarIcon, ButtonGroupUserActions } from "../common";
import { UIContext, ChatContext, UserContext } from "../../App";

const MessageReact = ({ message }) => {
  const {
    uiDispatch,
    uiState: { darkMode },
  } = useContext(UIContext);
  const {
    userState: { currentUser },
  } = useContext(UserContext);
  const {
    chatDispatch,
    chatState: { chatRoomSelected },
  } = useContext(ChatContext);

  const [react, setReact] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [usersReact, setUsersReact] = useState(
    message.react ? message?.react["like"] : []
  );

  const isSender = currentUser._id === message?.sender?._id;

  const handleReactMessage = async (type) => {
    try {
      await callApi({
        method: "PUT",
        url: `/message/react-message/${message?._id}`,
        query: { key: type, chat_room_id: chatRoomSelected._id },
      });

      chatDispatch({
        type: "REACT_MESSAGE",
        payload: { key: type, user: currentUser, message_id: message?._id },
      });
    } catch (err) {
      uiDispatch({
        type: "SET_ALERT_MESSAGE",
        payload: { display: true, color: "error", text: err.message },
      });
    }
  };

  if (message && !message.react) {
    message.react = {
      sad: [],
      wow: [],
      like: [],
      love: [],
      haha: [],
      angry: [],
    };
  }

  const TooltipTitle = () => {
    return (
      <div
        style={{
          height: "50px",
          display: "flex",
          justifyContent: "space-evenly",
        }}
      >
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
            style={{ margin: "0px 5px", position: "relative" }}
          >
            <Badge
              overlap="rectangular"
              style={{
                padding: "5px",
                borderRadius: "50%",
                backgroundColor: "rgb(255,255,255)",
              }}
              badgeContent={
                message?.react[item.reactKey]?.length && (
                  <h4
                    onClick={() => {
                      setReact({
                        icon: item.icon,
                        color: item.color,
                      });
                      setUsersReact(message?.react[item.reactKey]);
                      setIsOpen(true);
                    }}
                    style={{
                      top: "-7px",
                      right: "5px",
                      width: "17px",
                      height: "17px",
                      cursor: "pointer",
                      lineHeight: "17px",
                      borderRadius: "50%",
                      textAlign: "center",
                      position: "absolute",
                      color: "rgb(255,255,255)",
                      backgroundColor: "rgb(244,67,54)",
                    }}
                  >
                    {message?.react[item.reactKey]?.length < 10
                      ? message?.react[item.reactKey]?.length
                      : `9+`}
                  </h4>
                )
              }
            >
              <IconButton
                style={{ width: "25px", height: "25px" }}
                onClick={() => handleReactMessage(item.reactKey)}
              >
                <FontAwesomeIcon icon={item.icon} color={item.color} />
              </IconButton>
            </Badge>
            {message?.react[item.reactKey].find(
              (item) => item?._id === currentUser?._id
            ) && (
              <span
                style={{
                  left: "13px",
                  width: "10px",
                  height: "10px",
                  bottom: "0px",
                  borderRadius: "50%",
                  position: "absolute",
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

  return (
    <div
      style={{
        bottom: "-10px",
        position: "absolute",
        left: isSender && "-10px",
        right: !isSender && "-14px",
      }}
    >
      <Tooltip interactive title={<TooltipTitle />}>
        <Badge
          max={999}
          color="error"
          overlap="rectangular"
          badgeContent={["like", "love", "haha", "wow", "sad", "angry"].reduce(
            (acc, cur) => {
              return acc + message.react[cur].length;
            },
            0
          )}
        >
          <IconButton
            size="small"
            style={{ cursor: "pointer", backgroundColor: "rgb(169,169,169)" }}
          >
            <FontAwesomeIcon icon={faGrinStars} color={"rgb(66,159,40)"} />
          </IconButton>
        </Badge>
      </Tooltip>
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
                        color: darkMode ? "rgb(255,255,255)" : "rgb(33,33,33)",
                      }}
                    >
                      {user.name}
                    </Typography>
                  </ListItemText>
                </ListItem>
                {user._id === currentUser?._id ? (
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

export default MessageReact;
