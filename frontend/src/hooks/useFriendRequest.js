import { useState, useContext } from "react";

import callApi from "../api";
import { UIContext, UserContext } from "../App";

const useFriendRequest = () => {
    const { uiDispatch } = useContext(UIContext);
    const { userDispatch } = useContext(UserContext);

    const [isLoading, setIsLoading] = useState(false);

    const handleSendFriendRequest = async (userId) => {
        setIsLoading(true);

        try {
            const { data, message } = await callApi({
                method: "POST",
                url: "/friend-request",
                data: { receiver_id: userId },
            });
            setIsLoading(false);

            if (data) {
                userDispatch({ type: "SEND_FRIEND_REQUEST", payload: data });
            }

            uiDispatch({
                type: "SET_ALERT_MESSAGE",
                payload: { display: true, text: message, color: "success" },
            });
        } catch (err) {
            setIsLoading(false);
            uiDispatch({
                type: "SET_ALERT_MESSAGE",
                payload: { display: true, color: "error", text: err.message },
            });
        }
    };

    const handleAcceptFriendRequest = async (request) => {
        setIsLoading(true);

        try {
            const { message } = await callApi({
                method: "PUT",
                url: `/friend-request/${request._id}`,
            });
            setIsLoading(false);

            userDispatch({ type: "ADD_FRIEND", payload: request.sender });
            userDispatch({ type: "ACCEPT_FRIEND_REQUEST", payload: request._id });

            uiDispatch({
                type: "SET_ALERT_MESSAGE",
                payload: { display: true, text: message, color: "success" },
            });
        } catch (err) {
            setIsLoading(false);
            uiDispatch({
                type: "SET_ALERT_MESSAGE",
                payload: { display: true, color: "error", text: err.message },
            });
        }
    };

    const handleCancelFriendRequest = async (requestId) => {
        setIsLoading(true);

        try {
            const { message } = await callApi({
                method: "DELETE",
                url: `/friend-request/${requestId}`,
            });
            setIsLoading(false);

            userDispatch({ type: "CANCEL_FRIEND_REQUEST", payload: requestId });

            uiDispatch({
                type: "SET_ALERT_MESSAGE",
                payload: { display: true, text: message, color: "success" },
            });
        } catch (err) {
            setIsLoading(false);
            uiDispatch({
                type: "SET_ALERT_MESSAGE",
                payload: { display: true, color: "error", text: err.message },
            });
        }
    };

    const handleDeclineFriendRequest = async (requestId) => {
        setIsLoading(true);

        try {
            const { message } = await callApi({
                method: "DELETE",
                url: `/friend-request/${requestId}`,
            });
            setIsLoading(false);

            userDispatch({ type: "DECLINE_FRIEND_REQUEST", payload: requestId });

            uiDispatch({
                type: "SET_ALERT_MESSAGE",
                payload: { display: true, text: message, color: "success" },
            });
        } catch (err) {
            setIsLoading(false);
            uiDispatch({
                type: "SET_ALERT_MESSAGE",
                payload: { display: true, color: "error", text: err.message },
            });
        }
    };

    return {
        isLoading,
        handleSendFriendRequest,
        handleAcceptFriendRequest,
        handleCancelFriendRequest,
        handleDeclineFriendRequest,
    };
};

export default useFriendRequest;
