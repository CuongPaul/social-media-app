import callApi from "../api";

export const initialChatState = {
  messages: [],
  chatRooms: [],
  messageSelected: null,
  chatRoomSelected: null,
  videoCall: { me: null, partner: null, isCaller: undefined },
};

export const ChatReducer = (state, action) => {
  switch (action.type) {
    case "ADD_MEMBERS":
      const chatRoomsAfterAddMembers = [...state.chatRooms];
      const indexOfChatRoomSelectedAddMembers =
        chatRoomsAfterAddMembers.findIndex(
          (item) => item._id === state.chatRoomSelected._id
        );
      chatRoomsAfterAddMembers[indexOfChatRoomSelectedAddMembers].members = [
        ...state.chatRoomSelected.members,
        ...action.payload,
      ];

      return {
        ...state,
        chatRooms: chatRoomsAfterAddMembers,
        chatRoomSelected: {
          ...state.chatRoomSelected,
          members: [...state.chatRoomSelected.members, ...action.payload],
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

    case "ADD_CHATROOMS":
      return { ...state, chatRooms: [...state.chatRooms, ...action.payload] };

    case "REACT_MESSAGE":
      const messagesAfterReact = [...state.messages];
      const indexOfMessageReacted = messagesAfterReact.findIndex(
        (item) => item._id === action.payload.message_id
      );

      const indexOfUserReact = messagesAfterReact[indexOfMessageReacted].react[
        action.payload.key
      ].findIndex((item) => item._id === action.payload.user._id);

      if (indexOfUserReact === -1) {
        messagesAfterReact[indexOfMessageReacted].react[
          action.payload.key
        ].push({
          _id: action.payload.user._id,
          name: action.payload.user.name,
          avatar_image: action.payload.user.avatar_image,
        });
      } else {
        messagesAfterReact[indexOfMessageReacted].react[
          action.payload.key
        ].splice(indexOfUserReact, 1);
      }

      return { ...state, messages: messagesAfterReact };

    case "SET_CHATROOMS":
      return { ...state, chatRooms: action.payload };

    case "SET_IS_CALLER":
      return {
        ...state,
        videoCall: { ...state.videoCall, isCaller: action.payload },
      };

    case "SET_NEW_ADMIN":
      const chatRoomsAfterSetNewAdmin = [...state.chatRooms];

      const indexOfChatRoomSetNewAdmin = chatRoomsAfterSetNewAdmin.findIndex(
        (item) => item._id === action.payload.chatRoomId
      );
      chatRoomsAfterSetNewAdmin[indexOfChatRoomSetNewAdmin].admin =
        action.payload.newAdmin;

      const chatRoomSelectedAfterSetNewAdmin = { ...state.chatRoomSelected };
      chatRoomSelectedAfterSetNewAdmin.admin = action.payload.newAdmin;

      return {
        ...state,
        chatRooms: chatRoomsAfterSetNewAdmin,
        chatRoomSelected: chatRoomSelectedAfterSetNewAdmin,
      };

    case "REMOVE_MEMBERS":
      const membersAfterRemoveMembers = state.chatRoomSelected.members.filter(
        (item) => !action.payload.members.includes(item._id)
      );

      const chatRoomsAfterRemoveMembers = [...state.chatRooms];
      const indexOfChatRoomSelectedRemoveMembers =
        chatRoomsAfterRemoveMembers.findIndex(
          (item) => item._id === state.chatRoomSelected._id
        );
      chatRoomsAfterRemoveMembers[
        indexOfChatRoomSelectedRemoveMembers
      ].members = membersAfterRemoveMembers;

      return {
        ...state,
        chatRooms: chatRoomsAfterRemoveMembers,
        chatRoomSelected: {
          ...state.chatRoomSelected,
          members: membersAfterRemoveMembers,
        },
      };

    case "SET_TYPE_BLOCK":
      if (action.payload) {
        return {
          ...state,
          chatRoomSelected: {
            ...state.chatRoomSelected,
            type_block: action.payload,
          },
        };
      } else {
        const { type_block, ...rest } = { ...state.chatRoomSelected };
        return { ...state, chatRoomSelected: rest };
      }

    case "REMOVE_CHATROOM":
      const chatRoomsAfterRemoveChatRoom = [...state.chatRooms].filter(
        (item) => item._id !== action.payload
      );

      return {
        ...state,
        chatRoomSelected: null,
        chatRooms: chatRoomsAfterRemoveChatRoom,
      };

    case "UPDATE_CHATROOM":
      const chatRoomsAfterUpdateChatRoom = [...state.chatRooms];

      const indexOfChatRoomUpdaed = chatRoomsAfterUpdateChatRoom.findIndex(
        (item) => item._id === action.payload._id
      );
      chatRoomsAfterUpdateChatRoom[indexOfChatRoomUpdaed] = action.payload;

      return {
        ...state,
        chatRooms: chatRoomsAfterUpdateChatRoom,
        chatRoomSelected:
          action.payload._id === state.chatRoomSelected?._id
            ? action.payload
            : state.chatRoomSelected,
      };

    case "SET_MY_VIDEO_CALL":
      return {
        ...state,
        videoCall: { ...state.videoCall, me: action.payload },
      };

    case "SET_MESSAGE_SELECTED":
      return { ...state, messageSelected: action.payload };

    case "SET_CHATROOM_SELECTED":
      if (action.payload) {
        const chatRoomsAfterSelectChatRoom = [...state.chatRooms];

        const indexOfChatRoomSelected = chatRoomsAfterSelectChatRoom.findIndex(
          (item) => item._id === action.payload._id
        );
        chatRoomsAfterSelectChatRoom[
          indexOfChatRoomSelected
        ].unseen_message = 0;

        return {
          ...state,
          chatRooms: chatRoomsAfterSelectChatRoom,
          chatRoomSelected: { ...action.payload, unseen_message: 0 },
        };
      }

      return { ...state, chatRoomSelected: action.payload };

    case "SET_PARTNER_VIDEO_CALL":
      return {
        ...state,
        videoCall: { ...state.videoCall, partner: action.payload },
      };

    case "SET_INITIAL_VIDEO_CALL":
      return {
        ...state,
        videoCall: { me: null, partner: null, isCaller: undefined },
      };

    case "INCREASE_UNSEND_MESSAGE":
      const messagesAfterIncreaseUnsendMessage = [...state.messages];
      const chatRoomsAfterIncreaseUnsendMessage = [...state.chatRooms];

      if (action.payload.chatRoomId === state.chatRoomSelected?._id) {
        messagesAfterIncreaseUnsendMessage.unshift(action.payload.message);

        const indexOfChatRoomsSelected =
          chatRoomsAfterIncreaseUnsendMessage.findIndex(
            (item) => item._id === action.payload.chatRoomId
          );
        chatRoomsAfterIncreaseUnsendMessage[
          indexOfChatRoomsSelected
        ].unseen_message = 0;

        callApi({
          method: "GET",
          url: `/message/chat-room/${action.payload.chatRoomId}`,
        });
      } else {
        const indexOfChatRoomsIncreaseUnsendMessage =
          chatRoomsAfterIncreaseUnsendMessage.findIndex(
            (item) => item._id === action.payload.chatRoomId
          );
        chatRoomsAfterIncreaseUnsendMessage[
          indexOfChatRoomsIncreaseUnsendMessage
        ].unseen_message++;
      }

      chatRoomsAfterIncreaseUnsendMessage.sort(
        (a, b) => b.unseen_message - a.unseen_message
      );

      return {
        ...state,
        messages: messagesAfterIncreaseUnsendMessage,
        chatRooms: chatRoomsAfterIncreaseUnsendMessage,
      };

    case "UPDATE_MESSAGE_SELECTED":
      const messagesAfterUpdateMessageSelected = [...state.messages];

      const indexOfMessageSelected =
        messagesAfterUpdateMessageSelected.findIndex(
          (item) => item._id === action.payload._id
        );
      messagesAfterUpdateMessageSelected[indexOfMessageSelected] =
        action.payload;

      return {
        ...state,
        messageSelected: null,
        messages: messagesAfterUpdateMessageSelected,
      };

    default:
      throw new Error(`Action type ${action.type} is undefined`);
  }
};
