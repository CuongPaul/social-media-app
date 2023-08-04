import { useState, useContext } from "react";

import callApi from "../api";
import { UIContext, ChatContext } from "../App";

const useChatRoom = () => {
    const { uiDispatch } = useContext(UIContext);
    const { chatDispatch } = useContext(ChatContext);

    const [isLoading, setIsLoading] = useState(false);

    const handleAddMembers = async ({ members, chatRoomId }) => {
        setIsLoading(true);

        try {
            const { data, message } = await callApi({
                method: "PUT",
                data: { members },
                url: `/chat-room/add-member/${chatRoomId}`,
            });

            chatDispatch({ type: "ADD_MEMBERS", payload: data });
            uiDispatch({
                type: "SET_ALERT_MESSAGE",
                payload: { display: true, text: message, color: "success" },
            });

            setIsLoading(false);
        } catch (err) {
            setIsLoading(false);

            uiDispatch({
                type: "SET_ALERT_MESSAGE",
                payload: { display: true, color: "error", text: err.message },
            });
        }
    };

    const handleChangeAdmin = async ({ newAdmin, chatRoomId }) => {
        setIsLoading(true);

        try {
            const { message } = await callApi({
                method: "PUT",
                data: { new_admin: newAdmin },
                url: `/chat-room/change-admin/${chatRoomId}`,
            });

            chatDispatch({
                type: "SET_NEW_ADMIN",
                payload: { newAdmin, chatRoomId: chatRoomId },
            });
            uiDispatch({
                type: "SET_ALERT_MESSAGE",
                payload: { display: true, text: message, color: "success" },
            });

            setIsLoading(false);
        } catch (err) {
            setIsLoading(false);

            uiDispatch({
                type: "SET_ALERT_MESSAGE",
                payload: { display: true, color: "error", text: err.message },
            });
        }
    };
    const handleJoinChatRoom = async (chat) => {
        setIsLoading(true);

        try {
            const { data: chatRoomData } = await callApi({
                method: "PUT",
                url: `/chat-room/join-chat/${chat._id}`,
            });
            chatDispatch({ type: "ADD_CHATROOM", payload: chatRoomData });
            chatDispatch({ type: "SET_CHATROOM_SELECTED", payload: chatRoomData });

            const { data: messagesData } = await callApi({
                method: "GET",
                url: `/message/chat-room/${chat._id}`,
            });
            chatDispatch({ type: "SET_MESSAGES", payload: messagesData.rows });

            setIsLoading(false);
        } catch (err) {
            setIsLoading(false);

            uiDispatch({
                type: "SET_ALERT_MESSAGE",
                payload: { display: true, color: "error", text: err.message },
            });
        }
    };

    const handleLeaveChatRoom = async (chatRoomId) => {
        setIsLoading(true);

        try {
            const { message } = await callApi({
                method: "PUT",
                url: `/chat-room/leave-chat/${chatRoomId}`,
            });

            chatDispatch({ payload: chatRoomId, type: "REMOVE_CHATROOM" });
            chatDispatch({ payload: null, type: "SET_CHATROOM_SELECTED" });
            uiDispatch({
                type: "SET_ALERT_MESSAGE",
                payload: { display: true, text: message, color: "success" },
            });

            setIsLoading(false);
        } catch (err) {
            setIsLoading(false);

            uiDispatch({
                type: "SET_ALERT_MESSAGE",
                payload: { display: true, color: "error", text: err.message },
            });
        }
    };

    const handleRemoveMembers = async ({ members, chatRoomId }) => {
        setIsLoading(true);

        try {
            const { message } = await callApi({
                method: "PUT",
                data: { members },
                url: `/chat-room/remove-member/${chatRoomId}`,
            });

            chatDispatch({
                payload: { members },
                type: "REMOVE_MEMBERS",
            });
            uiDispatch({
                type: "SET_ALERT_MESSAGE",
                payload: { display: true, text: message, color: "success" },
            });

            setIsLoading(false);
        } catch (err) {
            setIsLoading(false);

            uiDispatch({
                type: "SET_ALERT_MESSAGE",
                payload: { display: true, color: "error", text: err.message },
            });
        }
    };

    const handleCreateChatRoom = async (chatRoomData) => {
        setIsLoading(true);

        try {
            const { isPublic, imageUpload, chatRoomName, chatRoomMembers } = chatRoomData;

            let image = { url: "", path: "" };
            if (imageUpload) {
                const formData = new FormData();
                formData.append("files", imageUpload);
                formData.append("folder", "chat-room-avatar");

                const { data } = await callApi({
                    method: "POST",
                    data: formData,
                    url: "/upload/files",
                });

                image = data.images[0];
            }

            const { data } = await callApi({
                method: "POST",
                url: "/chat-room",
                data: {
                    name: chatRoomName,
                    is_public: isPublic,
                    avatar_image: image.url,
                    members: chatRoomMembers,
                },
            });
            chatDispatch({ payload: [], type: "SET_MESSAGES" });
            chatDispatch({ payload: data, type: "ADD_CHATROOM" });
            chatDispatch({ payload: data, type: "SET_CHATROOM_SELECTED" });

            setIsLoading(false);
        } catch (err) {
            setIsLoading(false);

            uiDispatch({
                type: "SET_ALERT_MESSAGE",
                payload: { display: true, color: "error", text: err.message },
            });
        }
    };

    const handleDeleteChatRoom = async (chatRoomId) => {
        setIsLoading(true);

        try {
            const { message } = await callApi({
                method: "DELETE",
                url: `/chat-room/${chatRoomId}`,
            });

            chatDispatch({ payload: chatRoomId, type: "REMOVE_CHATROOM" });
            chatDispatch({ payload: null, type: "SET_CHATROOM_SELECTED" });
            uiDispatch({
                type: "SET_ALERT_MESSAGE",
                payload: { display: true, text: message, color: "success" },
            });

            setIsLoading(false);
        } catch (err) {
            setIsLoading(false);

            uiDispatch({
                type: "SET_ALERT_MESSAGE",
                payload: { display: true, color: "error", text: err.message },
            });
        }
    };

    const handleSelectChatRoom = async (chat) => {
        setIsLoading(true);

        try {
            const { data } = await callApi({
                method: "GET",
                url: `/message/chat-room/${chat._id}`,
            });
            chatDispatch({ type: "SET_MESSAGES", payload: data.rows });
            chatDispatch({ type: "SET_CHATROOM_SELECTED", payload: chat });

            setIsLoading(false);
        } catch (err) {
            setIsLoading(false);

            uiDispatch({
                type: "SET_ALERT_MESSAGE",
                payload: { display: true, color: "error", text: err.message },
            });
        }
    };

    const handleUpdateChatRoom = async (chatRoomData) => {
        setIsLoading(true);

        try {
            const { isPublic, chatRoomId, imageUpload, chatRoomName, currentImage } = chatRoomData;

            let image = { url: "", path: "" };
            if (imageUpload) {
                const formData = new FormData();
                formData.append("files", imageUpload);
                formData.append("folder", "chat-room-avatar");

                const { data } = await callApi({
                    data: formData,
                    method: "POST",
                    url: "/upload/files",
                });

                image = data.images[0];
            }

            const { data } = await callApi({
                method: "PUT",
                data: {
                    name: chatRoomName,
                    is_public: isPublic,
                    avatar_image: image.url || currentImage,
                },
                url: `/chat-room/update-info/${chatRoomId}`,
            });
            chatDispatch({ type: "UPDATE_CHATROOM", payload: data });

            setIsLoading(false);
        } catch (err) {
            setIsLoading(false);

            uiDispatch({
                type: "SET_ALERT_MESSAGE",
                payload: { display: true, color: "error", text: err.message },
            });
        }
    };

    const handleSearchChatRooms = async ({ name, setChatRooms }) => {
        setIsLoading(true);

        try {
            const { data } = await callApi({
                method: "GET",
                query: { name },
                url: "/chat-room/search",
            });

            setChatRooms(data.rows);

            setIsLoading(false);
        } catch (err) {
            setIsLoading(false);

            uiDispatch({
                type: "SET_ALERT_MESSAGE",
                payload: { display: true, color: "error", text: err.message },
            });
        }
    };

    const handleCreateChatRoomForTwoPeople = async (reciverId) => {
        setIsLoading(true);

        try {
            const { data } = await callApi({
                method: "POST",
                data: { reciver: reciverId },
                url: `/chat-room/two-people`,
            });

            chatDispatch({ type: "ADD_CHATROOM", payload: data });
            chatDispatch({ type: "SET_CHATROOM_SELECTED", payload: data });

            setIsLoading(false);
        } catch (err) {
            setIsLoading(false);

            uiDispatch({
                type: "SET_ALERT_MESSAGE",
                payload: { display: true, color: "error", text: err.message },
            });
        }
    };

    return {
        isLoading,
        handleAddMembers,
        handleChangeAdmin,
        handleJoinChatRoom,
        handleLeaveChatRoom,
        handleRemoveMembers,
        handleCreateChatRoom,
        handleDeleteChatRoom,
        handleSelectChatRoom,
        handleUpdateChatRoom,
        handleSearchChatRooms,
        handleCreateChatRoomForTwoPeople,
    };
};

export default useChatRoom;
