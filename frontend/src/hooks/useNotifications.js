import { useState, useContext } from "react";

import callApi from "../api";
import { UIContext } from "../App";

const useNotifications = () => {
    const { uiDispatch } = useContext(UIContext);

    const [isLoading, setIsLoading] = useState(false);

    const handleGetNotifications = async (page) => {
        setIsLoading(true);

        try {
            const { data } = await callApi({
                method: "GET",
                query: { page },
                url: "/notification",
            });

            if (page) {
                uiDispatch({ type: "ADD_NOTIFICATIONS", payload: data.rows });
            } else {
                uiDispatch({ type: "SET_NOTIFICATIONS", payload: data.rows });
            }

            setIsLoading(false);
        } catch (err) {
            setIsLoading(false);

            uiDispatch({
                type: "SET_ALERT_MESSAGE",
                payload: { display: true, color: "error", text: err.message },
            });
        }
    };

    const handleReadNotifications = async (notificationId) => {
        setIsLoading(true);

        try {
            await callApi({ method: "PUT", url: `/notification/read/${notificationId}` });

            uiDispatch({ payload: notificationId, type: "READ_NOTIFICATION" });

            setIsLoading(false);
        } catch (err) {
            setIsLoading(false);

            uiDispatch({
                type: "SET_ALERT_MESSAGE",
                payload: { display: true, color: "error", text: err.message },
            });
        }
    };

    const handleReadAllNotifications = async () => {
        setIsLoading(true);

        try {
            await callApi({ method: "PUT", url: "/notification/read-all" });

            uiDispatch({ type: "READ_ALL_NOTIFICATIONS" });

            setIsLoading(false);
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
        handleGetNotifications,
        handleReadNotifications,
        handleReadAllNotifications,
    };
};

export default useNotifications;
