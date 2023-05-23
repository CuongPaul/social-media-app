import { useState, useContext } from "react";

import callApi from "../api";
import { UIContext } from "../App";

const useFriendAction = () => {
    const { uiDispatch } = useContext(UIContext);

    const [loading, setLoading] = useState(false);

    const handleUnfriend = async (friendId) => {
        setLoading(true);

        try {
            const { message } = await callApi({
                method: "PUT",
                url: `/user/unfriend/${friendId}`,
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

    const handleBlockUser = async (userId) => {
        setLoading(true);

        try {
            const { message } = await callApi({
                method: "PUT",
                url: `/user/block/${userId}`,
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

    const handleUnblockUser = async (userId) => {
        setLoading(true);

        try {
            const { message } = await callApi({
                method: "PUT",
                url: `/user/unblock/${userId}`,
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

    const handleSendFriendRequest = async (userId) => {
        setLoading(true);

        try {
            const { message } = await callApi({
                method: "POST",
                url: "/friend-request",
                data: { receiver_id: userId },
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

    const handleDeclineOrCancleFriendRequest = async (requestId) => {
        setLoading(true);

        try {
            const { message } = await callApi({
                method: "DELETE",
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

    return {
        loading,
        handleUnfriend,
        handleBlockUser,
        handleUnblockUser,
        handleSendFriendRequest,
        handleAcceptFriendRequest,
        handleDeclineOrCancleFriendRequest,
    };
};

export default useFriendAction;
