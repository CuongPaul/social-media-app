import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import { Grid, Paper, Button, Typography } from "@material-ui/core";

import { UserContext } from "../../App";
import AvatarIcon from "../common/AvatarIcon";
import { useUser, useFriendRequest } from "../../hooks";

const Friends = ({ friends }) => {
    const {
        userState: { currentUser, sendedFriendRequests },
    } = useContext(UserContext);

    const history = useHistory();

    const { handleUnfriend, handleBlockUser, handleUnblockUser } = useUser();
    const { handleSendFriendRequest, handleCancelFriendRequest } = useFriendRequest();

    return (
        <div style={{ display: "flex", justifyContent: "center" }}>
            {friends.map((friend) => {
                const mutualFriends = currentUser?.friends.filter((item) =>
                    friend.friends.includes(item._id)
                );

                return (
                    <Grid
                        item
                        md={4}
                        key={friend._id}
                        style={{
                            margin: "20px",
                            borderRadius: "15px",
                            backgroundColor: "rgb(255,255,255)",
                        }}
                    >
                        <Paper
                            style={{
                                display: "flex",
                                padding: "16px",
                                boxShadow: "none",
                                cursor: "pointer",
                                alignItems: "center",
                                borderRadius: "15px",
                                flexDirection: "column",
                            }}
                            onClick={() => history.push(`/profile/${friend._id}`)}
                        >
                            <AvatarIcon
                                size="100px"
                                fontSize="50px"
                                text={friend.name}
                                imageUrl={friend.avatar_image}
                            />
                            <Typography style={{ marginTop: "16px" }} variant="h5">
                                {friend.name}
                            </Typography>
                            <Typography style={{ marginTop: "6px" }} variant="body2">
                                {mutualFriends.length} mutual friends
                            </Typography>
                        </Paper>
                        <div style={{ display: "flex", justifyContent: "center" }}>
                            {currentUser?.friends.find((item) => item._id === friend._id) ? (
                                <Button
                                    variant="contained"
                                    style={{
                                        color: "rgb(255,255,255)",
                                        margin: "10px",
                                        minWidth: "100px",
                                        fontSize: "12px",
                                        backgroundColor: "rgb(108,117,125)",
                                    }}
                                    onClick={() => handleUnfriend(friend._id)}
                                >
                                    Unfriend
                                </Button>
                            ) : sendedFriendRequests?.find(
                                  (item) => item.receiver._id === friend._id
                              ) ? (
                                <Button
                                    variant="contained"
                                    style={{
                                        color: "rgb(255,255,255)",
                                        margin: "10px",
                                        minWidth: "100px",
                                        fontSize: "12px",
                                        backgroundColor: "rgb(255,193,7)",
                                    }}
                                    onClick={() =>
                                        handleCancelFriendRequest(
                                            sendedFriendRequests?.find(
                                                (item) => item.receiver._id === friend._id
                                            )._id
                                        )
                                    }
                                >
                                    Cancel
                                </Button>
                            ) : (
                                <Button
                                    variant="contained"
                                    style={{
                                        color: "rgb(255,255,255)",
                                        margin: "10px",
                                        minWidth: "100px",
                                        fontSize: "12px",
                                        backgroundColor: "rgb(0,123,255)",
                                    }}
                                    onClick={() => handleSendFriendRequest(friend._id)}
                                >
                                    Add
                                </Button>
                            )}
                            {currentUser.block_users.includes(friend._id) ? (
                                <Button
                                    variant="contained"
                                    style={{
                                        color: "rgb(255,255,255)",
                                        margin: "10px",
                                        minWidth: "100px",
                                        fontSize: "12px",
                                        backgroundColor: "rgb(23,162,184)",
                                    }}
                                    onClick={() => handleUnblockUser(friend._id)}
                                >
                                    Unblock
                                </Button>
                            ) : (
                                <Button
                                    variant="contained"
                                    style={{
                                        color: "rgb(255,255,255)",
                                        margin: "10px",
                                        minWidth: "100px",
                                        fontSize: "12px",
                                        backgroundColor: "rgb(220,53,69)",
                                    }}
                                    onClick={() => handleBlockUser(friend._id)}
                                >
                                    Block
                                </Button>
                            )}
                        </div>
                    </Grid>
                );
            })}
        </div>
    );
};

export default Friends;
