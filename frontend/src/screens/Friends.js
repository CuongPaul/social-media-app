import React, { useState, Fragment, useContext } from "react";
import { List, Grid, Avatar, Button, makeStyles, Typography, CardActions } from "@material-ui/core";

import Profile from "../screens/Profile";
import Sidebar from "../components/Sidebar";
import { UIContext, UserContext } from "../App";
import Friend from "../components/Friends/Friend";
import useFriendAction from "../hooks/useFriendRequest";
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

const Friends = () => {
    const classes = useStyles();
    const { uiState } = useContext(UIContext);
    const {
        userState: { sendedFriendRequests, incommingFriendRequests },
    } = useContext(UserContext);

    const [userSelected, setUserSelected] = useState(null);

    const { handleAcceptFriendRequest, handleCancelFriendRequest, handleDeclineFriendRequest } =
        useFriendAction();

    return (
        <Fragment>
            <Grid container>
                <Grid item md={3}>
                    <Sidebar>
                        <div>
                            <Typography variant="h6">Sended friend request</Typography>
                            {sendedFriendRequests.map((request) => (
                                <Friend
                                    key={request._id}
                                    user={request.receiver}
                                    setUserSelected={setUserSelected}
                                >
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
                        </div>
                        <div>
                            <Typography variant="h6">Incomming Friend Requests</Typography>

                            {incommingFriendRequests?.map((request) => (
                                <Friend
                                    user={request.sender}
                                    key={request._id}
                                    setUserSelected={setUserSelected}
                                >
                                    <CardActions>
                                        <Button
                                            onClick={() => handleAcceptFriendRequest(request)}
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
                        </div>

                        <UserLists
                            friendRequest={sendedFriendRequests}
                            friendIncomming={incommingFriendRequests}
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
                            alt=""
                            className={classes.image}
                            src={require("../assets/select-friends.svg")}
                        />
                    </Avatar>
                    <Typography className={classes.selectText}>
                        Select the name of the person you want to preview the profile.
                    </Typography>
                </div>
            )}
        </Fragment>
    );
};

export default Friends;
