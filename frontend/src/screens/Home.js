import { Link } from "react-router-dom";
import React, { Fragment, useEffect, useContext } from "react";
import {
  List,
  Avatar,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@material-ui/core";

import callApi from "../api";
import { AvatarIcon } from "../components/common";
import { Posts, PostBar } from "../components/Post";
import { Sidebar, FriendsOnline } from "../components/Home";
import { UIContext, UserContext, PostContext } from "../App";

const leftSidebarItems = [
  { id: "friends", title: "Friends", path: "/friends", icon: "friends.png" },
  {
    id: "messenger",
    title: "Messenger",
    path: "/messenger",
    icon: "messenger.png",
  },
];

const Home = () => {
  const {
    postDispatch,
    postState: { posts },
  } = useContext(PostContext);
  const {
    userState: { currentUser },
  } = useContext(UserContext);
  const { uiDispatch } = useContext(UIContext);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await callApi({ url: "/post", method: "GET" });
        postDispatch({ payload: data, type: "SET_POSTS" });
      } catch (err) {
        uiDispatch({
          type: "SET_ALERT_MESSAGE",
          payload: { display: true, color: "error", text: err.message },
        });
      }
    })();
  }, []);

  return (
    <Fragment>
      <Sidebar>
        <List style={{ margin: "0px 10px" }}>
          <ListItem
            button
            component={Link}
            style={{ borderRadius: "10px" }}
            to={`/profile/${currentUser?._id}`}
          >
            <ListItemIcon>
              <AvatarIcon
                text={currentUser?.name}
                imageUrl={currentUser?.avatar_image}
              />
            </ListItemIcon>
            <ListItemText
              style={{ margin: "0px 5px" }}
              primary={currentUser?.name}
            />
          </ListItem>
          {leftSidebarItems.map((item) => (
            <ListItem
              button
              key={item.id}
              to={item.path}
              component={Link}
              style={{ borderRadius: "10px" }}
            >
              <ListItemIcon>
                <Avatar
                  alt={""}
                  src={require(`../assets/icons/${item.icon}`)}
                />
              </ListItemIcon>
              <ListItemText
                primary={item.title}
                style={{ margin: "0px 5px" }}
              />
            </ListItem>
          ))}
        </List>
      </Sidebar>
      <div
        style={{
          margin: "auto",
          maxWidth: "45vw",
          minHeight: "100vh",
          paddingTop: "80px",
          paddingBottom: "100px",
        }}
      >
        <PostBar />
        <Posts posts={posts} />
      </div>
      <Sidebar anchor="right">
        <FriendsOnline />
      </Sidebar>
    </Fragment>
  );
};

export default Home;
