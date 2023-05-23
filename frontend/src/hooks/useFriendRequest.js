import { useState, useContext } from "react";

import callApi from "../api";
import { UIContext, UserContext } from "../App";

const useFriendAction = () => {
    const { uiDispatch } = useContext(UIContext);
    const { userDispatch } = useContext(UserContext);

    const [loading, setLoading] = useState(false);

    const handleSendFriendRequest = async (userId) => {
        setLoading(true);

        try {
            const { data, message } = await callApi({
                method: "POST",
                url: "/friend-request",
                data: { receiver_id: userId },
            });
            setLoading(false);

            if (data) {
                userDispatch({ type: "SEND_FRIEND_REQUEST", payload: data });
            }

            uiDispatch({
                type: "SET_ALERT_MESSAGE",
                payload: { display: true, text: message, color: "success" },
            });
        } catch (err) {
            setLoading(false);
            uiDispatch({
                type: "SET_ALERT_MESSAGE",
                payload: { display: true, color: "error", text: err.message },
            });
        }
    };

    const handleAcceptFriendRequest = async (requestId) => {
        setLoading(true);

        try {
            const { message } = await callApi({
                method: "PUT",
                url: `/friend-request/${requestId}`,
            });
            setLoading(false);

            uiDispatch({
                type: "SET_ALERT_MESSAGE",
                payload: { display: true, text: message, color: "success" },
            });
        } catch (err) {
            setLoading(false);
            uiDispatch({
                type: "SET_ALERT_MESSAGE",
                payload: { display: true, color: "error", text: err.message },
            });
        }
    };

    const handleCancelFriendRequest = async (requestId) => {
        setLoading(true);

        try {
            const { message } = await callApi({
                method: "DELETE",
                url: `/friend-request/${requestId}`,
            });
            setLoading(false);

            userDispatch({ type: "CANCEL_FRIEND_REQUEST", payload: requestId });

            uiDispatch({
                type: "SET_ALERT_MESSAGE",
                payload: { display: true, text: message, color: "success" },
            });
        } catch (err) {
            setLoading(false);
            uiDispatch({
                type: "SET_ALERT_MESSAGE",
                payload: { display: true, color: "error", text: err.message },
            });
        }
    };

    return {
        loading,
        handleSendFriendRequest,
        handleAcceptFriendRequest,
        handleCancelFriendRequest,
    };
};

export default useFriendAction;
