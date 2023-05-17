import { Link } from "react-router-dom";
import React, { Fragment, useEffect, useContext } from "react";
import { List, Avatar, ListItem, ListItemIcon, ListItemText } from "@material-ui/core";

import callApi from "../api";
import Sidebar from "../components/Sidebar";
import Posts from "../components/Post/Posts";
import AvatarIcon from "../components/UI/AvatarIcon";
import FriendList from "../components/Friends/FriendList";
import { UIContext, PostContext, UserContext } from "../App";
import ChatRoomList from "../components/Friends/ChatRoomList";
import WritePostCard from "../components/Post/PostBar";

const leftSidebarItems = [
    { id: "friends", title: "Friends", path: "/friends", icon: "friends.png" },
    { id: "messenger", title: "Messenger", path: "/messenger", icon: "messenger.png" },
];

const Home = () => {
    const { userState } = useContext(UserContext);
    const { postDispatch } = useContext(PostContext);
    const { uiState, uiDispatch } = useContext(UIContext);

    useEffect(() => {
        (async () => {
            try {
                const { data } = await callApi({ url: "/post", method: "GET" });
                postDispatch({ type: "SET_POSTS", payload: data.rows });
            } catch (err) {
                uiDispatch({
                    type: "SET_NOTIFICATION",
                    payload: { display: true, color: "error", text: err.message },
                });
            }
        })();
    }, []);

    return userState.currentUser ? (
        <Fragment>
            <div>
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
                <Sidebar
                    anchor="right"
                    boxShadow={false}
                    backgroundColor={uiState.darkMode ? "rgb(24,25,26)" : "rgb(240,242,245)"}
                >
                    <FriendList />
                    <ChatRoomList />
                </Sidebar>
            </div>
            <div
                style={{
                    margin: "auto",
                    maxWidth: "45vw",
                    minHeight: "100vh",
                    paddingTop: "100px",
                    paddingBottom: "100px",
                }}
            >
                <WritePostCard user={userState.currentUser} />
                <Posts />
            </div>
        </Fragment>
    ) : null;
};

export default Home;
