const initialUserState = {
    currentUser: null,
    friendsOnline: [],
    recentAccounts: [],
    sendedFriendRequest: [],
    incommingFriendRequest: [],
};

const UserReducer = (state, action) => {
    switch (action.type) {
        case "SET_RECENT_ACCOUNTS":
            return { ...state, recentAccounts: action.payload };

        case "REMOVE_RECENT_ACCOUNT":
            const recentAccountsAfterRemove = state.recentAccounts.filter(
                (account) => account._id !== action.payload
            );

            localStorage.setItem("recent_accounts", JSON.stringify(recentAccountsAfterRemove));

            return { ...state, recentAccounts: recentAccountsAfterRemove };

        case "SIGN_OUT":
            localStorage.removeItem("token");

            return {
                ...state,
                currentUser: null,
            };

        case "SET_FRIENDS_ONLINE":
            return { ...state, friendsOnline: action.payload };

        case "SET_SENDED_FRIEND_REQUEST":
            return { ...state, sendedFriendRequest: action.payload };

        case "SET_INCOMMING_FRIEND_REQUEST":
            return { ...state, incommingFriendRequest: action.payload };

        case "ADD_FRIENDS_ONLINE":
            return { ...state, friendsOnline: [...state.friendsOnline, action.payload] };

        case "REMOVE_FRIENDS_ONLINE":
            const friendsOnlineAfterRemove = state.friendsOnline.filter(
                (friend) => friend._id !== action.payload
            );

            return { ...state, friendsOnline: friendsOnlineAfterRemove };

        case "UNFRIEND":
            const friendsAfterRemove = [...state.currentUser.friends].filter(
                (friend) => friend._id !== action.payload
            );

            return {
                ...state,
                currentUser: {
                    ...state.currentUser,
                    friends: friendsAfterRemove,
                },
            };

        case "CANCEL_FRIEND_REQUEST":
            const sendedFriendRequestAfterRemove = [...state.sendedFriendRequest].filter(
                (friendRequest) => friendRequest._id !== action.payload
            );

            return {
                ...state,
                sendedFriendRequest: sendedFriendRequestAfterRemove,
            };

        case "SEND_FRIEND_REQUEST":
            return {
                ...state,
                sendedFriendRequest: [...state.sendedFriendRequest, action.payload],
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
            const blockUsersAfterRemove = [...state.currentUser.block_users].filter(
                (item) => item !== action.payload
            );

            return {
                ...state,
                currentUser: {
                    ...state.currentUser,
                    block_users: blockUsersAfterRemove,
                },
            };

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

        case "ADD_FRIEND":
            return {
                ...state,
                currentUser: {
                    ...state.currentUser,
                    friends: [action.payload, ...state.currentUser.friend],
                },
            };

        default:
            throw new Error(`Action type ${action.type} is undefined`);
    }
};

export { initialUserState, UserReducer };
