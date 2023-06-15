import { useState, useContext } from "react";

import callApi from "../api";
import { UIContext } from "../App";

const useSearch = () => {
    const { uiDispatch } = useContext(UIContext);

    const [isLoading, setIsLoading] = useState(false);

    const handleSearchUsers = async ({ name, setUsers }) => {
        setIsLoading(true);

        try {
            const { data } = await callApi({ method: "GET", query: { name }, url: "/user/search" });
            setIsLoading(false);

            setUsers(data.rows);
        } catch (err) {
            setIsLoading(false);
            uiDispatch({
                type: "SET_ALERT_MESSAGE",
                payload: { display: true, color: "error", text: err.message },
            });
        }
    };

    const handleSearchFriends = async ({ name, setFriends }) => {
        setIsLoading(true);

        try {
            const { data } = await callApi({
                method: "GET",
                query: { name },
                url: "/user/search-friends",
            });

            setIsLoading(false);
            setFriends(data.rows);
        } catch (err) {
            setIsLoading(false);
            uiDispatch({
                type: "SET_ALERT_MESSAGE",
                payload: { display: true, color: "error", text: err.message },
            });
        }
    };

    return { isLoading, handleSearchUsers, handleSearchFriends };
};

export default useSearch;
