import { useState, useContext } from "react";

import callApi from "../api";
import { UIContext, UserContext } from "../App";

const useUserActions = () => {
    const { uiDispatch } = useContext(UIContext);
    const { userDispatch } = useContext(UserContext);

    const [loading, setLoading] = useState(false);

    const handleUnfriend = async (friendId) => {
        setLoading(true);

        try {
            const { message } = await callApi({ method: "PUT", url: `/user/unfriend/${friendId}` });
            setLoading(false);

            userDispatch({ type: "UNFRIEND", payload: friendId });

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
            const { message } = await callApi({ method: "PUT", url: `/user/block/${userId}` });
            setLoading(false);

            userDispatch({ type: "BLOCK_USER", payload: userId });

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
            const { message } = await callApi({ method: "PUT", url: `/user/unblock/${userId}` });
            setLoading(false);

            userDispatch({ type: "UNBLOCK_USER", payload: userId });

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
    };
};

export default useUserActions;
