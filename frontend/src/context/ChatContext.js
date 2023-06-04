import callApi from "../api";

export const initialChatState = {
    messages: [],
    chatRooms: [],
    chatRoomSelected: null,
};

export const ChatReducer = (state, action) => {
    switch (action.type) {
        case "ADD_MEMBERS":
            const chatRoomsAfterAddMembers = [...state.chatRooms];
            const indexOfChatRoomSelectedAddMembers = chatRoomsAfterAddMembers.findIndex(
                (item) => item._id === state.chatRoomSelected._id
            );
            chatRoomsAfterAddMembers[indexOfChatRoomSelectedAddMembers].members = [
                ...state.chatRoomSelected.members,
                action.payload,
            ];

            return {
                ...state,
                chatRooms: chatRoomsAfterAddMembers,
                chatRoomSelected: {
                    ...state.chatRoomSelected,
                    members: [...state.chatRoomSelected.members, action.payload],
                },
            };

        case "ADD_MESSAGE":
            return { ...state, messages: [action.payload, ...state.messages] };

        case "ADD_MESSAGES":
            return { ...state, messages: [...state.messages, ...action.payload] };

        case "ADD_CHATROOM":
            return { ...state, chatRooms: [action.payload, ...state.chatRooms] };

        case "SET_MESSAGES":
            return { ...state, messages: action.payload };

        case "SET_CHATROOMS":
            return { ...state, chatRooms: action.payload };

        case "REMOVE_MEMBERS":
            const membersAfterRemoveMembers = state.chatRoomSelected.members.filter(
                (item) => !action.payload.members.includes(item._id)
            );

            const chatRoomsAfterRemoveMembers = [...state.chatRooms];
            const indexOfChatRoomSelectedRemoveMembers = chatRoomsAfterRemoveMembers.findIndex(
                (item) => item._id === state.chatRoomSelected._id
            );
            chatRoomsAfterRemoveMembers[indexOfChatRoomSelectedRemoveMembers].members =
                membersAfterRemoveMembers;

            return {
                ...state,
                chatRooms: chatRoomsAfterRemoveMembers,
                chatRoomSelected: { ...state.chatRoomSelected, members: membersAfterRemoveMembers },
            };

        case "SET_CHATROOM_SELECTED":
            const chatRoomsAfterSelectChatRoom = [...state.chatRooms];

            const indexOfChatRoomsSelected = chatRoomsAfterSelectChatRoom.findIndex(
                (item) => item._id === action.payload._id
            );
            chatRoomsAfterSelectChatRoom[indexOfChatRoomsSelected].unseen_message = 0;

            return {
                ...state,
                chatRooms: chatRoomsAfterSelectChatRoom,
                chatRoomSelected: { ...action.payload, unseen_message: 0 },
            };

        case "INCREASE_UNSEND_MESSAGE":
            const messagesAfterIncreaseUnsendMessage = [...state.messages];
            const chatRoomsAfterIncreaseUnsendMessage = [...state.chatRooms];

            if (action.payload.chatRoomId === state.chatRoomSelected?._id) {
                messagesAfterIncreaseUnsendMessage.unshift(action.payload.message);

                const indexOfChatRoomsSelected = chatRoomsAfterIncreaseUnsendMessage.findIndex(
                    (item) => item._id === action.payload.chatRoomId
                );
                chatRoomsAfterIncreaseUnsendMessage[indexOfChatRoomsSelected].unseen_message = 0;

                callApi({ method: "GET", url: `/message/chat-room/${action.payload.chatRoomId}` });
            } else {
                const indexOfChatRoomsIncreaseUnsendMessage =
                    chatRoomsAfterIncreaseUnsendMessage.findIndex(
                        (item) => item._id === action.payload.chatRoomId
                    );
                chatRoomsAfterIncreaseUnsendMessage[indexOfChatRoomsIncreaseUnsendMessage]
                    .unseen_message++;
            }

            return {
                ...state,
                messages: messagesAfterIncreaseUnsendMessage,
                chatRooms: chatRoomsAfterIncreaseUnsendMessage,
            };

        default:
            throw new Error(`Action type ${action.type} is undefined`);
    }
};
