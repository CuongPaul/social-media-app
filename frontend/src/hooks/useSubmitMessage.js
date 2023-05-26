import { useContext, useState } from "react";

import callApi from "../api";
import { ChatContext, UIContext } from "../App";

const useSubmitMessage = ({ text, setText, chatRoomId, fileUpload, handleRemoveFile }) => {
    const { uiDispatch } = useContext(UIContext);
    const { chatDispatch } = useContext(ChatContext);

    const [loading, setLoading] = useState(false);

    const sendMessage = async (uri = "") => {
        setLoading(true);
        try {
            const { message } = await callApi({
                url: "/message",
                method: "POST",
                data: { text: text, image: uri ? uri : null, chat_room_id: chatRoomId },
            });
            if (message) {
                setText("");
                chatDispatch({
                    type: "ADD_MESSAGE",
                    payload: { text: text, image: uri ? uri : null },
                });
            }
            setLoading(false);
        } catch (err) {
            setLoading(false);
            console.log(err);
            if (err && err.response) {
                if (err.response.status === 422) {
                    uiDispatch({
                        type: "SET_ALERT_MESSAGE",
                        payload: {
                            display: true,
                            text: err.response.data.error,
                            color: "error",
                        },
                    });
                }
            }
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (fileUpload) {
            const formData = new FormData();
            formData.append("files", fileUpload);
            formData.append("folder", "message");

            const { data } = await callApi({
                url: "/upload/files",
                method: "POST",
                data: formData,
            });

            sendMessage(data.images[0]);
        } else {
            sendMessage();
        }
        handleRemoveFile();
    };

    const handleUpdateMessage = async (messageId) => {
        if (fileUpload) {
            const formData = new FormData();
            formData.append("files", fileUpload);
            formData.append("folder", "message");

            const { data } = await callApi({
                url: "/upload/files",
                method: "POST",
                data: formData,
            });

            sendMessage(data.images[0]);
        } else {
            sendMessage();
        }
        handleRemoveFile();
    };

    return {
        loading,
        handleSendMessage,
        handleUpdateMessage,
    };
};

export default useSubmitMessage;
