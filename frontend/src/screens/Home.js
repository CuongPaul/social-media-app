import { Link } from "react-router-dom";
import React, { Fragment, useEffect, useContext } from "react";
import { List, Avatar, ListItem, ListItemIcon, ListItemText } from "@material-ui/core";

import callApi from "../api";
import Sidebar from "../components/Sidebar";
import Posts from "../components/Post/Posts";
import { UIContext, UserContext, PostContext } from "../App";
import PostBar from "../components/Post/PostBar";
import AvatarIcon from "../components/UI/AvatarIcon";
import FriendsOnlineList from "../components/Friends/FriendsOnlineList";

const leftSidebarItems = [
    { id: "friends", title: "Friends", path: "/friends", icon: "friends.png" },
    { id: "messenger", title: "Messenger", path: "/messenger", icon: "messenger.png" },
];

const Home = () => {
    const {
        uiDispatch,
        uiState: { darkMode },
    } = useContext(UIContext);
    const {
        postDispatch,
        postState: { posts },
    } = useContext(PostContext);
    const {
        userState: { currentUser },
    } = useContext(UserContext);

    useEffect(() => {
        (async () => {
            try {
                const { data } = await callApi({ url: "/post", method: "GET" });

                postDispatch({ type: "SET_POSTS", payload: data.rows });
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
                <List style={{ marginLeft: "10px" }}>
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
                        <ListItemText style={{ marginLeft: "5px" }} primary={currentUser?.name} />
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
                                <Avatar alt={item.title} src={require(`../assets/${item.icon}`)} />
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
                backgroundColor={darkMode ? "rgb(24,25,26)" : "rgb(240,242,245)"}
            >
                <FriendsOnlineList />
            </Sidebar>
        </Fragment>
    );
};

export default Home;
