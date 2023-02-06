import axios from "axios";

const baseURL = process.env.REACT_APP_BASE_API_URL;

const joinChatRoom = async (chatRoomId) => {
    try {
        const token = localStorage.token && JSON.parse(localStorage.token);

        const { data } = await axios({
            method: "PUT",
            timeout: 3 * 1000,
            url: `/join-chat/${chatRoomId}`,
            baseURL: `${baseApiUrl}//chat-room`,
            headers: { Authorization: `Bearer ${token}` },
        });

        return data;
    } catch (err) {
        if (err.response) {
            return {
                status: err.response.status,
                error: err.response.data.error,
            };
        } else {
            if (err.request) {
                throw new Error("The connection has time out");
            } else {
                throw new Error(err.message);
            }
        }
    }
};

const leaveChatRoom = async (chatRoomId) => {
    try {
        const token = localStorage.token && JSON.parse(localStorage.token);

        const { data } = await axios({
            method: "PUT",
            timeout: 3 * 1000,
            url: `/leave-chat/${chatRoomId}`,
            baseURL: `${baseApiUrl}//chat-room`,
            headers: { Authorization: `Bearer ${token}` },
        });

        return data;
    } catch (err) {
        if (err.response) {
            return {
                status: err.response.status,
                error: err.response.data.error,
            };
        } else {
            if (err.request) {
                throw new Error("The connection has time out");
            } else {
                throw new Error(err.message);
            }
        }
    }
};

const createChatRoom = async (newChatRoomInfo) => {
    try {
        const token = localStorage.token && JSON.parse(localStorage.token);

        const { data } = await axios({
            url: `/`,
            method: "POST",
            timeout: 3 * 1000,
            data: newChatRoomInfo,
            baseURL: `${baseApiUrl}//chat-room`,
            headers: { Authorization: `Bearer ${token}` },
        });

        return data;
    } catch (err) {
        if (err.response) {
            return {
                status: err.response.status,
                error: err.response.data.error,
            };
        } else {
            if (err.request) {
                throw new Error("The connection has time out");
            } else {
                throw new Error(err.message);
            }
        }
    }
};

const deleteChatRoom = async (chatRoomId) => {
    try {
        const token = localStorage.token && JSON.parse(localStorage.token);

        const { data } = await axios({
            method: "DELETE",
            timeout: 3 * 1000,
            url: `//${chatRoomId}`,
            baseURL: `${baseApiUrl}//chat-room`,
            headers: { Authorization: `Bearer ${token}` },
        });

        return data;
    } catch (err) {
        if (err.response) {
            return {
                status: err.response.status,
                error: err.response.data.error,
            };
        } else {
            if (err.request) {
                throw new Error("The connection has time out");
            } else {
                throw new Error(err.message);
            }
        }
    }
};

const searchChatRooms = async (chatRoomName) => {
    try {
        const token = localStorage.token && JSON.parse(localStorage.token);

        const { data } = await axios({
            method: "GET",
            timeout: 3 * 1000,
            url: "/chat-room/search",
            params: { name: chatRoomName },
            baseURL: `${baseApiUrl}//chat-room`,
            headers: { Authorization: `Bearer ${token}` },
        });

        return data;
    } catch (err) {
        if (err.response) {
            return {
                status: err.response.status,
                error: err.response.data.error,
            };
        } else {
            if (err.request) {
                throw new Error("The connection has time out");
            } else {
                throw new Error(err.message);
            }
        }
    }
};

const updateNameChatRoom = async ({ chatRoomId, chatRoomName }) => {
    try {
        const token = localStorage.token && JSON.parse(localStorage.token);

        const { data } = await axios({
            method: "PUT",
            timeout: 3 * 1000,
            data: { name: chatRoomName },
            url: `/update-name/${chatRoomId}`,
            baseURL: `${baseApiUrl}//chat-room`,
            headers: { Authorization: `Bearer ${token}` },
        });

        return data;
    } catch (err) {
        if (err.response) {
            return {
                status: err.response.status,
                error: err.response.data.error,
            };
        } else {
            if (err.request) {
                throw new Error("The connection has time out");
            } else {
                throw new Error(err.message);
            }
        }
    }
};

const updateAvatarChatRoom = async ({ chatRoomId, chatRoomAvatar }) => {
    try {
        const token = localStorage.token && JSON.parse(localStorage.token);

        const { data } = await axios({
            method: "PUT",
            timeout: 3 * 1000,
            baseURL: `${baseApiUrl}//chat-room`,
            url: `/update-avatar/${chatRoomId}`,
            data: { avatar_image: chatRoomAvatar },
            headers: { Authorization: `Bearer ${token}` },
        });

        return data;
    } catch (err) {
        if (err.response) {
            return {
                status: err.response.status,
                error: err.response.data.error,
            };
        } else {
            if (err.request) {
                throw new Error("The connection has time out");
            } else {
                throw new Error(err.message);
            }
        }
    }
};

const addMembersToChatRoom = async ({ chatRoomId, members }) => {
    try {
        const token = localStorage.token && JSON.parse(localStorage.token);

        const { data } = await axios({
            method: "PUT",
            data: { members },
            timeout: 3 * 1000,
            url: `/add-member/${chatRoomId}`,
            baseURL: `${baseApiUrl}//chat-room`,
            headers: { Authorization: `Bearer ${token}` },
        });

        return data;
    } catch (err) {
        if (err.response) {
            return {
                status: err.response.status,
                error: err.response.data.error,
            };
        } else {
            if (err.request) {
                throw new Error("The connection has time out");
            } else {
                throw new Error(err.message);
            }
        }
    }
};

const removeMemberChatRoom = async ({ chatRoomId, memberId }) => {
    try {
        const token = localStorage.token && JSON.parse(localStorage.token);

        const { data } = await axios({
            method: "PUT",
            timeout: 3 * 1000,
            params: { memberId },
            baseURL: `${baseApiUrl}//chat-room`,
            url: `/remove-member/${chatRoomId}`,
            headers: { Authorization: `Bearer ${token}` },
        });

        return data;
    } catch (err) {
        if (err.response) {
            return {
                status: err.response.status,
                error: err.response.data.error,
            };
        } else {
            if (err.request) {
                throw new Error("The connection has time out");
            } else {
                throw new Error(err.message);
            }
        }
    }
};

const updatePrivacyChatRoom = async (chatRoomId) => {
    try {
        const token = localStorage.token && JSON.parse(localStorage.token);

        const { data } = await axios({
            method: "PUT",
            timeout: 3 * 1000,
            baseURL: `${baseApiUrl}//chat-room`,
            url: `/update-privacy/${chatRoomId}`,
            headers: { Authorization: `Bearer ${token}` },
        });

        return data;
    } catch (err) {
        if (err.response) {
            return {
                status: err.response.status,
                error: err.response.data.error,
            };
        } else {
            if (err.request) {
                throw new Error("The connection has time out");
            } else {
                throw new Error(err.message);
            }
        }
    }
};

const getChatRoomsByCurrentUser = async () => {
    try {
        const token = localStorage.token && JSON.parse(localStorage.token);

        const { data } = await axios({
            url: `/`,
            method: "GET",
            timeout: 3 * 1000,
            baseURL: `${baseApiUrl}//chat-room`,
            headers: { Authorization: `Bearer ${token}` },
        });

        return data;
    } catch (err) {
        if (err.response) {
            return {
                status: err.response.status,
                error: err.response.data.error,
            };
        } else {
            if (err.request) {
                throw new Error("The connection has time out");
            } else {
                throw new Error(err.message);
            }
        }
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
