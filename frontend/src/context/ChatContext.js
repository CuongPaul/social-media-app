export const initialChatState = {
    messages: [],
    chatRooms: [],
    chatRoomSelected: null,
};

export const ChatReducer = (state, action) => {
    switch (action.type) {
        case "SET_CHATROOMS":
            return { ...state, chatRooms: action.payload };

        case "SET_MESSAGES":
            return { ...state, messages: action.payload };

        case "ADD_MESSAGE":
            return { ...state, messages: [...state.messages, action.payload] };

        case "SET_CHATROOM_SELECTED":
            return { ...state, chatRoomSelected: action.payload };

        default:
            throw new Error(`Action type ${action.type} is undefined`);
    }
};
