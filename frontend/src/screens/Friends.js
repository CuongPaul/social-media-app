import React, { useContext, useEffect } from "react";
import { Typography, makeStyles, Avatar, Grid, CardActions, Button } from "@material-ui/core";
import Sidebar from "../components/Sidebar";
import UserLists from "../components/Friends/UserLists";
import { UIContext, UserContext } from "../App";
import Profile from "../screens/Profile";
import Friend from "../components/Friends/Friend";
import useFriendAction from "../hooks/useFriendActions";
import {
    getReceivedFriendRequests,
    getSendedFriendRequests,
} from "../services/FriendRequestService";
import { getRecommendUsers } from "../services/UserServices";
import callApi from "../api";
const useStyles = makeStyles((theme) => ({
    sidebarContainer: {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "center",
        marginLeft: "16px",
    },

    noRequest: { marginLeft: "32px", marginTop: "16px", color: "grey" },
    divider: {
        width: "90%",
        height: "1px",
        marginTop: "16px",
    },

    main: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        marginLeft: "320px",
        [theme.breakpoints.between("xs", "sm")]: {
            marginLeft: 0,
        },
    },

    avatar: { width: "112px", height: "112px", background: "transparent" },
    image: { width: "100%", height: "100%" },
    selectText: {
        color: "#65676B",
        fontSize: "20px",
        fontFamily: "sans-serif",
        fontWeight: "700",
    },
}));
function Friends() {
    const classes = useStyles();
    const { uiState, uiDispatch } = useContext(UIContext);
    const { userState, userDispatch } = useContext(UserContext);

    useEffect(() => {
        uiDispatch({ type: "SET_NAV_MENU", payload: true });
        async function sendedFriendRequest() {
            const { data } = await callApi({ url: "/friend-request/sended", method: "GET" });

            // const res = await getSendedFriendRequests();
            // if (res.data) {
            userDispatch({
                type: "SET_FRIENDS_REQUEST_SENDED",
                payload: data.rows,
            });
            // }
        }

        async function incommingFriendRequest() {
            const { data } = await callApi({ url: "/friend-request/received", method: "GET" });

            // const res = await getReceivedFriendRequests();
            // if (res && res.data) {
            userDispatch({
                type: "SET_FRIENDS_REQUEST_RECEIVED",
                payload: data.rows,
            });
            // }
        }

        async function recommandedUser() {
            const res = await getRecommendUsers();
            if (res && res.data) {
                userDispatch({
                    type: "SET_USERS",
                    payload: res.data.users,
                });
            }
        }

        recommandedUser();
        incommingFriendRequest();
        sendedFriendRequest();

        return () => {
            userDispatch({ type: "REMOVE_SELECTED_USER_PROFILE", payload: null });
            uiDispatch({ type: "SET_NAV_MENU", payload: false });
        };
    }, [uiDispatch, userDispatch]);

    const { acceptFriendRequest, declineFriendRequest, cancelFriendRequest } = useFriendAction();

    const handleAcceptFriendRequest = (request_id) => {
        acceptFriendRequest(request_id);
    };

    const handleDeclineFriendRequest = (request_id) => {
        declineFriendRequest(request_id);
    };

    const handleCancelFriendRequest = (request_id) => {
        cancelFriendRequest(request_id);
    };

    const metaData = (
        <div className={classes.sidebarContainer}>
            <Typography variant="h4">Friends</Typography>

            {userState.sendedFriendRequests.length ? (
                <>
                    <Typography variant="h6">Sended Friend Request</Typography>
                    {userState.sendedFriendRequests.map((request) => (
                        <Friend user={request.receiver} key={request._id}>
                            <CardActions>
                                <Button
                                    onClick={() => handleCancelFriendRequest(request._id)}
                                    variant="contained"
                                    style={{
                                        background: "tomato",
                                        color: "white",
                                    }}
                                >
                                    Cancel
                                </Button>
                            </CardActions>
                        </Friend>
                    ))}
                </>
            ) : null}

            {userState.receivedFriendRequests.length ? (
                <>
                    <Typography variant="h6">Incomming Friend Requests</Typography>

                    {userState.receivedFriendRequests.map((request) => (
                        <Friend user={request.sender} key={request._id}>
                            <CardActions>
                                <Button
                                    onClick={() => handleAcceptFriendRequest(request._id)}
                                    variant="contained"
                                    style={{
                                        background: "seagreen",
                                        color: "white",
                                    }}
                                >
                                    Accept
                                </Button>
                                <Button
                                    variant="contained"
                                    style={{
                                        background: "tomato",
                                        color: "white",
                                    }}
                                    onClick={() => handleDeclineFriendRequest(request._id)}
                                >
                                    Decline
                                </Button>
                            </CardActions>
                        </Friend>
                    ))}
                </>
            ) : null}
        </div>
    );
    return (
        <div>
            <Grid container spacing={0}>
                <Grid item md={3}>
                    <Sidebar backgroundColor={uiState.darkMode && "rgb(36,37,38)"}>
                        {metaData}

                        <UserLists users={userState.users} />
                    </Sidebar>
                </Grid>
                <Grid item md={8} style={{ margin: "auto" }}>
                    {userState.selectedUserProfile && (
                        <Profile userId={userState.selectedUserProfile} conScreen={true} />
                    )}
                </Grid>
            </Grid>

            {!userState.selectedUserProfile && (
                <div
                    className={classes.main}
                    style={{ backgroundColor: uiState.darkMode ? "rgb(24,25,26)" : null }}
                >
                    <Avatar variant="square" className={classes.avatar}>
                        <img
                            alt="avatar"
                            src={require("../assets/select-friends.svg")}
                            className={classes.image}
                        />
                    </Avatar>
                    <Typography className={classes.selectText}>
                        Select people's names to preview their profile.
                    </Typography>
                </div>
            )}
        </div>
    );
}

export default Friends;
