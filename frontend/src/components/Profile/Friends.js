import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import { Grid, Paper, Button, Typography } from "@material-ui/core";

import { AvatarIcon } from "../common";
import { UserContext } from "../../App";
import { useUser, useFriendRequest } from "../../hooks";

const ButtonAction = ({ text, onClick, backgroundColor }) => (
    <Button
        onClick={onClick}
        variant="contained"
        style={{
            fontSize: "10px",
            minWidth: "80px",
            margin: "10px 0px",
            color: "rgb(255,255,255)",
            backgroundColor: backgroundColor,
        }}
    >
        {text}
    </Button>
);

const Friends = ({ friends }) => {
    const {
        userState: { currentUser, sendedFriendRequests },
    } = useContext(UserContext);

    const history = useHistory();

    const { handleUnfriend, handleBlockUser, handleUnblockUser } = useUser();
    const { handleSendFriendRequest, handleCancelFriendRequest } = useFriendRequest();

    return (
        <Grid container justifyContent={"center"}>
            {friends.map((friend) => {
                const mutualFriends = currentUser?.friends.filter((item) =>
                    friend.friends.includes(item._id)
                );

                return (
                    <Grid
                        item
                        md={3}
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
                        <div style={{ display: "flex", justifyContent: "space-evenly" }}>
                            {currentUser?.friends.find((item) => item._id === friend._id) ? (
                                <ButtonAction
                                    text={"Unfriend"}
                                    backgroundColor={"rgb(108,117,125)"}
                                    onClick={() => handleUnfriend(friend._id)}
                                />
                            ) : sendedFriendRequests?.find(
                                  (item) => item.receiver._id === friend._id
                              ) ? (
                                <ButtonAction
                                    text={"Cancel"}
                                    backgroundColor={"rgb(255,193,7)"}
                                    onClick={() =>
                                        handleCancelFriendRequest(
                                            sendedFriendRequests?.find(
                                                (item) => item.receiver._id === friend._id
                                            )._id
                                        )
                                    }
                                />
                            ) : (
                                <ButtonAction
                                    text={"Add"}
                                    backgroundColor={"rgb(0,123,255)"}
                                    onClick={() => handleSendFriendRequest(friend._id)}
                                />
                            )}
                            {currentUser.block_users.includes(friend._id) ? (
                                <ButtonAction
                                    text={"Unblock"}
                                    backgroundColor={"rgb(23,162,184)"}
                                    onClick={() => handleUnblockUser(friend._id)}
                                />
                            ) : (
                                <ButtonAction
                                    text={"Block"}
                                    backgroundColor={"rgb(220,53,69)"}
                                    onClick={() => handleBlockUser(friend._id)}
                                />
                            )}
                        </div>
                    </Grid>
                );
            })}
        </Grid>
    );
};

export default Friends;
