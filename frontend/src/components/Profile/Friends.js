import React, { useContext } from "react";
import { Paper, Grid, Typography, Button, Avatar } from "@material-ui/core";

import { UserContext } from "../../App";
import AvatarIcon from "../UI/AvatarIcon";
// import { unfriend } from "../../services/UserServices";

const Friends = ({ user }) => {
    const { userDispatch } = useContext(UserContext);

    return (
        <Grid container spacing={2}>
            {user.friends &&
                user.friends.map((friend) => (
                    <Grid item xs={12} sm={6} md={6} key={friend._id}>
                        <Paper
                            style={{
                                padding: "16px",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                            }}
                        >
                            <AvatarIcon
                                size="70px"
                                text={friend.name}
                                imageUrl={friend.avatar_image}
                            />
                            <Typography
                                style={{ marginTop: "16px", flexGrow: 1 }}
                                variant="h5"
                                color="inherit"
                            >
                                {friend.name}
                            </Typography>
                            <Typography
                                style={{ marginTop: "6px", flexGrow: 1 }}
                                variant="h6"
                                color="inherit"
                            >
                                {friend.email}
                            </Typography>
                            <Button
                                variant="contained"
                                style={{
                                    backgroundColor: "tomato",
                                    color: "#fff",
                                    marginTop: "16px",
                                }}
                                onClick={() => {
                                    const userRequest = {
                                        id: user.id,
                                        friends: user.friends.map((item) => item.id),
                                    };
                                    const friendRequest = {
                                        id: friend.id,
                                        friends: friend.friends.map((item) => item.id),
                                    };

                                    const newPayload = user.friends.filter(
                                        (item) => item.id !== friend.id
                                    );

                                    // unfriend({ userRequest, friendRequest }).then((res) => {
                                    //     userDispatch({
                                    //         type: "REMOVE_FRIEND",
                                    //         payload: newPayload,
                                    //     });
                                    // });
                                }}
                            >
                                Unfriend
                            </Button>
                        </Paper>
                    </Grid>
                ))}
        </Grid>
    );
};

export default Friends;
