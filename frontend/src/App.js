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
        const getCurrentUserInfo = async () => {
            try {
                const { data } = await callApi({ url: "/user", method: "GET" });

                if (data) {
                    userDispatch({ type: "SET_CURRENT_USER", payload: data });
                }
            } catch (err) {
                uiDispatch({
                    type: "SET_ALERT_MESSAGE",
                    payload: { text: err.message, display: true, color: "error" },
                });
            }
        };

        if (token) {
            getCurrentUserInfo();
        }
    }, []);

    useEffect(() => {
        if (userState.currentUser) {
            socketIO.current = io(`${process.env.REACT_APP_BASE_API_URL}`);

            socketIO.current.emit("client-connection", { user_id: userState.currentUser._id });

            socketIO.current.on("test-event", (data) => {
                console.log("data: ", data);
                console.log("socketId: ", socketIO.current.id);
            });

            window.addEventListener("beforeunload", () => {
                socketIO.current.emit("client-disconnect", { user_id: userState.currentUser._id });
            });
        }
    }, [userState.currentUser]);

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
                                            : "rgb(244,245,246)",
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
