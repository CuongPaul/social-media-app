import { useContext, useState } from "react";
import axios from "axios";
import { UserContext, UIContext } from "../App";
import callApi from "../api";

const url = process.env.REACT_APP_BASE_API_URL;

const useFriendAction = () => {
    const [loading, setLoading] = useState(false);
    const { userDispatch } = useContext(UserContext);
    const { uiDispatch } = useContext(UIContext);

    const acceptFriendRequest = async (request_id) => {
        try {
            const { data } = await callApi({
                url: `/friend-request/${request_id}`,
                method: "PUT",
            });
            if (data) {
                userDispatch({
                    type: "ADD_FRIEND",
                    payload: data.user,
                });
                userDispatch({
                    type: "REMOVE_FRIENDS_REQUEST_RECEIVED",
                    payload: request_id,
                });

                uiDispatch({
                    type: "SET_NOTIFICATION",
                    payload: { color: "success", display: true, text: data.message },
                });
            }
        } catch (err) {
            setLoading(false);

            if (err && err.response) {
                uiDispatch({
                    type: "SET_NOTIFICATION",
                    payload: {
                        color: "error",
                        display: true,
                        text: err.response.data.error,
                    },
                });
            }
        }
    };

    const declineFriendRequest = async (request_id) => {
        try {
            const { data } = await callApi({
                url: `/friend-request/${request_id}`,
                method: "DELETE",
            });
            if (data) {
                userDispatch({
                    type: "REMOVE_FRIENDS_REQUEST_RECEIVED",
                    payload: request_id,
                });
                uiDispatch({
                    type: "SET_NOTIFICATION",
                    payload: { color: "success", display: true, text: data.message },
                });
            }
        } catch (err) {
            setLoading(false);

            if (err && err.response) {
                uiDispatch({
                    type: "SET_NOTIFICATION",
                    payload: {
                        color: "error",
                        display: true,
                        text: err.response.data.error,
                    },
                });
            }
        }
    };

    const sendFriendRequest = async (user_id) => {
        try {
            setLoading(true);
            const { message } = await callApi({
                url: "/friend-request",
                method: "POST",
                data: { receiver_id: user_id },
            });
            setLoading(false);
            if (message) {
                uiDispatch({
                    type: "SET_NOTIFICATION",
                    payload: { color: "success", display: true, text: message },
                });
            }
        } catch (err) {
            setLoading(false);

            if (err && err.response) {
                uiDispatch({
                    type: "SET_NOTIFICATION",
                    payload: {
                        color: "error",
                        display: true,
                        text: err.response.data.error,
                    },
                });
            }
        }
    };

    const cancelFriendRequest = async (request_id) => {
        try {
            const { data } = await callApi({
                url: `/friend-request/${request_id}`,
                method: "DELETE",
            });
            if (data) {
                userDispatch({
                    type: "REMOVE_FRIENDS_REQUEST_SENDED",
                    payload: request_id,
                });
                uiDispatch({
                    type: "SET_NOTIFICATION",
                    payload: { color: "success", display: true, text: data.message },
                });
            }
        } catch (err) {
            if (err && err.response) {
                uiDispatch({
                    type: "SET_NOTIFICATION",
                    payload: {
                        color: "error",
                        display: true,
                        text: err.response.data.error,
                    },
                });
            }
        }
    };

    return {
        sendFriendRequest,
        declineFriendRequest,
        acceptFriendRequest,
        cancelFriendRequest,
        loading,
    };
};

export default useFriendAction;
