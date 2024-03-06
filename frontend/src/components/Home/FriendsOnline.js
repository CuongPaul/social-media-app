import {
  List,
  ListItem,
  IconButton,
  Typography,
  ListItemText,
  ListSubheader,
  ListItemAvatar,
} from "@material-ui/core";
import { Phone } from "@material-ui/icons";
import { useHistory } from "react-router-dom";
import React, { useState, useContext } from "react";

import { AvatarIcon, BadgeStyled } from "../common";
import { ChatContext, UserContext } from "../../App";

const Subheader = () => {
  return (
    <ListSubheader
      style={{
        zIndex: 2,
        paddingBottom: "10px",
        backgroundColor: "rgb(244 245 246)",
      }}
    >
      <Typography style={{ fontWeight: 800 }}>Friends online</Typography>
    </ListSubheader>
  );
};

const FriendsOnlineItem = ({ user }) => {
  const { chatDispatch } = useContext(ChatContext);

  const history = useHistory();
  const [isShowCallVideo, setIsShowCallVideo] = useState(false);

  const handleMakePhoneCall = (user) => {
    chatDispatch({
      type: "SET_PARTNER_VIDEO_CALL",
      payload: {
        _id: user._id,
        name: user.name,
        avatar_image: user.avatar_image,
      },
    });
    chatDispatch({ payload: true, type: "SET_IS_CALLER" });

    history.push("/video-call");
  };

  return (
    <ListItem
      button
      style={{
        display: "flex",
        borderRadius: "10px",
        justifyContent: "space-between",
      }}
      onMouseEnter={() => setIsShowCallVideo(true)}
      onMouseLeave={() => setIsShowCallVideo(false)}
    >
      <div
        style={{ display: "flex", alignItems: "center" }}
        onClick={() => history.push(`/profile/${user._id}`)}
      >
        <ListItemAvatar>
          <BadgeStyled isActive={true}>
            <AvatarIcon text={user.name} imageUrl={user.avatar_image} />
          </BadgeStyled>
        </ListItemAvatar>
        <ListItemText primary={user.name} style={{ marginLeft: "10px" }} />
      </div>
      {isShowCallVideo && (
        <IconButton color="primary" onClick={() => handleMakePhoneCall(user)}>
          <Phone />
        </IconButton>
      )}
    </ListItem>
  );
};

const FriendsOnline = () => {
  const { userState } = useContext(UserContext);

  return (
    <div style={{ height: "90vh", margin: "10px", overflow: "auto" }}>
      <List subheader={<Subheader />}>
        {userState?.friendsOnline?.map((user) => (
          <FriendsOnlineItem user={user} key={user._id} />
        ))}
      </List>
    </div>
  );
};

export default FriendsOnline;
