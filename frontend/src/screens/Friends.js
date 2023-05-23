import React, { Fragment, useEffect, useContext, useState } from "react";
import { Grid, Avatar, Button, makeStyles, Typography, CardActions } from "@material-ui/core";

import Profile from "../screens/Profile";
import Sidebar from "../components/Sidebar";
import { UIContext, UserContext } from "../App";
import Friend from "../components/Friends/Friend";
import useFriendAction from "../hooks/useFriendActions";
import UserLists from "../components/Friends/UserLists";

const useStyles = makeStyles((theme) => ({
    image: {
        width: "100%",
        height: "100%",
    },

    noRequest: {
        color: "grey",
        marginTop: "16px",
        marginLeft: "32px",
    },

    divider: {
        width: "90%",
        height: "1px",
        marginTop: "16px",
    },

    selectText: {
        color: "#65676B",
        fontSize: "20px",
        fontWeight: "700",
        fontFamily: "sans-serif",
    },

    sidebarContainer: {
        display: "flex",
        marginLeft: "16px",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "center",
    },

    avatar: {
        width: "112px",
        height: "112px",
        background: "transparent",
    },

    main: {
        display: "flex",
        minHeight: "100vh",
        marginLeft: "320px",
        alignItems: "center",
        flexDirection: "column",
        justifyContent: "center",
        [theme.breakpoints.between("xs", "sm")]: { marginLeft: 0 },
    },
}));

function Friends() {
    const classes = useStyles();
    const { userState } = useContext(UserContext);
    const { uiState, uiDispatch } = useContext(UIContext);

    const [userSelected, setUserSelected] = useState(null);

    const { handleAcceptFriendRequest, handleDeclineOrCancleFriendRequest } = useFriendAction();

    useEffect(() => {
        uiDispatch({ type: "SET_NAV_MENU", payload: true });
    }, []);

    return (
        <Fragment>
            <Grid container spacing={0}>
                <Grid item md={3}>
                    <Sidebar>
                        <div className={classes.sidebarContainer}>
                            <Typography variant="h4">Friends</Typography>
                            <>
                                <Typography variant="h6">Sended Friend Request</Typography>
                                {userState?.sendedFriendRequest?.map((request) => (
                                    <Friend
                                        user={request.receiver}
                                        key={request._id}
                                        setUserSelected={setUserSelected}
                                    >
                                        <CardActions>
                                            <Button
                                                onClick={() =>
                                                    handleDeclineOrCancleFriendRequest(request._id)
                                                }
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
                            <>
                                <Typography variant="h6">Incomming Friend Requests</Typography>

                                {userState?.incommingFriendRequest?.map((request) => (
                                    <Friend
                                        user={request.sender}
                                        key={request._id}
                                        setUserSelected={setUserSelected}
                                    >
                                        <CardActions>
                                            <Button
                                                onClick={() =>
                                                    handleAcceptFriendRequest(request._id)
                                                }
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
                                                onClick={() =>
                                                    handleDeclineOrCancleFriendRequest(request._id)
                                                }
                                            >
                                                Decline
                                            </Button>
                                        </CardActions>
                                    </Friend>
                                ))}
                            </>
                        </div>

                        <UserLists
                            friendRequest={userState?.sendedFriendRequest}
                            friendIncomming={userState?.incommingFriendRequest}
                        />
                    </Sidebar>
                </Grid>
                <Grid item md={8} style={{ margin: "auto" }}>
                    {userSelected && <Profile userId={userSelected} conScreen={true} />}
                </Grid>
            </Grid>

            {!userSelected && (
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
        </Fragment>
    );
}

export default Friends;
