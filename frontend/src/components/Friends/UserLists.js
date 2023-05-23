import React, { useContext, useEffect, useState } from "react";
import { Button, CardActions, Typography } from "@material-ui/core";

import Friend from "./Friend";
import { UserContext } from "../../App";
import useFriendActions from "../../hooks/useFriendRequest";
import callApi from "../../api";

const UserLists = ({ friendRequest, friendIncomming }) => {
    const { userState } = useContext(UserContext);

    const [users, setUsers] = useState(null);

    const filterUser = (user) => {
        let s_index = friendRequest?.findIndex((request) => request.sender._id === user._id);
        let r_index = friendIncomming?.findIndex((request) => request.receiver._id === user._id);
        let already_friend = userState.currentUser.friends.findIndex(
            (friend) => friend._id === user._id
        );
        let currentUser = userState.currentUser.id === user._id;

        if (s_index === -1 && r_index === -1 && already_friend === -1 && !currentUser) {
            return true;
        }
        return false;
    };

    useEffect(() => {
        (async () => {
            const { data } = await callApi({ url: "/user/recommend-users", method: "GET" });
            setUsers(data.rows);
        })();
    }, []);

    const { handleSendFriendRequest } = useFriendActions();

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
                      <div key={user._id} style={{ width: "100%" }}>
                          {filterUser(user) && (
                              <Friend user={user}>
                                  <CardActions>
                                      <Button
                                          onClick={() => handleSendFriendRequest(user._id)}
                                          variant="contained"
                                          style={{
                                              background: "rgb(1,133,243)",
                                              color: "white",
                                          }}
                                      >
                                          Add Friend
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
