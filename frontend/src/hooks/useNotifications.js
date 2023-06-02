import { useState, useContext } from "react";

import callApi from "../api";
import { UIContext } from "../App";

const useNotifications = () => {
    const { uiDispatch } = useContext(UIContext);

    const [loading, setLoading] = useState(false);

    const handleReadNotifications = async (notificationId) => {
        setLoading(true);

        try {
            await callApi({ method: "PUT", url: `/notification/read/${notificationId}` });

            uiDispatch({ payload: notificationId, type: "READ_NOTIFICATIONS" });

            setLoading(false);
        } catch (err) {
            setLoading(false);
            uiDispatch({
                type: "SET_ALERT_MESSAGE",
                payload: { display: true, color: "error", text: err.message },
            });
        }
    };

    const handleReadAllNotifications = async () => {
        setLoading(true);

        try {
            await callApi({ method: "PUT", url: "/notification/read-all" });

            uiDispatch({ type: "READ_ALL_NOTIFICATIONS" });

            setLoading(false);
        } catch (err) {
            setLoading(false);
            uiDispatch({
                type: "SET_ALERT_MESSAGE",
                payload: { display: true, color: "error", text: err.message },
            });
        }
    };

    return { loading, handleReadNotifications, handleReadAllNotifications };
};

export default useNotifications;
