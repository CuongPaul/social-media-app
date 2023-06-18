import { Button } from "@material-ui/core";
import React, { Fragment, useContext } from "react";

import { UserContext } from "../../App";
import { useUser, useFriendRequest } from "../../hooks";

const ButtonAction = ({ text, onClick, backgroundColor }) => (
    <Button
        onClick={onClick}
        variant="contained"
        style={{
            margin: "10px",
            fontSize: "10px",
            minWidth: "80px",
            color: "rgb(255,255,255)",
            backgroundColor: backgroundColor,
        }}
    >
        {text}
    </Button>
);

const ButtonGroupUserActions = ({ userId }) => {
    const {
        userState: { currentUser, sendedFriendRequests },
    } = useContext(UserContext);

    const { handleUnfriend, handleBlockUser, handleUnblockUser } = useUser();
    const { handleSendFriendRequest, handleCancelFriendRequest } = useFriendRequest();

    const isSendedFriendRequests = sendedFriendRequests.find(
        (item) => item?.receiver._id === userId
    );
    const isBlockUsers = currentUser?.block_users.includes(userId);
    const isFriend = currentUser?.friends.find((friend) => friend._id === userId);

    return (
        <Fragment>
            {isFriend ? (
                <ButtonAction
                    text={"Unfriend"}
                    backgroundColor={"rgb(108,117,125)"}
                    onClick={() => handleUnfriend(userId)}
                />
            ) : isSendedFriendRequests ? (
                <ButtonAction
                    text={"Cancel"}
                    backgroundColor={"rgb(255,193,7)"}
                    onClick={() => handleCancelFriendRequest(isSendedFriendRequests._id)}
                />
            ) : (
                <ButtonAction
                    text={"Add"}
                    backgroundColor={"rgb(0,123,255)"}
                    onClick={() => handleSendFriendRequest(userId)}
                />
            )}
            {isBlockUsers ? (
                <ButtonAction
                    text={"Unblock"}
                    backgroundColor={"rgb(23,162,184)"}
                    onClick={() => handleUnblockUser(userId)}
                />
            ) : (
                <ButtonAction
                    text={"Block"}
                    backgroundColor={"rgb(220,53,69)"}
                    onClick={() => handleBlockUser(userId)}
                />
            )}
        </Fragment>
    );
};

export default ButtonGroupUserActions;
