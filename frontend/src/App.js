import io from "socket.io-client";
import jwtDecode from "jwt-decode";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";
import { Route, Switch, Redirect, BrowserRouter as Router } from "react-router-dom";
import React, { lazy, useMemo, Suspense, useEffect, useReducer, createContext } from "react";

import CallAPI from "./api";
import Loader from "./components/Loader";
import Navbar from "./components/Navbar/Navbar";
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

            socketIO.on("new-post", ({ data }) => {
                postDispatch({ type: "ADD_POST", payload: data });
            });

            socketIO.on("react-post", ({ data }) => {
                postDispatch({ type: "LIKE_UNLIKE_POST", payload: data });
            });

            socketIO.on("post-comment", ({ data }) => {
                postDispatch({ type: "ADD_POST_COMMENT", payload: data });
            });

            socketIO.on("react-comment", ({ data }) => {
                postDispatch({ type: "LIKE_UNLIKE_COMMENT", payload: data });
            });

            socketIO.on("new-message", ({ data }) => {
                chatDispatch({ type: "ADD_MESSAGE", payload: data });
            });

            socketIO.on("notification", ({ data }) => {
                uiDispatch({ type: "ADD_NOTIFICATION", payload: data });
            });

            return () => {
                socketIO.disconnect();
            };
        }
    }, [token]);

    useEffect(() => {
        const loadCurrentUser = async () => {
            if (token) {
                const decodeToken = jwtDecode(token);

                if (decodeToken.exp * 1000 < Date.now()) {
                    userDispatch({ type: "LOGOUT_USER" });
                } else {
                    try {
                        const { data: dataUser } = await CallAPI({ url: "/user", method: "GET" });
                        const { data: dataNotifi } = await CallAPI({
                            url: "/notification",
                            method: "GET",
                        });

                        if (dataUser) {
                            userDispatch({ type: "SET_CURRENT_USER", payload: dataUser });
                        }
                        if (dataUser) {
                            uiDispatch({ type: "SET_NOTIFICATIONS", payload: dataNotifi.rows });
                        }
                    } catch (err) {
                        uiDispatch({
                            type: "SET_MESSAGE",
                            payload: { text: err.message, display: true, color: "error" },
                        });
                    }
                }
            }
        };

        loadCurrentUser();
    }, [token]);

    const ProtectedRoute = ({ component: Component, ...rest }) => {
        const renderComponent = () => (token ? <Component /> : <Redirect to="/auth" />);

        return <Route {...rest} render={renderComponent} />;
    };

    return (
        <UIContext.Provider value={{ uiState, uiDispatch }}>
            <UserContext.Provider value={{ userState, userDispatch }}>
                <PostContext.Provider value={{ postState, postDispatch }}>
                    <ChatContext.Provider value={{ chatState, chatDispatch }}>
                        <ThemeProvider theme={theme}>
                            <Router>
                                {token && <Navbar />}
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
                                                exact
                                                path="/friends"
                                                component={Friends}
                                            />
                                            <ProtectedRoute
                                                exact
                                                path="/settings"
                                                component={Settings}
                                            />
                                            <ProtectedRoute
                                                exact
                                                component={Post}
                                                path="/post/:postId"
                                            />
                                            <ProtectedRoute
                                                exact
                                                path="/messenger"
                                                component={Messenger}
                                            />
                                            <ProtectedRoute
                                                exact
                                                component={Profile}
                                                path="/profile/:userId"
                                            />
                                            <Route
                                                exact
                                                path="/auth"
                                                render={() =>
                                                    token ? <Redirect to="/" /> : <Auth />
                                                }
                                            />
                                            <ProtectedRoute exact path="/" component={Home} />
                                        </Switch>
                                    </Suspense>
                                </div>
                                {uiState.message && <Notification />}
                            </Router>
                        </ThemeProvider>
                    </ChatContext.Provider>
                </PostContext.Provider>
            </UserContext.Provider>
        </UIContext.Provider>
    );
};

export default App;
