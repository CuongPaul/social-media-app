import { useState, useContext } from "react";

import callApi from "../api";
import { UIContext, ChatContext } from "../App";

const useMessage = () => {
  const { uiDispatch } = useContext(UIContext);
  const { chatDispatch } = useContext(ChatContext);

  const [isLoading, setIsLoading] = useState(false);

  const handleCreateMessage = async (messageData) => {
    setIsLoading(true);

    try {
      const { text, setText, chatRoomId, fileUpload, handleRemoveFile } =
        messageData;

      let image = { url: "", path: "" };
      if (fileUpload) {
        const formData = new FormData();
        formData.append("files", fileUpload);
        formData.append("folder", "message");

        const { data } = await callApi({
          data: formData,
          method: "POST",
          url: "/upload/files",
        });

        image = data.images[0];
      }

      const { data } = await callApi({
        method: "POST",
        url: "/message",
        data: { text, image: image.url, chat_room_id: chatRoomId },
      });

      chatDispatch({ payload: data, type: "ADD_MESSAGE" });

      setText("");
      handleRemoveFile();

      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);

      uiDispatch({
        type: "SET_ALERT_MESSAGE",
        payload: { display: true, color: "error", text: err.message },
      });
    }
  };

  const handleUpdateMessage = async (messageData) => {
    setIsLoading(true);

    try {
      const {
        text,
        setText,
        messageId,
        chatRoomId,
        fileUpload,
        currentImage,
        handleRemoveFile,
      } = messageData;

      let image = { url: "", path: "" };
      if (fileUpload) {
        const formData = new FormData();
        formData.append("files", fileUpload);
        formData.append("folder", "message");

        const { data } = await callApi({
          method: "POST",
          data: formData,
          url: "/upload/files",
        });

        image = data.images[0];
      }

      const { data } = await callApi({
        method: "PUT",
        url: `/message/${messageId}`,
        data: {
          text,
          chat_room_id: chatRoomId,
          image: image.url || currentImage,
        },
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
    handleCreateMessage,
    handleUpdateMessage,
  };
};

export default useMessage;
