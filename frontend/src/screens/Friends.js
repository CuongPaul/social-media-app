import {
    List,
    Grid,
    Avatar,
    Button,
    ListItem,
    Typography,
    CardActions,
    ListSubheader,
} from "@material-ui/core";
import React, { useState, useEffect, useContext } from "react";

import callApi from "../api";
import Profile from "../screens/Profile";
import User from "../components/Friends/User";
import { UIContext, UserContext } from "../App";
import { useUser, useFriendRequest } from "../hooks";

const ButtonAction = ({ text, onClick, backgroundColor }) => (
    <Button
        onClick={onClick}
        variant="contained"
        style={{
            margin: "5px",
            minWidth: "80px",
            fontSize: "10px",
            color: "rgb(255,255,255)",
            backgroundColor: backgroundColor,
        }}
    >
        {text}
    </Button>
);

const Friends = () => {
    const { uiDispatch } = useContext(UIContext);
    const {
        userDispatch,
        userState: { currentUser, userIdSelected, sendedFriendRequests, incommingFriendRequests },
    } = useContext(UserContext);

    const [recommendUsers, setRecommendUsers] = useState([]);
    const [pageRecommendUsers, setPageRecommendUsers] = useState(1);
    const [pageSendedFriendRequests, setPageSendedFriendRequests] = useState(1);
    const [pageIncommingFriendRequests, setPageIncommingFriendRequests] = useState(1);

    const {
        handleSendFriendRequest,
        handleAcceptFriendRequest,
        handleCancelFriendRequest,
        handleDeclineFriendRequest,
    } = useFriendRequest();
    const { handleBlockUser, handleUnblockUser } = useUser();

    const handleScrollSendedFriendRequests = async (e) => {
        const { scrollTop, clientHeight, scrollHeight } = e.target;

        const isBottom = scrollHeight - scrollTop === clientHeight;

        if (isBottom) {
            setPageSendedFriendRequests(pageSendedFriendRequests + 1);

            try {
                const { data } = await callApi({
                    method: "GET",
                    url: "/friend-request/sended",
                    query: { page: pageSendedFriendRequests + 1 },
                });

                if (data) {
                    userDispatch({
                        payload: data.rows,
                        type: "ADD_SENDED_FRIEND_REQUEST",
                    });
                }
            } catch (err) {
                uiDispatch({
                    type: "SET_ALERT_MESSAGE",
                    payload: { display: true, color: "error", text: err.message },
                });
            }
        }
    };

    const handleScrollIncommingFriendRequests = async (e) => {
        const { scrollTop, clientHeight, scrollHeight } = e.target;

        const isBottom = scrollHeight - scrollTop === clientHeight;

        if (isBottom) {
            setPageIncommingFriendRequests(pageIncommingFriendRequests + 1);

            try {
                const { data } = await callApi({
                    method: "GET",
                    url: "/friend-request/received",
                    query: { page: pageIncommingFriendRequests + 1 },
                });

                if (data) {
                    userDispatch({
                        payload: data.rows,
                        type: "ADD_INCOMMING_FRIEND_REQUEST",
                    });
                }
            } catch (err) {
                uiDispatch({
                    type: "SET_ALERT_MESSAGE",
                    payload: { display: true, color: "error", text: err.message },
                });
            }
        }
    };

    const handleScrollRecommendUsers = async (e) => {
        const { scrollTop, clientHeight, scrollHeight } = e.target;

        const isBottom = scrollHeight - scrollTop === clientHeight;

        if (isBottom) {
            setPageRecommendUsers(pageRecommendUsers + 1);

            try {
                const { data } = await callApi({
                    method: "GET",
                    url: "/user/recommend-users",
                    query: { page: pageRecommendUsers + 1 },
                });

                setRecommendUsers([...recommendUsers, ...data.row]);
            } catch (err) {
                uiDispatch({
                    type: "SET_ALERT_MESSAGE",
                    payload: { display: true, color: "error", text: err.message },
                });
            }
        }
    };

    useEffect(() => {
        (async () => {
            try {
                const { data } = await callApi({ method: "GET", url: "/user/recommend-users" });

                setRecommendUsers(data.rows);
            } catch (err) {
                uiDispatch({
                    type: "SET_ALERT_MESSAGE",
                    payload: { display: true, color: "error", text: err.message },
                });
            }
        })();

        return () => userDispatch({ payload: "", type: "SET_USER_ID_SELECTED" });
    }, []);

    return (
        <Grid
            style={{
                display: "flex",
                marginTop: "64px",
                height: `calc(100vh - 64px)`,
                justifyContent: "space-between",
            }}
        >
            <Grid style={{ margin: "10px", display: "flex", flexDirection: "column" }}>
                {Boolean(sendedFriendRequests.length) && (
                    <div
                        style={{
                            flex: 1,
                            margin: "5px",
                            borderRadius: "10px",
                            overflow: "hidden auto",
                            backgroundColor: "rgb(255,255,255)",
                        }}
                        onScroll={handleScrollSendedFriendRequests}
                    >
                        <List style={{ padding: "0px" }}>
                            <ListSubheader
                                style={{ textAlign: "center", backgroundColor: "rgb(255,255,255)" }}
                            >
                                Friend requests sended
                            </ListSubheader>
                            {sendedFriendRequests.map((request) => (
                                <ListItem key={request?._id}>
                                    <User user={request?.receiver}>
                                        <CardActions style={{ padding: "0px", marginLeft: "16px" }}>
                                            <ButtonAction
                                                text={"Cancel"}
                                                backgroundColor={"rgb(255,193,7)"}
                                                onClick={() =>
                                                    handleCancelFriendRequest(request?._id)
                                                }
                                            />
                                        </CardActions>
                                    </User>
                                </ListItem>
                            ))}
                        </List>
                    </div>
                )}
                {Boolean(incommingFriendRequests.length) && (
                    <div
                        style={{
                            flex: 1,
                            margin: "5px",
                            borderRadius: "10px",
                            overflow: "hidden auto",
                            backgroundColor: "rgb(255,255,255)",
                        }}
                        onScroll={handleScrollIncommingFriendRequests}
                    >
                        <List style={{ padding: "0px" }}>
                            <ListSubheader
                                style={{ textAlign: "center", backgroundColor: "rgb(255,255,255)" }}
                            >
                                Friend requests incomming
                            </ListSubheader>
                            {incommingFriendRequests.map((request) => (
                                <ListItem key={request._id}>
                                    <User user={request.sender}>
                                        <CardActions
                                            style={{
                                                padding: "0px",
                                                display: "flex",
                                                marginLeft: "16px",
                                                flexDirection: "column",
                                            }}
                                        >
                                            <ButtonAction
                                                text={"Decline"}
                                                backgroundColor={"rgb(108,117,125)"}
                                                onClick={() =>
                                                    handleDeclineFriendRequest(request._id)
                                                }
                                            />
                                            <ButtonAction
                                                text={"Accept"}
                                                backgroundColor={"rgb(46,139,87)"}
                                                onClick={() => handleAcceptFriendRequest(request)}
                                            />
                                        </CardActions>
                                    </User>
                                </ListItem>
                            ))}
                        </List>
                    </div>
                )}
            </Grid>
            {userIdSelected ? (
                <div
                    style={{
                        flex: 1,
                        margin: "10px",
                        overflow: "hidden auto",
                    }}
                >
                    <Profile conScreen userId={userIdSelected} />
                </div>
            ) : (
                <div
                    style={{
                        flex: 1,
                        margin: "10px",
                        display: "flex",
                        alignItems: "center",
                        flexDirection: "column",
                        justifyContent: "center",
                    }}
                >
                    <Avatar
                        variant="square"
                        style={{
                            width: "120px",
                            height: "120px",
                            backgroundColor: "transparent",
                        }}
                    >
                        <img alt={""} src={require("../assets/icons/select-friends.svg")} />
                    </Avatar>
                    <Typography
                        style={{
                            fontWeight: 700,
                            fontSize: "20px",
                            color: "rgb(101,103,107)",
                        }}
                    >
                        Select the name of the person you want to preview the profile.
                    </Typography>
                </div>
            )}
            <Grid style={{ margin: "10px", display: "flex" }}>
                {Boolean(recommendUsers.length) && (
                    <div
                        onScroll={handleScrollRecommendUsers}
                        style={{
                            margin: "5px",
                            borderRadius: "10px",
                            overflow: "hidden auto",
                            backgroundColor: "rgb(255,255,255)",
                        }}
                    >
                        <List style={{ padding: "0px" }}>
                            <ListSubheader
                                style={{ textAlign: "center", backgroundColor: "rgb(255,255,255)" }}
                            >
                                People you may know
                            </ListSubheader>
                            {recommendUsers.map((user) => (
                                <ListItem key={user._id}>
                                    <User user={user}>
                                        <CardActions
                                            style={{
                                                padding: "0px",
                                                display: "flex",
                                                marginLeft: "16px",
                                                flexDirection: "column",
                                            }}
                                        >
                                            <ButtonAction
                                                text={"Add"}
                                                backgroundColor={"rgb(1,133,243)"}
                                                onClick={() => handleSendFriendRequest(user._id)}
                                            />
                                            {currentUser?.block_users.includes(user._id) ? (
                                                <ButtonAction
                                                    text={"Unblock"}
                                                    backgroundColor={"rgb(23,162,184)"}
                                                    onClick={() => handleUnblockUser(user._id)}
                                                />
                                            ) : (
                                                <ButtonAction
                                                    text={"Block"}
                                                    backgroundColor={"rgb(220,53,69)"}
                                                    onClick={() => handleBlockUser(user._id)}
                                                />
                                            )}
                                        </CardActions>
                                    </User>
                                </ListItem>
                            ))}
                        </List>
                    </div>
                )}
            </Grid>
        </Grid>
    );
};

export default Friends;
