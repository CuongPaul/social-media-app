import React, {
    lazy,
    useMemo,
    Fragment,
    Suspense,
    useEffect,
    useReducer,
    createContext,
} from "react";
import jwtDecode from "jwt-decode";
import { Alert } from "@material-ui/lab";
import { ThemeProvider } from "@material-ui/core/styles";
import { BrowserRouter as Router, Redirect, Route, Switch } from "react-router-dom";
import { Snackbar, useMediaQuery, useTheme, createMuiTheme } from "@material-ui/core";

import Loader from "./components/Loader";
import { handleListenEvent } from "./socket";
import Navbar from "./components/Navbar/Navbar";
import ProtectedRoute from "./utils/protected-route";
import BottomNav from "./components/Navbar/BottomNav";
import { fetchCurrentUser } from "./services/AuthService";
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

function App() {
    const [uiState, uiDispatch] = useReducer(UIReducer, initialUIState);
    const [userState, userDispatch] = useReducer(UserReducer, initialUserState);
    const [postState, postDispatch] = useReducer(PostReducer, initialPostState);
    const [chatState, chatDispatch] = useReducer(ChatReducer, initialChatState);

    const theme = useTheme();
    const mdScreen = useMediaQuery(theme.breakpoints.up("md"));
    const Theme = useMemo(
        () =>
            createMuiTheme({
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

    useEffect(async () => {
        const token = localStorage.token && JSON.parse(localStorage.token);
        const accounts = localStorage.accounts ? JSON.parse(localStorage.accounts) : [];

        userDispatch({ type: "RECENT_ACCOUNTS", payload: accounts });

        if (token) {
            const decodeToken = jwtDecode(token);

            if (decodeToken.exp * 1000 < Date.now()) {
                userDispatch({ type: "LOGOUT_USER" });
            } else {
                const currentUser = await fetchCurrentUser();
                if (currentUser && currentUser.data) {
                    userDispatch({
                        type: "SET_CURRENT_USER",
                        payload: currentUser.data.user,
                    });

                    uiDispatch({
                        type: "SET_NOTIFICATIONS",
                        payload: currentUser.data.notifications,
                    });
                }
            }
        }
    }, []);

    useEffect(() => {
        if (userState.isLoggedIn) {
            handleListenEvent({ uiDispatch, userDispatch, postDispatch, chatDispatch });
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
}

export default App;
