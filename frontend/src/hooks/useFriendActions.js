import { useState, useContext } from "react";

import callApi from "../api";
import { UIContext } from "../App";

const useFriendAction = () => {
    const { uiDispatch } = useContext(UIContext);

    const [loading, setLoading] = useState(false);

    const blockUser = async (userId) => {
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

    const unblockUser = async (userId) => {
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

    const acceptFriendRequest = async (request_id) => {
        setLoading(true);

        try {
            const { message } = await callApi({
                method: "PUT",
                url: `/friend-request/${request_id}`,
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

    const declineOrCancleFriendRequest = async (request_id) => {
        setLoading(true);

        try {
            const { message } = await callApi({
                method: "DELETE",
                url: `/friend-request/${request_id}`,
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

    const sendFriendRequest = async (user_id) => {
        setLoading(true);

        try {
            const { message } = await callApi({
                method: "POST",
                url: "/friend-request",
                data: { receiver_id: user_id },
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

    const unfriend = async (friendId) => {
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

    return {
        loading,
        unfriend,
        blockUser,
        unblockUser,
        sendFriendRequest,
        acceptFriendRequest,
        declineOrCancleFriendRequest,
    };
};

export default useFriendAction;
