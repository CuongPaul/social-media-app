import { Link } from "react-router-dom";
import React, { Fragment, useState, useEffect, useContext } from "react";
import { List, Avatar, ListItem, ListItemIcon, ListItemText } from "@material-ui/core";

import callApi from "../api";
import Sidebar from "../components/Sidebar";
import Posts from "../components/Post/Posts";
import { UIContext, UserContext } from "../App";
import PostBar from "../components/Post/PostBar";
import AvatarIcon from "../components/UI/AvatarIcon";
import FriendList from "../components/Friends/FriendList";
import ChatRoomList from "../components/Friends/ChatRoomList";

const leftSidebarItems = [
    { id: "friends", title: "Friends", path: "/friends", icon: "friends.png" },
    { id: "messenger", title: "Messenger", path: "/messenger", icon: "messenger.png" },
];

const Home = () => {
    const { userState } = useContext(UserContext);
    const { uiState, uiDispatch } = useContext(UIContext);

    const [posts, setPosts] = useState([]);

    useEffect(() => {
        (async () => {
            try {
                const { data } = await callApi({ url: "/post", method: "GET" });
                setPosts(data.rows);
            } catch (err) {
                uiDispatch({
                    type: "SET_ALERT_MESSAGE",
                    payload: { display: true, color: "error", text: err.message },
                });
            }
        })();
    }, []);

    return userState.currentUser ? (
        <Fragment>
            <Sidebar
                boxShadow={false}
                backgroundColor={uiState.darkMode ? "rgb(24,25,26)" : "rgb(240,242,245)"}
            >
                <List style={{ marginLeft: "10px" }}>
                    <ListItem
                        button
                        component={Link}
                        style={{ borderRadius: "10px" }}
                        to={`/profile/${userState.currentUser._id}`}
                    >
                        <ListItemIcon>
                            <AvatarIcon
                                text={userState.currentUser.name}
                                imageUrl={userState.currentUser.avatar_image}
                            />
                        </ListItemIcon>
                        <ListItemText
                            style={{ marginLeft: "5px" }}
                            primary={userState.currentUser.name}
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
                                <Avatar alt="" src={require(`../assets/${item.icon}`)} />
                            </ListItemIcon>
                            <ListItemText primary={item.title} style={{ marginLeft: "5px" }} />
                        </ListItem>
                    ))}
                </List>
            </Sidebar>
            <div
                style={{
                    margin: "auto",
                    maxWidth: "45vw",
                    minHeight: "100vh",
                    paddingTop: "100px",
                    paddingBottom: "100px",
                }}
            >
                <PostBar />
                <Posts posts={posts} />
            </div>
            <Sidebar
                anchor="right"
                boxShadow={false}
                backgroundColor={uiState.darkMode ? "rgb(24,25,26)" : "rgb(240,242,245)"}
            >
                <FriendList />
                <ChatRoomList />
            </Sidebar>
        </Fragment>
    ) : null;
};

export default Home;
