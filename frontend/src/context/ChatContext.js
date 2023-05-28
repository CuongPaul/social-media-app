export const initialChatState = {
    messages: [],
    chatRooms: [],
};

export const ChatReducer = (state, action) => {
    switch (action.type) {
        case "SET_CHATROOMS":
            return { ...state, chatRooms: action.payload };

        case "SET_MESSAGES":
            return {
                ...state,
                messages: action.payload,
            };

        case "ADD_MESSAGE":
            return {
                ...state,
                messages: [...state.messages, action.payload],
            };

        default:
            throw new Error(`Action type ${action.type} is undefined`);
    }
};
