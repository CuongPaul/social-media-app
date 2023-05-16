import { useState, useContext } from "react";

import callApi from "../api";
import { UIContext } from "../App";

const useSearchFriends = () => {
    const { uiDispatch } = useContext(UIContext);

    const [friends, setFriends] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleSearchFriends = async (name) => {
        setIsLoading(true);

        try {
            setTimeout(async () => {
                const { data } = await callApi({
                    method: "GET",
                    query: { name },
                    url: "/user/search-friends",
                });

                setIsLoading(false);
                setFriends(data.rows);
            }, 5000);
            // const { data } = await callApi({
            //     method: "GET",
            //     query: { name },
            //     url: "/user/search-friends",
            // });

            // setIsLoading(false);
            // setFriends(data.rows);
        } catch (err) {
            setIsLoading(false);
            uiDispatch({
                type: "SET_NOTIFICATION",
                payload: { display: true, color: "error", text: err.message },
            });
        }
    };

    return { friends, isLoading, handleSearchFriends };
};

export default useSearchFriends;
