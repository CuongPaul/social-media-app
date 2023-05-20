import { useState, useContext } from "react";

import callApi from "../api";
import { UIContext } from "../App";

const useSearchUsers = () => {
    const { uiDispatch } = useContext(UIContext);

    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleSearchUsers = async (name) => {
        setIsLoading(true);

        try {
            const { data } = await callApi({ method: "GET", query: { name }, url: "/user/search" });

            setIsLoading(false);
            setUsers(data.rows);
        } catch (err) {
            setIsLoading(false);
            uiDispatch({
                type: "SET_ALERT_NOTIFICATION",
                payload: { display: true, color: "error", text: err.message },
            });
        }
    };

    return { users, isLoading, handleSearchUsers };
};

export default useSearchUsers;
