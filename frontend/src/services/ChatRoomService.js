import axios from "axios";

const baseURL = process.env.REACT_APP_BASE_API_URL;
const token = localStorage.token && JSON.parse(localStorage.token);

const joinChatRoom = async (chatRoomId) => {
    try {
        const { data } = await axios({
            method: "PUT",
            url: `/join-chat/${chatRoomId}`,
            baseURL: `${baseURL}/api/chat-room`,
            headers: { Authorization: `Bearer ${token}` },
        });

        return data.data;
    } catch (err) {
        return {
            errorMessage: err.response.data.message,
        };
    }
};

const leaveChatRoom = async (chatRoomId) => {
    try {
        const { data } = await axios({
            method: "PUT",
            url: `/leave-chat/${chatRoomId}`,
            baseURL: `${baseURL}/api/chat-room`,
            headers: { Authorization: `Bearer ${token}` },
        });

        return data.data;
    } catch (err) {
        return {
            errorMessage: err.response.data.message,
        };
    }
};

const createChatRoom = async (newChatRoomInfo) => {
    try {
        const { data } = await axios({
            url: `/`,
            method: "POST",
            data: newChatRoomInfo,
            baseURL: `${baseURL}/api/chat-room`,
            headers: { Authorization: `Bearer ${token}` },
        });

        return data.data;
    } catch (err) {
        return {
            errorMessage: err.response.data.message,
        };
    }
};

const deleteChatRoom = async (chatRoomId) => {
    try {
        const { data } = await axios({
            method: "DELETE",
            url: `//${chatRoomId}`,
            baseURL: `${baseURL}/api/chat-room`,
            headers: { Authorization: `Bearer ${token}` },
        });

        return data.data;
    } catch (err) {
        return {
            errorMessage: err.response.data.message,
        };
    }
};

const searchChatRooms = async (chatRoomName) => {
    try {
        const { data } = await axios({
            method: "GET",
            url: "/chat-room/search",
            params: { name: chatRoomName },
            baseURL: `${baseURL}/api/chat-room`,
            headers: { Authorization: `Bearer ${token}` },
        });

        return data.data;
    } catch (err) {
        return {
            errorMessage: err.response.data.message,
        };
    }
};

const updateNameChatRoom = async ({ chatRoomId, chatRoomName }) => {
    try {
        const { data } = await axios({
            method: "PUT",
            data: { name: chatRoomName },
            url: `/update-name/${chatRoomId}`,
            baseURL: `${baseURL}/api/chat-room`,
            headers: { Authorization: `Bearer ${token}` },
        });

        return data.data;
    } catch (err) {
        return {
            errorMessage: err.response.data.message,
        };
    }
};

const updateAvatarChatRoom = async ({ chatRoomId, chatRoomAvatar }) => {
    try {
        const { data } = await axios({
            method: "PUT",
            baseURL: `${baseURL}/api/chat-room`,
            url: `/update-avatar/${chatRoomId}`,
            data: { avatar_image: chatRoomAvatar },
            headers: { Authorization: `Bearer ${token}` },
        });

        return data.data;
    } catch (err) {
        return {
            errorMessage: err.response.data.message,
        };
    }
};

const addMembersToChatRoom = async ({ chatRoomId, members }) => {
    try {
        const { data } = await axios({
            method: "PUT",
            data: { members },
            url: `/add-member/${chatRoomId}`,
            baseURL: `${baseURL}/api/chat-room`,
            headers: { Authorization: `Bearer ${token}` },
        });

        return data.data;
    } catch (err) {
        return {
            errorMessage: err.response.data.message,
        };
    }
};

const removeMemberChatRoom = async ({ chatRoomId, memberId }) => {
    try {
        const { data } = await axios({
            method: "PUT",
            params: { memberId },
            baseURL: `${baseURL}/api/chat-room`,
            url: `/remove-member/${chatRoomId}`,
            headers: { Authorization: `Bearer ${token}` },
        });

        return data.data;
    } catch (err) {
        return {
            errorMessage: err.response.data.message,
        };
    }
};

const updatePrivacyChatRoom = async (chatRoomId) => {
    try {
        const { data } = await axios({
            method: "PUT",
            baseURL: `${baseURL}/api/chat-room`,
            url: `/update-privacy/${chatRoomId}`,
            headers: { Authorization: `Bearer ${token}` },
        });

        return data.data;
    } catch (err) {
        return {
            errorMessage: err.response.data.message,
        };
    }
};

const getChatRoomsByCurrentUser = async () => {
    try {
        const { data } = await axios({
            url: `/`,
            method: "GET",
            baseURL: `${baseURL}/api/chat-room`,
            headers: { Authorization: `Bearer ${token}` },
        });

        return data.data;
    } catch (err) {
        return {
            errorMessage: err.response.data.message,
        };
    }
};

export {
    joinChatRoom,
    leaveChatRoom,
    createChatRoom,
    deleteChatRoom,
    searchChatRooms,
    updateNameChatRoom,
    updateAvatarChatRoom,
    addMembersToChatRoom,
    removeMemberChatRoom,
    updatePrivacyChatRoom,
    getChatRoomsByCurrentUser,
};
