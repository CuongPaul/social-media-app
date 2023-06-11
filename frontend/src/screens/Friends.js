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
import { UserContext, UIContext } from "../App";
import { useUser, useFriendRequest } from "../hooks";

const Friends = () => {
    const { uiDispatch } = useContext(UIContext);
    const {
        userState: { currentUser, sendedFriendRequests, incommingFriendRequests },
    } = useContext(UserContext);

    const [isLoading, setIsLoading] = useState(false);
    const [userSelected, setSelectedUser] = useState(null);
    const [recommendUsers, setRecommendUsers] = useState([]);

    const {
        handleSendFriendRequest,
        handleAcceptFriendRequest,
        handleCancelFriendRequest,
        handleDeclineFriendRequest,
        isLoading: isLoadingFriendRequest,
    } = useFriendRequest();
    const { handleBlockUser, handleUnblockUser, isLoading: isLoadingUser } = useUser();

    const isFriendRequest = (user) => {
        let s_index = sendedFriendRequests.find((request) => user._id === request.receiver._id);
        let r_index = incommingFriendRequests.find((request) => user._id === request.sender._id);

        return s_index || r_index ? false : true;
    };

    useEffect(() => {
        (async () => {
            setIsLoading(true);

            try {
                const { data } = await callApi({ umethod: "GET", url: "/user/recommend-users" });
                setRecommendUsers(data.rows);

                setIsLoading(false);
            } catch (err) {
                setIsLoading(false);

                uiDispatch({
                    type: "SET_ALERT_MESSAGE",
                    payload: { text: err.message, display: true, color: "error" },
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
            <Grid style={{ display: "flex", margin: "10px", flexDirection: "column" }}>
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
                                Sended friend requests
                            </ListSubheader>
                            {sendedFriendRequests.map((request) => (
                                <ListItem key={request._id}>
                                    <User user={request.receiver} setSelectedUser={setSelectedUser}>
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
                                Incomming friend requests
                            </ListSubheader>
                            {incommingFriendRequests.map((request) => (
                                <ListItem key={request._id}>
                                    <User user={request.sender} setSelectedUser={setSelectedUser}>
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
                                                    color: "white",
                                                    minWidth: "80px",
                                                    fontSize: "10px",
                                                    marginLeft: "0px",
                                                    background: "rgb(46,139,87)",
                                                }}
                                                onClick={() => handleAcceptFriendRequest(request)}
                                            >
                                                Accept
                                            </Button>
                                            <Button
                                                variant="contained"
                                                style={{
                                                    color: "white",
                                                    marginTop: "5px",
                                                    minWidth: "80px",
                                                    fontSize: "10px",
                                                    marginLeft: "0px",
                                                    background: "rgb(108,117,125)",
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
                            background: "transparent",
                        }}
                    >
                        <img alt="" src={require("../assets/select-friends.svg")} />
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
                            {recommendUsers?.map(
                                (user) =>
                                    isFriendRequest(user) && (
                                        <ListItem key={user._id}>
                                            <User user={user} setSelectedUser={setSelectedUser}>
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
                                                            color: "white",
                                                            minWidth: "80px",
                                                            fontSize: "10px",
                                                            background: "rgb(1,133,243)",
                                                        }}
                                                        onClick={() =>
                                                            handleSendFriendRequest(user._id)
                                                        }
                                                    >
                                                        Add
                                                    </Button>
                                                    {currentUser?.block_users.includes(user._id) ? (
                                                        <Button
                                                            variant="contained"
                                                            style={{
                                                                color: "white",
                                                                marginTop: "5px",
                                                                minWidth: "80px",
                                                                fontSize: "10px",
                                                                marginLeft: "0px",
                                                                background: "rgb(23,162,184)",
                                                            }}
                                                            onClick={() =>
                                                                handleUnblockUser(user._id)
                                                            }
                                                        >
                                                            Unblock
                                                        </Button>
                                                    ) : (
                                                        <Button
                                                            variant="contained"
                                                            style={{
                                                                color: "white",
                                                                marginTop: "5px",
                                                                minWidth: "80px",
                                                                fontSize: "10px",
                                                                marginLeft: "0px",
                                                                background: "rgb(220,53,69)",
                                                            }}
                                                            onClick={() =>
                                                                handleBlockUser(user._id)
                                                            }
                                                        >
                                                            Block
                                                        </Button>
                                                    )}
                                                </CardActions>
                                            </User>
                                        </ListItem>
                                    )
                            )}
                        </List>
                    </div>
                )}
            </Grid>
        </Grid>
    );
};

export default Friends;
