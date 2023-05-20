import { useState, useContext } from "react";

import callApi from "../api";
import { UIContext } from "../App";

const useFriendAction = () => {
    const { uiDispatch } = useContext(UIContext);

    const [loading, setLoading] = useState(false);

    const acceptFriendRequest = async (request_id) => {
        setLoading(true);

        try {
            const { message } = await callApi({
                method: "PUT",
                url: `/friend-request/${request_id}`,
            });
            setLoading(false);

            uiDispatch({
                type: "SET_NOTIFICATION",
                payload: { display: true, text: message, color: "success" },
            });
        } catch (err) {
            setLoading(false);
            uiDispatch({
                type: "SET_NOTIFICATION",
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
                type: "SET_NOTIFICATION",
                payload: { display: true, text: message, color: "success" },
            });
        } catch (err) {
            setLoading(false);
            uiDispatch({
                type: "SET_NOTIFICATION",
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
                type: "SET_NOTIFICATION",
                payload: { display: true, text: message, color: "success" },
            });
        } catch (err) {
            setLoading(false);
            uiDispatch({
                type: "SET_NOTIFICATION",
                payload: { display: true, color: "error", text: err.message },
            });
        }
    };

    return {
        loading,
        sendFriendRequest,
        acceptFriendRequest,
        declineOrCancleFriendRequest,
    };
};

export default useFriendAction;
