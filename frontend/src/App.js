import React, {
    lazy,
    useRef,
    useMemo,
    Suspense,
    useEffect,
    useReducer,
    createContext,
} from "react";
import io from "socket.io-client";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";
import { Route, Switch, Redirect, BrowserRouter } from "react-router-dom";

import callApi from "./api";
import Navbar from "./components/Navbar";
import Loading from "./components/Loading";
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
    const socketIO = useRef();
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
        uiDispatch({
            type: "SET_DARK_MODE",
            payload: JSON.parse(localStorage.getItem("dark_mode")) || false,
        });
        userDispatch({
            type: "SET_RECENT_ACCOUNTS",
            payload: JSON.parse(localStorage.getItem("recent_accounts")) || [],
        });
    }, []);

    useEffect(() => {
        const getInitialData = async () => {
            try {
                const { data: friendsOnlineData } = await callApi({
                    method: "GET",
                    url: "/user/friends-online",
                });
                if (friendsOnlineData) {
                    userDispatch({ type: "SET_FRIENDS_ONLINE", payload: friendsOnlineData.rows });
                }

                const { data: currentUserData } = await callApi({ url: "/user", method: "GET" });
                if (currentUserData) {
                    userDispatch({ type: "SET_CURRENT_USER", payload: currentUserData });
                }

                const { data: sendedFriendRequestsData } = await callApi({
                    method: "GET",
                    url: "/friend-request/sended",
                });
                if (sendedFriendRequestsData) {
                    userDispatch({
                        type: "SET_SENDED_FRIEND_REQUEST",
                        payload: sendedFriendRequestsData.rows,
                    });
                }

                const { data: incommingFriendRequestsData } = await callApi({
                    method: "GET",
                    url: "/friend-request/received",
                });
                if (incommingFriendRequestsData) {
                    userDispatch({
                        type: "SET_INCOMMING_FRIEND_REQUEST",
                        payload: incommingFriendRequestsData.rows,
                    });
                }

                const { data: chatRoomsData } = await callApi({ method: "GET", url: "/chat-room" });
                if (chatRoomsData) {
                    chatDispatch({ type: "SET_CHATROOMS", payload: chatRoomsData.rows });
                }
            } catch (err) {
                uiDispatch({
                    type: "SET_ALERT_MESSAGE",
                    payload: { display: true, color: "error", text: err.message },
                });
            }
        };

        if (token) {
            getInitialData();
        }
    }, [userState.currentUser?._id]);

    useEffect(() => {
        if (userState.currentUser?._id) {
            socketIO.current = io(`${process.env.REACT_APP_BASE_API_URL}`);

            socketIO.current.emit("client-connection", {
                _id: userState.currentUser._id,
                name: userState.currentUser.name,
                friends_online: userState.friendsOnline,
                avatar_image: userState.currentUser.avatar_image,
            });

            socketIO.current.on("add-socket-for-user-online", ({ _id, socket }) => {
                userDispatch({ payload: { _id, socket }, type: "ADD_SOCKET_FOR_FRIEND_ONLINE" });
            });

            socketIO.current.on("user-online", ({ _id, name, sockets, avatar_image }) => {
                userDispatch({
                    type: "ADD_FRIEND_ONLINE",
                    payload: { _id, name, sockets, avatar_image },
                });
            });

            window.addEventListener("beforeunload", () => {
                socketIO.current.emit("client-disconnect", {
                    _id: userState.currentUser._id,
                    friends_online: userState.friendsOnline,
                });
            });

            socketIO.current.on("user-offline", (_id) => {
                userDispatch({ payload: _id, type: "REMOVE_FRIEND_ONLINE" });
            });

            socketIO.current.on("new-message", (data) => {
                const { chat_room, updatedAt, ...rest } = data;

                chatDispatch({
                    type: "INCREASE_UNSEND_MESSAGE",
                    payload: { message: rest, chatRoomId: chat_room },
                });
            });

            socketIO.current.on("change-admin-chatroom", (data) => {
                const { new_admin, notification, chat_room_id } = data;

                chatDispatch({
                    payload: { newAdmin: new_admin, chatRoomId: chat_room_id },
                    type: "SET_NEW_ADMIN",
                });
                uiDispatch({ payload: notification, type: "ADD_NOTIFICATION" });
            });

            socketIO.current.on("new-chatroom", (data) => {
                const { chat_room, notification } = data;

                chatDispatch({ payload: chat_room, type: "ADD_CHATROOM" });
                uiDispatch({ payload: notification, type: "ADD_NOTIFICATION" });
            });

            socketIO.current.on("delete-chatroom", (data) => {
                const { notification, chat_room_id } = data;

                uiDispatch({ payload: notification, type: "ADD_NOTIFICATION" });
                chatDispatch({ payload: chat_room_id, type: "REMOVE_CHATROOM" });
            });

            socketIO.current.on("update-chatroom", (data) => {
                const { chat_room, notification } = data;

                chatDispatch({ payload: chat_room, type: "UPDATE_CHATROOM" });
                uiDispatch({ payload: notification, type: "ADD_NOTIFICATION" });
            });

            socketIO.current.on("add-incomming-friend-request", (data) => {
                const { notification, friend_request } = data;

                uiDispatch({ payload: notification, type: "ADD_NOTIFICATION" });
                userDispatch({ payload: friend_request, type: "ADD_INCOMMING_FRIEND_REQUEST" });
            });

            socketIO.current.on("accept-friend-request", (data) => {
                const { notification, friend_request_id } = data;

                uiDispatch({ payload: notification, type: "ADD_NOTIFICATION" });
                userDispatch({ payload: friend_request_id, type: "ACCEPT_FRIEND_REQUEST" });
            });
        }
    }, [userState.currentUser?._id]);

    return (
        <UIContext.Provider value={{ uiState, socketIO, uiDispatch }}>
            <UserContext.Provider value={{ userState, userDispatch }}>
                <PostContext.Provider value={{ postState, postDispatch }}>
                    <ChatContext.Provider value={{ chatState, chatDispatch }}>
                        <ThemeProvider theme={theme}>
                            <BrowserRouter>
                                {token && <Navbar />}
                                {uiState.alert_message && <Notification />}
                                <div
                                    style={{
                                        backgroundColor: uiState.darkMode
                                            ? "rgb(24,25,26)"
                                            : "rgb(244,245,246)",
                                    }}
                                >
                                    <Suspense fallback={<Loading />}>
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
