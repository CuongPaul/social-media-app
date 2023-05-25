import {
    List,
    Grid,
    Avatar,
    Button,
    ListItem,
    Typography,
    makeStyles,
    CardActions,
    ListSubheader,
} from "@material-ui/core";
import React, { useState, Fragment, useEffect, useContext } from "react";

import callApi from "../api";
import Profile from "../screens/Profile";
import Sidebar from "../components/Sidebar";
import User from "../components/Friends/User";
import { UIContext, UserContext } from "../App";
import useFriendAction from "../hooks/useFriendRequest";

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
        userState: { currentUser, sendedFriendRequests, incommingFriendRequests },
    } = useContext(UserContext);
    const [selectedUser, setSelectedUser] = useState(null);
    const [usersRecommend, setUsersRecommend] = useState([]);

    const {
        handleSendFriendRequest,
        handleAcceptFriendRequest,
        handleCancelFriendRequest,
        handleDeclineFriendRequest,
    } = useFriendAction();

    const filterUser = (user) => {
        let s_index = sendedFriendRequests?.findIndex((request) => request.sender._id === user._id);
        let r_index = incommingFriendRequests?.findIndex(
            (request) => request.receiver._id === user._id
        );
        let already_friend = currentUser.friends.findIndex((friend) => friend._id === user._id);
        let abc = currentUser._id === user._id;

        if (s_index === -1 && r_index === -1 && already_friend === -1 && !abc) {
            return true;
        }
        return false;
    };

    useEffect(() => {
        (async () => {
            const { data } = await callApi({ url: "/user/recommend-users", method: "GET" });
            setUsersRecommend(data.rows);
        })();
    }, []);

    return (
        <Fragment>
            <Grid container>
                <Grid item md={3}>
                    <Sidebar width="350px">
                        <div style={{ overflow: "auto", maxHeight: "250px", overflowX: "hidden" }}>
                            <List>
                                <ListSubheader>Sended friend reques</ListSubheader>
                                {sendedFriendRequests.map((request) => (
                                    <ListItem key={request._id}>
                                        <User
                                            user={request.receiver}
                                            setSelectedUser={setSelectedUser}
                                        >
                                            <CardActions
                                                style={{
                                                    padding: "0px",
                                                    marginLeft: "16px",
                                                }}
                                            >
                                                <Button
                                                    variant="contained"
                                                    style={{
                                                        color: "white",
                                                        minWidth: "80px",
                                                        fontSize: "10px",
                                                        background: "rgb(255,193,7)",
                                                    }}
                                                    onClick={() =>
                                                        handleCancelFriendRequest(request._id)
                                                    }
                                                >
                                                    Cancel
                                                </Button>
                                            </CardActions>
                                        </User>
                                    </ListItem>
                                ))}
                            </List>
                        </div>
                        <div style={{ overflow: "auto", maxHeight: "250px", overflowX: "hidden" }}>
                            <List>
                                <ListSubheader>Incomming User Requests</ListSubheader>
                                {incommingFriendRequests?.map((request) => (
                                    <ListItem key={request._id}>
                                        <User
                                            user={request.sender}
                                            key={request._id}
                                            setSelectedUser={setSelectedUser}
                                        >
                                            <CardActions
                                                style={{
                                                    padding: "0px",
                                                    marginLeft: "16px",
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    alignItems: "baseline",
                                                }}
                                            >
                                                <Button
                                                    variant="contained"
                                                    style={{
                                                        color: "white",
                                                        minWidth: "80px",
                                                        fontSize: "10px",
                                                        background: "rgb(46,139,87)",
                                                    }}
                                                    onClick={() =>
                                                        handleAcceptFriendRequest(request)
                                                    }
                                                >
                                                    Accept
                                                </Button>
                                                <Button
                                                    variant="contained"
                                                    style={{
                                                        marginTop: "5px",
                                                        color: "white",
                                                        minWidth: "80px",
                                                        fontSize: "10px",
                                                        background: "rgb(255,99,71)",
                                                    }}
                                                    onClick={() =>
                                                        handleDeclineFriendRequest(request._id)
                                                    }
                                                >
                                                    Decline
                                                </Button>
                                            </CardActions>
                                        </User>
                                    </ListItem>
                                ))}
                            </List>
                        </div>
                        <div style={{ overflow: "auto", maxHeight: "250px", overflowX: "hidden" }}>
                            <List>
                                <ListSubheader>People you may know</ListSubheader>
                                {usersRecommend?.map((user) => (
                                    <ListItem key={user._id}>
                                        <User
                                            user={user}
                                            key={user._id}
                                            setSelectedUser={setSelectedUser}
                                        >
                                            <CardActions>
                                                <Button
                                                    onClick={() =>
                                                        handleSendFriendRequest(user._id)
                                                    }
                                                    variant="contained"
                                                    style={{
                                                        background: "rgb(1,133,243)",
                                                        color: "white",
                                                    }}
                                                >
                                                    Add
                                                </Button>
                                            </CardActions>
                                        </User>
                                    </ListItem>
                                ))}
                            </List>
                        </div>
                    </Sidebar>
                </Grid>
                <Grid item md={8} style={{ margin: "auto" }}>
                    {selectedUser && <Profile userId={selectedUser} conScreen={true} />}
                </Grid>
            </Grid>

            {!selectedUser && (
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
