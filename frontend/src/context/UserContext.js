const initialUserState = {
    currentUser: null,
    friendsOnline: [],
    recentAccounts: [],
    sendedFriendRequests: [],
    incommingFriendRequests: [],
};

const UserReducer = (state, action) => {
    switch (action.type) {
        case "SIGN_OUT":
            localStorage.removeItem("token");

            return { ...initialUserState, recentAccounts: state.recentAccounts };

        case "UNFRIEND":
            const friendsAfterUnfriend = [...state.currentUser.friends].filter(
                (friend) => friend._id !== action.payload
            );

            return {
                ...state,
                currentUser: {
                    ...state.currentUser,
                    friends: friendsAfterUnfriend,
                },
            };

        case "ADD_FRIEND":
            return {
                ...state,
                currentUser: {
                    ...state.currentUser,
                    friends: [...state.currentUser.friends, action.payload],
                },
            };

        case "BLOCK_USER":
            return {
                ...state,
                currentUser: {
                    ...state.currentUser,
                    block_users: [...state.currentUser.block_users, action.payload],
                },
            };

        case "UNBLOCK_USER":
            const blockUsersAfterUnblock = [...state.currentUser.block_users].filter(
                (item) => item !== action.payload
            );

            return {
                ...state,
                currentUser: {
                    ...state.currentUser,
                    block_users: blockUsersAfterUnblock,
                },
            };

        case "UPDATE_PROFILE":
            return { ...state, currentUser: { ...state.currentUser, ...action.payload } };

        case "SET_CURRENT_USER":
            const recentAccountStored = JSON.parse(localStorage.getItem("recent_accounts")) || [];
            const indexOfCurrentAccount = recentAccountStored.findIndex(
                (item) => item._id === action.payload._id
            );

            if (indexOfCurrentAccount === -1) {
                recentAccountStored.push({
                    _id: action.payload._id,
                    name: action.payload.name,
                    email: action.payload.email,
                    avatar_image: action.payload.avatar_image,
                });

                localStorage.setItem("recent_accounts", JSON.stringify(recentAccountStored));
            }
            if (
                action.payload.avatar_image !==
                recentAccountStored[indexOfCurrentAccount].avatar_image
            ) {
                recentAccountStored[indexOfCurrentAccount].avatar_image =
                    action.payload.avatar_image;

                localStorage.setItem("recent_accounts", JSON.stringify(recentAccountStored));
            }

            return {
                ...state,
                currentUser: action.payload,
                recentAccounts: recentAccountStored,
            };

        case "ADD_FRIEND_ONLINE":
            const friendsOnlineAfterAddFriendsOnline = [...state.friendsOnline];

            const indexOfFriendOnlineAdded = friendsOnlineAfterAddFriendsOnline.findIndex(
                (item) => item._id === action.payload._id
            );
            if (indexOfFriendOnlineAdded === -1) {
                friendsOnlineAfterAddFriendsOnline.push(action.payload);
            } else {
                friendsOnlineAfterAddFriendsOnline[indexOfFriendOnlineAdded] = action.payload;
            }

            return { ...state, friendsOnline: friendsOnlineAfterAddFriendsOnline };

        case "UPDATE_COVER_IMAGE":
            return { ...state, currentUser: { ...state.currentUser, cover_image: action.payload } };

        case "SET_FRIENDS_ONLINE":
            return { ...state, friendsOnline: action.payload };

        case "UPDATE_AVATAR_IMAGE":
            return {
                ...state,
                currentUser: { ...state.currentUser, avatar_image: action.payload },
            };

        case "SEND_FRIEND_REQUEST":
            return {
                ...state,
                sendedFriendRequests: [...state.sendedFriendRequests, action.payload],
            };

        case "SET_RECENT_ACCOUNTS":
            return { ...state, recentAccounts: action.payload };

        case "REMOVE_FRIEND_ONLINE":
            const friendsOnlineAfterRemove = state.friendsOnline.filter(
                (friend) => friend._id !== action.payload
            );

            return { ...state, friendsOnline: friendsOnlineAfterRemove };

        case "ACCEPT_FRIEND_REQUEST":
            const incommingFriendRequestsAfterAccept = [...state.incommingFriendRequests].filter(
                (friendRequest) => friendRequest._id !== action.payload
            );

            return {
                ...state,
                incommingFriendRequests: incommingFriendRequestsAfterAccept,
            };

        case "CANCEL_FRIEND_REQUEST":
            const sendedFriendRequestsAfterCancel = [...state.sendedFriendRequests].filter(
                (friendRequest) => friendRequest?._id !== action.payload
            );

            return {
                ...state,
                sendedFriendRequests: sendedFriendRequestsAfterCancel,
            };

        case "REMOVE_RECENT_ACCOUNT":
            const recentAccountsAfterRemove = state.recentAccounts.filter(
                (account) => account._id !== action.payload
            );

            localStorage.setItem("recent_accounts", JSON.stringify(recentAccountsAfterRemove));

            return { ...state, recentAccounts: recentAccountsAfterRemove };

        case "DECLINE_FRIEND_REQUEST":
            const incommingFriendRequestsAfterDecline = [...state.incommingFriendRequests].filter(
                (friendRequest) => friendRequest._id !== action.payload
            );

            return {
                ...state,
                incommingFriendRequests: incommingFriendRequestsAfterDecline,
            };

        case "SET_SENDED_FRIEND_REQUEST":
            return { ...state, sendedFriendRequests: action.payload };

        case "ADD_INCOMMING_FRIEND_REQUEST":
            return {
                ...state,
                incommingFriendRequests: [...state.incommingFriendRequests, action.payload],
            };

        case "ADD_SOCKET_FOR_FRIEND_ONLINE":
            const friendsOnlineAfterAddSocket = [...state.friendsOnline];
            const indexOfFriendOnlineAddedSocket = friendsOnlineAfterAddSocket.findIndex(
                (item) => item._id === action.payload._id
            );
            friendsOnlineAfterAddSocket[indexOfFriendOnlineAddedSocket].sockets.push(
                action.payload.socket
            );

            return { ...state, friendsOnline: friendsOnlineAfterAddSocket };

        case "SET_INCOMMING_FRIEND_REQUEST":
            return { ...state, incommingFriendRequests: action.payload };

        default:
            throw new Error(`Action type ${action.type} is undefined`);
    }
};

export { UserReducer, initialUserState };
