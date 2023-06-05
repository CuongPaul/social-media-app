import { useState, useContext } from "react";

import callApi from "../api";
import { UIContext, ChatContext } from "../App";

const useChatRoom = () => {
    const { uiDispatch } = useContext(UIContext);
    const { chatDispatch } = useContext(ChatContext);

    const [loading, setLoading] = useState(false);

    const handleAddMembers = async (chatRoomId, members) => {
        setLoading(true);

        try {
            const { data, message } = await callApi({
                method: "PUT",
                data: { members },
                url: `/chat-room/add-member/${chatRoomId}`,
            });
            setLoading(false);

            chatDispatch({ type: "ADD_MEMBERS", payload: data });

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

    const handleRemoveMembers = async (chatRoomId, members) => {
        setLoading(true);

        try {
            const { message } = await callApi({
                method: "PUT",
                data: { members },
                url: `/chat-room/remove-member/${chatRoomId}`,
            });
            setLoading(false);

            chatDispatch({
                payload: { members },
                type: "REMOVE_MEMBERS",
            });

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
        handleAddMembers,
        handleRemoveMembers,
    };
};

export default useChatRoom;
