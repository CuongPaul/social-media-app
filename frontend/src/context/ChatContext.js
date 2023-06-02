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
            return { ...state, messages: [action.payload, ...state.messages] };

        case "SET_CHATROOM_SELECTED":
            return { ...state, chatRoomSelected: action.payload };

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

        default:
            throw new Error(`Action type ${action.type} is undefined`);
    }
};
