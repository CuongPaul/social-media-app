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
import { UserContext } from "../App";
import Profile from "../screens/Profile";
import Sidebar from "../components/Sidebar";
import User from "../components/Friends/User";
import { useUserActions, useFriendRequestAction } from "../hooks";

const Friends = () => {
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
    } = useFriendRequestAction();
    const { handleBlockUser, handleUnblockUser } = useUserActions();

    const isFriendRequest = (user) => {
        let s_index = sendedFriendRequests.find((request) => request.receiver._id == user._id);

        let r_index = incommingFriendRequests.find((request) => request.sender._id == user._id);

        return s_index || r_index ? false : true;
    };

    useEffect(() => {
        (async () => {
            const { data } = await callApi({ url: "/user/recommend-users", method: "GET" });
            setUsersRecommend(data.rows);
        })();
    }, []);

    return (
        <Grid container>
            <Grid item md={3}>
                <Sidebar width="350px">
                    <div style={{ overflow: "auto", maxHeight: "250px", overflowX: "hidden" }}>
                        <List>
                            <ListSubheader>Sended friend reques</ListSubheader>
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
                    <div style={{ overflow: "auto", maxHeight: "250px", overflowX: "hidden" }}>
                        <List>
                            <ListSubheader>Incomming User Requests</ListSubheader>
                            {incommingFriendRequests?.map((request) => (
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
                    <div style={{ overflow: "auto", maxHeight: "250px", overflowX: "hidden" }}>
                        <List>
                            <ListSubheader>People you may know</ListSubheader>
                            {usersRecommend?.map(
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
                </Sidebar>
            </Grid>
            <Grid item md={8} style={{ margin: "auto" }}>
                {selectedUser ? (
                    <Profile conScreen userData={selectedUser} />
                ) : (
                    <div
                        style={{
                            display: "flex",
                            minHeight: "100vh",
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
            </Grid>
        </Grid>
    );
};

export default Friends;
