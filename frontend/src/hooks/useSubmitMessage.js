import { useContext, useState } from "react";

import callApi from "../api";
import { UIContext, ChatContext } from "../App";

const useSubmitMessage = () => {
    const { uiDispatch } = useContext(UIContext);
    const { chatDispatch } = useContext(ChatContext);

    const [isLoading, setIsLoading] = useState(false);

    const handleSendMessage = async ({
        text,
        setText,
        chatRoomId,
        fileUpload,
        handleRemoveFile,
    }) => {
        setIsLoading(true);

        try {
            let imageUrl = "";
            if (fileUpload) {
                const formData = new FormData();
                formData.append("files", fileUpload);
                formData.append("folder", "message");

                const { data } = await callApi({
                    data: formData,
                    method: "POST",
                    url: "/upload/files",
                });

                imageUrl = data.images[0];
            }

            const { data } = await callApi({
                method: "POST",
                url: "/message",
                data: { text, image: imageUrl, chat_room_id: chatRoomId },
            });
            chatDispatch({ payload: data, type: "ADD_MESSAGE" });

            setText("");
            handleRemoveFile();
            setIsLoading(false);
        } catch (err) {
            setIsLoading(true);
            uiDispatch({
                type: "SET_ALERT_MESSAGE",
                payload: { display: true, color: "error", text: err.message },
            });
        }
    };

    const handleUpdateMessage = async ({
        text,
        setText,
        messageId,
        chatRoomId,
        fileUpload,
        currentImage,
        handleRemoveFile,
    }) => {
        setIsLoading(true);

        try {
            let imageUrl = "";
            if (fileUpload) {
                const formData = new FormData();
                formData.append("files", fileUpload);
                formData.append("folder", "message");

                const { data } = await callApi({
                    method: "POST",
                    data: formData,
                    url: "/upload/files",
                });

                imageUrl = data.images[0];
            }

            const { data } = await callApi({
                method: "PUT",
                url: `/message/${messageId}`,
                data: { text, chat_room_id: chatRoomId, image: imageUrl || currentImage },
            });
            chatDispatch({ payload: data, type: "UPDATE_MESSAGE_SELECTED" });

            setText("");
            handleRemoveFile();
            setIsLoading(false);
        } catch (err) {
            setIsLoading(true);
            uiDispatch({
                type: "SET_ALERT_MESSAGE",
                payload: { display: true, color: "error", text: err.message },
            });
        }
    };

    return {
        isLoading,
        handleSendMessage,
        handleUpdateMessage,
    };
};

export default useSubmitMessage;
