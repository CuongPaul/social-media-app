import { useContext, useState } from "react";
import axios from "axios";
import { ChatContext, UIContext } from "../App";
import callApi from "../api";
import { storage } from "../firebase/firebase";

const url = process.env.REACT_APP_BASE_API_URL;

const useSendMessage = ({
    textMessage,
    setTextMessage,
    setShowEmoji,
    messageImage,
    removeFileImage,
    chatRoomId,
}) => {
    const [loading, setLoading] = useState(false);

    const { chatState, chatDispatch } = useContext(ChatContext);
    const { uiDispatch } = useContext(UIContext);

    const sendMessage = async (uri = "") => {
        setLoading(true);
        let friendId = chatState.selectedFriend.id;
        try {
            const { message } = await callApi({
                url: "/message",
                method: "POST",
                data: { text: textMessage, image: uri ? uri : null, chat_room_id: chatRoomId },
            });
            // let token = localStorage.getItem("token");
            // const response = await axios.post(
            //     `${url}/api/user/chat/${friendId}/send`,
            //     { text: textMessage, image: uri ? uri : "" },
            //     {
            //         headers: {
            //             Authorization: `Bearer ${token}`,
            //         },
            //     }
            // );
            if (message) {
                setTextMessage("");
                chatDispatch({
                    type: "ADD_MESSAGE",
                    payload: { text: textMessage, image: uri ? uri : null },
                });
            }
            setLoading(false);
        } catch (err) {
            setLoading(false);
            console.log(err);
            if (err && err.response) {
                if (err.response.status === 422) {
                    uiDispatch({
                        type: "SET_NOTIFICATION",
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

    const handleSubmitMessage = async (e) => {
        if (messageImage) {
            const formData = new FormData();
            formData.append("files", messageImage);
            formData.append("folder", "message");

            const { data } = await callApi({
                url: "/upload/files",
                method: "POST",
                data: formData,
            });

            sendMessage(data.images[0]);
            // let filename = `message/message-${Date.now()}-${messageImage.name}`;
            // const uploadTask = storage.ref(`images/${filename}`).put(messageImage);
            // uploadTask.on(
            //     "state_changed",
            //     () => {
            //         setLoading(true);
            //     },
            //     (err) => {
            //         setLoading(false);
            //     },
            //     () => {
            //         storage
            //             .ref("images")
            //             .child(filename)
            //             .getDownloadURL()
            //             .then((uri) => {
            //                 sendMessage(uri);
            //             });
            //     }
            // );
        } else {
            sendMessage();
        }
        removeFileImage();
        setShowEmoji(false);
    };

    return {
        handleSubmitMessage,
        loading,
    };
};

export default useSendMessage;
