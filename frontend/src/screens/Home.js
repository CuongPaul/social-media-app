import {
    List,
    Avatar,
    ListItem,
    useTheme,
    ListItemText,
    ListItemIcon,
    useMediaQuery,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import React, { Fragment, useEffect, useContext } from "react";

import callApi from "../api";
import Sidebar from "../components/Sidebar";
import Posts from "../components/Post/Posts";
import AvartarText from "../components/UI/AvartarText";
import { UIContext, PostContext, UserContext } from "../App";
import FriendList from "../components/Friends/FriendList";
import WritePostCard from "../components/Post/PostForm/WritePostCard";

const homeLeftItems = [
    { id: "friends-item", title: "Friends", img: "friends.png", to: "/friends" },
    { id: "messenger-item", ttitle: "Messenger", img: "messenger.png", to: "/messenger" },
];

const Home = () => {
    const { userState } = useContext(UserContext);
    const { uiState, uiDispatch } = useContext(UIContext);
    const { postState, postDispatch } = useContext(PostContext);

    const theme = useTheme();
    const match = useMediaQuery(theme.breakpoints.between(960, 1400));

    useEffect(() => {
        uiDispatch({ type: "SET_DRAWER", payload: false });
        uiDispatch({ type: "SET_NAV_MENU", payload: true });

        const loadPosts = async () => {
            try {
                const { data, message } = await callApi({ method: "GET", url: "/post" });
                postDispatch({
                    type: "SET_POSTS",
                    payload: data.rows,
                });
            } catch (err) {
                uiDispatch({
                    type: "SET_NOTIFICATION",
                    payload: { display: true, color: "error", text: err.message },
                });
            }
        };

        loadPosts();

        return () => {
            uiDispatch({ type: "SET_DRAWER", payload: false });
            uiDispatch({ type: "SET_NAV_MENU", payload: false });
        };
    }, []);

    return userState.currentUser ? (
        <Fragment>
            <div>
                <Sidebar
                    anchor="left"
                    boxShadow={false}
                    background={uiState.darkMode ? "rgb(24,25,26)" : "rgb(240,242,245)"}
                >
                    <List>
                        <ListItem
                            button
                            component={Link}
                            to={`/profile/${userState.currentUser._id}`}
                        >
                            <ListItemIcon>
                                {userState.currentUser.avatar_image ? (
                                    <Avatar style={{ width: "50px", height: "50px" }}>
                                        <img
                                            alt="avatar"
                                            width="100%"
                                            height="100%"
                                            src={userState.currentUser.avatar_image}
                                        />
                                    </Avatar>
                                ) : (
                                    <AvartarText
                                        text={userState.currentUser.name}
                                        background={
                                            userState.currentUser.is_active ? "seagreen" : "tomato"
                                        }
                                    />
                                )}
                            </ListItemIcon>
                            <ListItemText
                                style={{ marginLeft: "6px" }}
                                primary={userState.currentUser.name}
                            />
                        </ListItem>
                        {homeLeftItems.map((item) => (
                            <ListItem button key={item.id} component={Link} to={item.to}>
                                <ListItemIcon>
                                    <Avatar
                                        alt={item.title}
                                        src={require(`../assets/${item.img}`)}
                                    />
                                </ListItemIcon>
                                <ListItemText primary={item.title} />
                            </ListItem>
                        ))}
                    </List>
                </Sidebar>
                <Sidebar
                    anchor="right"
                    boxShadow={false}
                    drawerWidth={380}
                    background={uiState.darkMode ? "rgb(24,25,26)" : "rgb(240,242,245)"}
                >
                    <FriendList key="friend-list" />
                </Sidebar>
            </div>
            <div
                style={{
                    maxWidth: match ? "45vw" : "38vw",
                    margin: "auto",
                    paddingTop: "100px",
                    paddingBottom: "100px",
                    minHeight: "100vh",
                }}
            >
                <WritePostCard user={userState.currentUser} />

                <Posts />
            </div>
        </Fragment>
    ) : null;
};

export default Home;
