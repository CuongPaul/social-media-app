import React, { useContext } from "react";
import { Button, CardActions, Typography } from "@material-ui/core";

import Friend from "./Friend";
import { UserContext } from "../../App";
import useFriendActions from "../../hooks/useFriendActions";

const UserLists = ({ users }) => {
    const { userState } = useContext(UserContext);

    const handleSendFriendRequest = (user_id) => {
        sendFriendRequest(user_id);
    };

    const filterUser = (user) => {
        let s_index = userState.sendedFriendRequests.findIndex(
            (request) => request.user.id === user.id
        );
        let r_index = userState.receivedFriendRequests.findIndex(
            (request) => request.user.id === user.id
        );
        let already_friend = userState.currentUser.friends.findIndex(
            (friend) => friend.id === user.id
        );
        let currentUser = userState.currentUser.id === user.id;

        if (s_index === -1 && r_index === -1 && already_friend === -1 && !currentUser) {
            return true;
        }
        return false;
    };

    const { sendFriendRequest } = useFriendActions();

    return (
        <div
            style={{
                display: "flex",
                marginLeft: "8px",
                marginRight: "6px",
                alignItems: "stretch",
                flexDirection: "column",
                justifyContent: "center",
            }}
        >
            <Typography
                style={{
                    fontSize: "16px",
                    marginTop: "8px",
                    fontWeight: "700",
                    marginBottom: "8px",
                }}
            >
                People you may know
            </Typography>
            {users && users.length
                ? users.map((user) => (
                      <div key={user.id} style={{ width: "100%" }}>
                          {filterUser(user) && (
                              <Friend user={user}>
                                  <CardActions>
                                      <Button
                                          onClick={() => handleSendFriendRequest(user.id)}
                                          variant="contained"
                                          style={{
                                              background: "rgb(1,133,243)",
                                              color: "white",
                                          }}
                                      >
                                          Add Friend
                                      </Button>
                                      <Button
                                          variant="contained"
                                          style={{
                                              background: "rgb(240,242,245)",
                                              color: "black",
                                          }}
                                      >
                                          Remove
                                      </Button>
                                  </CardActions>
                              </Friend>
                          )}
                      </div>
                  ))
                : null}
        </div>
    );
};

export default UserLists;
