import React, {
    lazy,
    useMemo,
    Fragment,
    Suspense,
    useEffect,
    useReducer,
    createContext,
} from "react";
import io from "socket.io-client";
import jwtDecode from "jwt-decode";
import { Alert } from "@material-ui/lab";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";
import { Snackbar, useTheme, useMediaQuery } from "@material-ui/core";
import { Route, Switch, Redirect, BrowserRouter as Router } from "react-router-dom";

import Loader from "./components/Loader";
import Navbar from "./components/Navbar/Navbar";
import ProtectedRoute from "./utils/protected-route";
import BottomNav from "./components/Navbar/BottomNav";
import { getCurrentUser } from "./services/UserServices";
import { initialUIState, UIReducer } from "./context/UIContext";
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
    const token = localStorage.token && JSON.parse(localStorage.token);
    const [uiState, uiDispatch] = useReducer(UIReducer, initialUIState);
    const [userState, userDispatch] = useReducer(UserReducer, initialUserState);
    const [postState, postDispatch] = useReducer(PostReducer, initialPostState);
    const [chatState, chatDispatch] = useReducer(ChatReducer, initialChatState);

    const theme = useTheme();
    const mdScreen = useMediaQuery(theme.breakpoints.up("md"));
    const Theme = useMemo(
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
        uiDispatch({ type: "SET_USER_SCREEN", payload: mdScreen });
    }, [mdScreen]);

    useEffect(() => {
        const loadCurrentUser = async () => {
            if (token) {
                const decodeToken = jwtDecode(token);

                if (decodeToken.exp * 1000 > Date.now()) {
                    userDispatch({ type: "LOGOUT_USER" });
                } else {
                    const { data } = await getCurrentUser();

                    if (data) {
                        userDispatch({
                            payload: data,
                            type: "SET_CURRENT_USER",
                        });

                        uiDispatch({
                            payload: data,
                            type: "SET_NOTIFICATIONS",
                        });
                    }
                }
            }
        };

        function loadRecentAccounts() {
            const accounts = localStorage.accounts ? JSON.parse(localStorage.accounts) : [];
            userDispatch({ type: "RECENT_ACCOUNTS", payload: accounts });
        }

        loadCurrentUser();
        loadRecentAccounts();
    }, [token]);

    useEffect(() => {
        if (userState.isLoggedIn) {
            const socketIO = io(`${process.env.REACT_APP_BASE_API_URL}`);

            userDispatch({ type: "SET_SOCKETIO", payload: socketIO });

            socketIO.on("connect", () => console.log("Ta Cuong"));

            socketIO.on("user-offline", ({ user_id }) => {
                userDispatch({ type: "FRIEND_OFFLINE", payload: user_id });
            });

            socketIO.on("user-online", ({ user_id }) => {
                userDispatch({ type: "FRIEND_ONLINE", payload: user_id });
            });

            socketIO.on("friend-request-status", ({ sender }) => {
                userDispatch({
                    type: "ADD_FRIENDS_REQUEST_RECEIVED",
                    payload: sender,
                });
            });

            socketIO.on("sended-friend-request-cancel", ({ requestId }) => {
                userDispatch({
                    type: "REMOVE_FRIENDS_REQUEST_RECEIVED",
                    payload: requestId,
                });
            });

            socketIO.on("friend-request-accept-status", ({ user, request_id }) => {
                userDispatch({
                    type: "ADD_FRIEND",
                    payload: user,
                });
                userDispatch({
                    type: "REMOVE_FRIENDS_REQUEST_RECEIVED",
                    payload: request_id,
                });
                userDispatch({
                    type: "REMOVE_FRIENDS_REQUEST_SENDED",
                    payload: request_id,
                });
            });

            socketIO.on("received-friend-request-decline", ({ requestId }) => {
                userDispatch({
                    type: "REMOVE_FRIENDS_REQUEST_SENDED",
                    payload: requestId,
                });
            });

            socketIO.on("new-post", ({ data }) => {
                postDispatch({ type: "ADD_POST", payload: data });
            });

            socketIO.on("react-post", ({ data }) => {
                postDispatch({
                    type: "LIKE_UNLIKE_POST",
                    payload: data,
                });
            });

            socketIO.on("post-comment", ({ data }) => {
                postDispatch({ type: "ADD_POST_COMMENT", payload: data });
            });

            socketIO.on("react-comment", ({ data }) => {
                postDispatch({
                    type: "LIKE_UNLIKE_COMMENT",
                    payload: data,
                });
            });

            socketIO.on("new-message", ({ data }) => {
                chatDispatch({ type: "ADD_MESSAGE", payload: data });
            });

            socketIO.on("notification", ({ data }) => {
                uiDispatch({ type: "ADD_NOTIFICATION", payload: data });
            });

            return () => {
                socketIO.disconnect();
                userDispatch({ type: "SET_SOCKETIO", payload: null });
            };
        }
    }, [userState.isLoggedIn]);

    return (
        <UIContext.Provider value={{ uiState, uiDispatch }}>
            <UserContext.Provider value={{ userState, userDispatch }}>
                <PostContext.Provider value={{ postState, postDispatch }}>
                    <ChatContext.Provider value={{ chatState, chatDispatch }}>
                        <ThemeProvider theme={Theme}>
                            <Fragment>
                                <Router>
                                    {userState.isLoggedIn && <Navbar />}
                                    <div
                                        style={{
                                            backgroundColor: uiState.darkMode
                                                ? "rgb(24,25,26)"
                                                : "rgb(240,242,245)",
                                        }}
                                    >
                                        <Suspense fallback={<Loader />}>
                                            <Switch>
                                                <Route
                                                    exact
                                                    path="/"
                                                    render={(props) =>
                                                        userState.isLoggedIn ? (
                                                            <Redirect to="/home" />
                                                        ) : (
                                                            <Auth />
                                                        )
                                                    }
                                                />
                                                <ProtectedRoute
                                                    exact
                                                    path="/friends"
                                                    component={Friends}
                                                />
                                                <ProtectedRoute
                                                    exact
                                                    path="/messenger"
                                                    component={Messenger}
                                                />
                                                <ProtectedRoute
                                                    exact
                                                    path="/profile/:userId"
                                                    component={Profile}
                                                />
                                                <ProtectedRoute
                                                    exact
                                                    path="/home"
                                                    component={Home}
                                                />
                                                <ProtectedRoute
                                                    exact
                                                    path="/post/:postId"
                                                    component={Post}
                                                />
                                                <ProtectedRoute
                                                    exact
                                                    path="/settings"
                                                    component={Settings}
                                                />
                                            </Switch>
                                        </Suspense>
                                    </div>
                                    {uiState.message && (
                                        <Snackbar
                                            autoHideDuration={6000}
                                            open={uiState.message.display}
                                            style={{ color: "#fff", marginTop: 60 }}
                                            onClose={() =>
                                                uiDispatch({ type: "SET_MESSAGE", payload: null })
                                            }
                                            anchorOrigin={{ vertical: "top", horizontal: "center" }}
                                        >
                                            <Alert
                                                onClose={() =>
                                                    uiDispatch({
                                                        type: "SET_MESSAGE",
                                                        payload: null,
                                                    })
                                                }
                                                severity={uiState.message.color}
                                            >
                                                {uiState.message.text}
                                            </Alert>
                                        </Snackbar>
                                    )}
                                    {!uiState.mdScreen && userState.isLoggedIn ? (
                                        <BottomNav />
                                    ) : null}
                                </Router>
                            </Fragment>
                        </ThemeProvider>
                    </ChatContext.Provider>
                </PostContext.Provider>
            </UserContext.Provider>
        </UIContext.Provider>
    );
};

export default App;
