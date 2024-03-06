import { useState, useContext } from "react";

import callApi from "../api";
import { UIContext } from "../App";
import uniqueArray from "../utils/unique-array";

const useSearch = () => {
  const { uiDispatch } = useContext(UIContext);

  const [isLoading, setIsLoading] = useState(false);

  const handleSearchUsers = async ({ name, page, setUsers }) => {
    setIsLoading(true);

    try {
      const { data } = await callApi({
        method: "GET",
        url: "/user/search",
        query: { name, page },
      });

      setUsers((pre) => [...pre, ...data.rows]);

      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);

      uiDispatch({
        type: "SET_ALERT_MESSAGE",
        payload: { display: true, color: "error", text: err.message },
      });
    }
  };

  const handleSearchFriends = async ({ name, page, setFriends }) => {
    setIsLoading(true);

    try {
      const { data } = await callApi({
        method: "GET",
        query: { name, page },
        url: "/user/search-friends",
      });

      setFriends((pre) => uniqueArray([...pre, ...data.rows]));

      setIsLoading(false);
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
