import { useContext, useState } from "react";
import axios from "axios";
import { ChatContext, UIContext } from "../App";
import { storage } from "../firebase/firebase";

const url = process.env.REACT_APP_BASE_API_URL;

const useSendMessage = ({
    textMessage,
    setTextMessage,
    setShowEmoji,
    messageImage,
    removeFileImage,
}) => {
    const [loading, setLoading] = useState(false);

    const { chatState, chatDispatch } = useContext(ChatContext);
    const { uiDispatch } = useContext(UIContext);

    const sendMessage = async (uri = "") => {
        setLoading(true);
        let friendId = chatState.selectedFriend.id;
        try {
            let token = JSON.parse(localStorage.getItem("token"));
            const response = await axios.post(
                `${url}/api/user/chat/${friendId}/send`,
                { text: textMessage, image: uri ? uri : "" },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (response.data) {
                setTextMessage("");
                chatDispatch({ type: "ADD_MESSAGE", payload: response.data.data });
            }
            setLoading(false);
        } catch (err) {
            setLoading(false);
            console.log(err);
            if (err && err.response) {
                if (err.response.status === 422) {
                    uiDispatch({
                        type: "SET_MESSAGE",
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

    const handleSubmitMessage = (e) => {
        if (messageImage) {
            let filename = `message/message-${Date.now()}-${messageImage.name}`;
            const uploadTask = storage.ref(`images/${filename}`).put(messageImage);
            uploadTask.on(
                "state_changed",
                () => {
                    setLoading(true);
                },
                (err) => {
                    console.log("error from firebase");
                    setLoading(false);
                },
                () => {
                    storage
                        .ref("images")
                        .child(filename)
                        .getDownloadURL()
                        .then((uri) => {
                            sendMessage(uri);
                        });
                }
            );
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
