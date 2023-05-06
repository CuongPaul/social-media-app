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

import Sidebar from "../components/Sidebar";
import Posts from "../components/Post/Posts";
import useFetchPost from "../hooks/useFetchPost";
import DrawerBar from "../components/Navbar/DrawerBar";
import AvartarText from "../components/UI/AvartarText";
import { UIContext, PostContext, UserContext } from "../App";
import MyFriendLists from "../components/Friends/MyFriendLists";
import WritePostCard from "../components/Post/PostForm/WritePostCard";

const homeLeftItems = [
    { title: "Friends", img: "friends.png", to: "/friends" },
    { title: "Messenger", img: "messenger.png", to: "/messenger" },
];

const Home = () => {
    const { userState } = useContext(UserContext);
    const { postState } = useContext(PostContext);
    const { uiState, uiDispatch } = useContext(UIContext);

    const theme = useTheme();
    const match = useMediaQuery(theme.breakpoints.between(960, 1400));

    const { fetchPosts } = useFetchPost();

    useEffect(() => {
        uiDispatch({ type: "SET_DRAWER", payload: false });
        uiDispatch({ type: "SET_NAV_MENU", payload: true });

        const loadPosts = async () => {
            await fetchPosts();
        };

        loadPosts();

        return () => {
            uiDispatch({ type: "SET_DRAWER", payload: false });
            uiDispatch({ type: "SET_NAV_MENU", payload: false });
        };
    }, [fetchPosts, uiDispatch]);

    return (
        <div>
            {uiState.mdScreen ? (
                <Fragment>
                    <Sidebar
                        anchor="left"
                        boxShadow={false}
                        background={uiState.darkMode ? "rgb(24,25,26)" : "rgb(240,242,245)"}
                    >
                        <List>
                            <ListItem
                                button
                                component={Link}
                                to={`/profile/${userState.currentUser.id}`}
                            >
                                <ListItemIcon>
                                    {userState.currentUser.profile_pic ? (
                                        <Avatar
                                            style={{
                                                width: "50px",
                                                height: "50px",
                                            }}
                                        >
                                            <img
                                                alt="avatar"
                                                width="100%"
                                                height="100%"
                                                src={userState.currentUser.profile_pic}
                                            />
                                        </Avatar>
                                    ) : (
                                        <AvartarText
                                            text={userState.currentUser.name}
                                            bg={
                                                userState.currentUser.active ? "seagreen" : "tomato"
                                            }
                                        />
                                    )}
                                </ListItemIcon>
                                <ListItemText
                                    style={{ marginLeft: "6px" }}
                                    primary={userState.currentUser.name}
                                />
                            </ListItem>
                            {homeLeftItems.map((list, index) => (
                                <ListItem button key={index} component={Link} to={list.to}>
                                    <ListItemIcon>
                                        <Avatar
                                            alt={list.title}
                                            src={require(`../assets/${list.img}`)}
                                        />
                                    </ListItemIcon>
                                    <ListItemText primary={list.title} />
                                </ListItem>
                            ))}
                        </List>
                    </Sidebar>
                    <Sidebar
                        anchor="right"
                        background={!uiState.darkMode ? "rgb(240,242,245)" : "rgb(24,25,26)"}
                        boxShadow={false}
                        drawerWidth={380}
                    >
                        <MyFriendLists />
                    </Sidebar>
                </Fragment>
            ) : (
                <DrawerBar>
                    <MyFriendLists />
                </DrawerBar>
            )}

            <div
                style={{
                    maxWidth: uiState.mdScreen ? (match ? "45vw" : "38vw") : "100vw",
                    margin: "auto",
                    paddingTop: "100px",
                    paddingBottom: "100px",
                    minHeight: "100vh",
                }}
            >
                <WritePostCard user={userState.currentUser} />

                <Posts posts={postState.posts.filter((item) => item.privacy === "Public")} />
            </div>
        </div>
    );
};

export default Home;
