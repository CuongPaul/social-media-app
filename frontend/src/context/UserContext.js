const initialUserState = {
    currentUser: null,
    sendedFriendRequests: [],
    incommingFriendRequests: [],
    //
    friendsOnline: [],
    recentAccounts: [],
};

const UserReducer = (state, action) => {
    switch (action.type) {
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

        case "SEND_FRIEND_REQUEST":
            return {
                ...state,
                sendedFriendRequests: [...state.sendedFriendRequests, action.payload],
            };

        case "CANCEL_FRIEND_REQUEST":
            const sendedFriendRequestsAfterCancel = [...state.sendedFriendRequests].filter(
                (friendRequest) => friendRequest._id !== action.payload
            );

            return {
                ...state,
                sendedFriendRequests: sendedFriendRequestsAfterCancel,
            };

        case "DECLINE_FRIEND_REQUEST":
            const incommingFriendRequestsAfterDecline = [...state.incommingFriendRequests].filter(
                (friendRequest) => friendRequest._id !== action.payload
            );

            return {
                ...state,
                incommingFriendRequests: incommingFriendRequestsAfterDecline,
            };

        case "ACCEPT_FRIEND_REQUEST":
            const incommingFriendRequestsAfterAccept = [...state.incommingFriendRequests].filter(
                (friendRequest) => friendRequest._id !== action.payload
            );

            return {
                ...state,
                incommingFriendRequests: incommingFriendRequestsAfterAccept,
            };

        case "ADD_FRIEND":
            return {
                ...state,
                currentUser: {
                    ...state.currentUser,
                    friends: [...state.currentUser.friends, action.payload],
                },
            };

        case "SIGN_OUT":
            localStorage.removeItem("token");

            return initialUserState;
        //
        case "SET_RECENT_ACCOUNTS":
            return { ...state, recentAccounts: action.payload };

        case "REMOVE_RECENT_ACCOUNT":
            const recentAccountsAfterRemove = state.recentAccounts.filter(
                (account) => account._id !== action.payload
            );

            localStorage.setItem("recent_accounts", JSON.stringify(recentAccountsAfterRemove));

            return { ...state, recentAccounts: recentAccountsAfterRemove };

        case "SET_FRIENDS_ONLINE":
            return { ...state, friendsOnline: action.payload };

        case "SET_SENDED_FRIEND_REQUEST":
            return { ...state, sendedFriendRequests: action.payload };

        case "SET_INCOMMING_FRIEND_REQUEST":
            return { ...state, incommingFriendRequests: action.payload };

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

        case "REMOVE_FRIEND_ONLINE":
            const friendsOnlineAfterRemove = state.friendsOnline.filter(
                (friend) => friend._id !== action.payload
            );

            return { ...state, friendsOnline: friendsOnlineAfterRemove };

        case "ADD_SOCKET_FOR_FRIEND_ONLINE":
            const friendsOnlineAfterAddSocket = [...state.friendsOnline];
            const indexOfFriendOnlineAddedSocket = friendsOnlineAfterAddSocket.findIndex(
                (item) => item._id === action.payload._id
            );
            friendsOnlineAfterAddSocket[indexOfFriendOnlineAddedSocket].sockets.push(
                action.payload.socket
            );

            return { ...state, friendsOnline: friendsOnlineAfterAddSocket };

        case "UPDATE_PROFILE":
            return {
                ...state,
                currentUser: { ...state.currentUser, [action.payload.label]: action.payload.value },
            };

        case "SET_CURRENT_USER":
            const recentAccountStored = JSON.parse(localStorage.getItem("recent_accounts")) || [];
            const isStored = recentAccountStored.find((item) => item._id === action.payload._id);

            if (!isStored) {
                recentAccountStored.push({
                    _id: action.payload._id,
                    name: action.payload.name,
                    email: action.payload.email,
                    avatar_image: action.payload.avatar_image,
                });

                localStorage.setItem("recent_accounts", JSON.stringify(recentAccountStored));
            }

            return {
                ...state,
                currentUser: action.payload,
                recentAccounts: recentAccountStored,
            };

        case "FRIEND_OFFLINE":
            const friends_1 = [...state.currentUser.friends];

            const indexOfFriendOffline_1 = friends_1.indexOf(action.payload);

            if (indexOfFriendOffline_1 !== -1) {
                friends_1[indexOfFriendOffline_1].active = false;
            }

            return { ...state, currentUser: { ...state.currentUser, friends: [...friends_1] } };

        case "FRIEND_ONLINE":
            const friends_2 = [...state.currentUser.friends];

            const indexOfFriendOffline_2 = friends_2.indexOf(action.payload);

            if (indexOfFriendOffline_2 !== -1) {
                friends_2[indexOfFriendOffline_2].active = true;
            }

            return { ...state, currentUser: { ...state.currentUser, friends: [...friends_2] } };

        default:
            throw new Error(`Action type ${action.type} is undefined`);
    }
};

export { initialUserState, UserReducer };
