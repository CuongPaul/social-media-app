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

const Friends = () => {
    const { uiDispatch } = useContext(UIContext);
    const {
        userState: { currentUser, sendedFriendRequests, incommingFriendRequests },
    } = useContext(UserContext);

    const [userSelected, setUserSelected] = useState(null);
    const [recommendUsers, setRecommendUsers] = useState([]);

    const {
        handleSendFriendRequest,
        handleAcceptFriendRequest,
        handleCancelFriendRequest,
        handleDeclineFriendRequest,
    } = useFriendRequest();
    const { handleBlockUser, handleUnblockUser } = useUser();

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
                    >
                        <List style={{ padding: "0px" }}>
                            <ListSubheader
                                style={{ textAlign: "center", backgroundColor: "rgb(255,255,255)" }}
                            >
                                Friend requests sended
                            </ListSubheader>
                            {sendedFriendRequests.map((request) => (
                                <ListItem key={request._id}>
                                    <User user={request.receiver} setUserSelected={setUserSelected}>
                                        <CardActions style={{ padding: "0px", marginLeft: "16px" }}>
                                            <Button
                                                variant="contained"
                                                style={{
                                                    minWidth: "80px",
                                                    fontSize: "10px",
                                                    color: "rgb(255,255,255)",
                                                    backgroundColor: "rgb(255,193,7)",
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
                    >
                        <List style={{ padding: "0px" }}>
                            <ListSubheader
                                style={{ textAlign: "center", backgroundColor: "rgb(255,255,255)" }}
                            >
                                Friend requests incomming
                            </ListSubheader>
                            {incommingFriendRequests.map((request) => (
                                <ListItem key={request._id}>
                                    <User user={request.sender} setUserSelected={setUserSelected}>
                                        <CardActions
                                            style={{
                                                padding: "0px",
                                                display: "flex",
                                                marginLeft: "16px",
                                                flexDirection: "column",
                                            }}
                                        >
                                            <Button
                                                variant="contained"
                                                style={{
                                                    minWidth: "80px",
                                                    fontSize: "10px",
                                                    marginLeft: "0px",
                                                    color: "rgb(255,255,255)",
                                                    backgroundColor: "rgb(46,139,87)",
                                                }}
                                                onClick={() => handleAcceptFriendRequest(request)}
                                            >
                                                Accept
                                            </Button>
                                            <Button
                                                variant="contained"
                                                style={{
                                                    fontSize: "10px",
                                                    marginTop: "5px",
                                                    minWidth: "80px",
                                                    marginLeft: "0px",
                                                    color: "rgb(255,255,255)",
                                                    backgroundColor: "rgb(108,117,125)",
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
                )}
            </Grid>
            {userSelected ? (
                <div
                    style={{
                        flex: 1,
                        margin: "10px",
                        overflow: "hidden auto",
                    }}
                >
                    <Profile conScreen userId={userSelected._id} />
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
                        <img alt={""} src={require("../assets/select-friends.svg")} />
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
                                    <User user={user} setUserSelected={setUserSelected}>
                                        <CardActions
                                            style={{
                                                padding: "0px",
                                                display: "flex",
                                                marginLeft: "16px",
                                                flexDirection: "column",
                                            }}
                                        >
                                            <Button
                                                variant="contained"
                                                style={{
                                                    minWidth: "80px",
                                                    fontSize: "10px",
                                                    color: "rgb(255,255,255)",
                                                    backgroundColor: "rgb(1,133,243)",
                                                }}
                                                onClick={() => handleSendFriendRequest(user._id)}
                                            >
                                                Add
                                            </Button>
                                            {currentUser?.block_users.includes(user._id) ? (
                                                <Button
                                                    variant="contained"
                                                    style={{
                                                        marginTop: "5px",
                                                        minWidth: "80px",
                                                        fontSize: "10px",
                                                        marginLeft: "0px",
                                                        color: "rgb(255,255,255)",
                                                        backgroundColor: "rgb(23,162,184)",
                                                    }}
                                                    onClick={() => handleUnblockUser(user._id)}
                                                >
                                                    Unblock
                                                </Button>
                                            ) : (
                                                <Button
                                                    variant="contained"
                                                    style={{
                                                        marginTop: "5px",
                                                        minWidth: "80px",
                                                        fontSize: "10px",
                                                        marginLeft: "0px",
                                                        color: "rgb(255,255,255)",
                                                        backgroundColor: "rgb(220,53,69)",
                                                    }}
                                                    onClick={() => handleBlockUser(user._id)}
                                                >
                                                    Block
                                                </Button>
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
