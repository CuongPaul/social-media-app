import io from "socket.io-client";
import jwtDecode from "jwt-decode";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";
import { Route, Switch, Redirect, BrowserRouter } from "react-router-dom";
import React, { lazy, useMemo, Suspense, useEffect, useReducer, createContext } from "react";

import callApi from "./api";
import Loader from "./components/Loader";
import Navbar from "./components/Navbar/Navbar";
import ProtectedRoute from "./utils/protected-route";
import Notification from "./components/UI/Notification";
import { UIReducer, initialUIState } from "./context/UIContext";
import { UserReducer, initialUserState } from "./context/UserContext";
import { PostReducer, initialPostState } from "./context/PostContext";
import { ChatReducer, initialChatState } from "./context/ChatContext";

export const UIContext = createContext();
export const UserContext = createContext();
export const PostContext = createContext();
export const ChatContext = createContext();

const Home = lazy(() => import("./screens/Home"));
const Auth = lazy(() => import("./screens/Auth"));
const Post = lazy(() => import("./screens/Post"));
const Friends = lazy(() => import("./screens/Friends"));
const Profile = lazy(() => import("./screens/Profile"));
const Settings = lazy(() => import("./screens/Settings"));
const Messenger = lazy(() => import("./screens/Messenger"));

const App = () => {
    const token = localStorage.getItem("token");

    const [uiState, uiDispatch] = useReducer(UIReducer, initialUIState);
    const [userState, userDispatch] = useReducer(UserReducer, initialUserState);
    const [postState, postDispatch] = useReducer(PostReducer, initialPostState);
    const [chatState, chatDispatch] = useReducer(ChatReducer, initialChatState);

    const theme = useMemo(
        () =>
            createTheme({
                active: { success: "rgb(63,162,76)" },
                palette: {
                    primary: { main: "rgb(1,133,243)" },
                    secondary: { main: "rgb(63,162,76)" },
                    type: uiState.darkMode ? "dark" : "light",
                },
            }),
        [uiState.darkMode]
    );

    useEffect(() => {
        if (token) {
            const socketIO = io(`${process.env.REACT_APP_BASE_API_URL}`);

            socketIO.on("friend-offline", ({ user_id }) => {
                userDispatch({ type: "FRIEND_OFFLINE", payload: user_id });
            });

            socketIO.on("friend-online", ({ user_id }) => {
                userDispatch({ type: "FRIEND_ONLINE", payload: user_id });
            });

            socketIO.on("friend-request-status", ({ sender }) => {
                userDispatch({ type: "ADD_FRIENDS_REQUEST_RECEIVED", payload: sender });
            });

            socketIO.on("sended-friend-request-cancel", ({ requestId }) => {
                userDispatch({ type: "REMOVE_FRIENDS_REQUEST_RECEIVED", payload: requestId });
            });

            socketIO.on("friend-request-accept-status", ({ user, request_id }) => {
                userDispatch({ type: "ADD_FRIEND", payload: user });
                userDispatch({ type: "REMOVE_FRIENDS_REQUEST_SENDED", payload: request_id });
                userDispatch({ type: "REMOVE_FRIENDS_REQUEST_RECEIVED", payload: request_id });
            });

            socketIO.on("received-friend-request-decline", ({ requestId }) => {
                userDispatch({ type: "REMOVE_FRIENDS_REQUEST_SENDED", payload: requestId });
            });

            socketIO.on("new-post", (data) => {
                postDispatch({ type: "ADD_POST", payload: data });
            });

            socketIO.on("react-post", (data) => {
                postDispatch({ type: "LIKE_UNLIKE_POST", payload: data });
            });

            socketIO.on("post-comment", (data) => {
                postDispatch({ type: "ADD_POST_COMMENT", payload: data });
            });

            socketIO.on("react-comment", (data) => {
                postDispatch({ type: "LIKE_UNLIKE_COMMENT", payload: data });
            });

            socketIO.on("new-message", (data) => {
                chatDispatch({ type: "ADD_MESSAGE", payload: data });
            });

            socketIO.on("notification", (data) => {
                uiDispatch({ type: "ADD_NOTIFICATION", payload: data });
            });

            return () => {
                socketIO.disconnect();
            };
        }
    }, [token]);

    useEffect(() => {
        const getInfoCurrentUser = async () => {
            const { data } = await callApi({ url: "/user", method: "GET" });

            if (data) {
                userDispatch({ type: "SET_CURRENT_USER", payload: data });
            }
        };
        const getNotifications = async () => {
            try {
                const { data } = await callApi({ method: "GET", url: "/notification" });

                if (data) {
                    uiDispatch({ type: "SET_NOTIFICATIONS", payload: data.rows });
                }
            } catch (err) {
                uiDispatch({
                    type: "SET_NOTIFICATION",
                    payload: { text: err.message, display: true, color: "error" },
                });
            }
        };

        if (token) {
            const decodeToken = jwtDecode(token);

            if (decodeToken.exp * 1000 < Date.now()) {
                userDispatch({ type: "SIGN_OUT" });
            } else {
                try {
                    getNotifications();
                    getInfoCurrentUser();
                } catch (err) {
                    uiDispatch({
                        type: "SET_NOTIFICATION",
                        payload: { text: err.message, display: true, color: "error" },
                    });
                }
            }
        }
    }, [token]);

    return (
        <UIContext.Provider value={{ uiState, uiDispatch }}>
            <UserContext.Provider value={{ userState, userDispatch }}>
                <PostContext.Provider value={{ postState, postDispatch }}>
                    <ChatContext.Provider value={{ chatState, chatDispatch }}>
                        <ThemeProvider theme={theme}>
                            <BrowserRouter>
                                {token && <Navbar />}
                                {uiState.message && <Notification />}
                                <div
                                    style={{
                                        backgroundColor: uiState.darkMode
                                            ? "rgb(24,25,26)"
                                            : "rgb(240,242,245)",
                                    }}
                                >
                                    <Suspense fallback={<Loader />}>
                                        <Switch>
                                            <ProtectedRoute
                                                path="/messenger"
                                                component={Messenger}
                                            />
                                            <ProtectedRoute
                                                component={Profile}
                                                path="/profile/:userId"
                                            />
                                            <ProtectedRoute path="/home" component={Home} />
                                            <ProtectedRoute path="/friends" component={Friends} />
                                            <ProtectedRoute path="/settings" component={Settings} />
                                            <ProtectedRoute path="/post/:postId" component={Post} />
                                            <Route
                                                path="/"
                                                render={() =>
                                                    token ? <Redirect to="/home" /> : <Auth />
                                                }
                                            />
                                            <Route
                                                path="*"
                                                render={() => (
                                                    <Redirect to={token ? "/home" : "/"} />
                                                )}
                                            />
                                        </Switch>
                                    </Suspense>
                                </div>
                            </BrowserRouter>
                        </ThemeProvider>
                    </ChatContext.Provider>
                </PostContext.Provider>
            </UserContext.Provider>
        </UIContext.Provider>
    );
};

export default App;
