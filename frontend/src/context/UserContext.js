import uniqueArray from "../utils/unique-array";

const initialUserState = {
    users: [],
    isLoggedIn: false,
    currentUser: null,
    recentAccounts: [],
    sendedFriendRequests: [],
    selectedUserProfile: null,
    receivedFriendRequests: [],
};

const UserReducer = (state, action) => {
    switch (action.type) {
        case "RECENT_ACCOUNTS":
            return { ...state, recentAccounts: action.payload };

        case "REMOVE_RECENT_ACCOUNT":
            const accountArray = state.recentAccounts.filter(
                (account) => account._id !== action.payload
            );

            localStorage.setItem("accounts", JSON.stringify(accountArray));

            return { ...state, recentAccounts: accountArray };

        case "UPDATE_PROFILE":
            return {
                ...state,
                currentUser: { ...state.currentUser, [action.payload.label]: action.payload.value },
            };

        case "SET_CURRENT_USER":
            return { ...state, isLoggedIn: true, currentUser: action.payload };

        case "SET_USERS":
            return { ...state, users: action.payload };

        case "ADD_USER":
            const newItemUser_1 = state.users.findIndex((user) => user.id === action.payload.id);

            if (newItemUser_1 === -1) {
                return { ...state, users: [action.payload, ...state.users] };
            } else {
                return { ...state };
            }

        case "UPDATE_USER":
            const newItemUser_2 = state.users.findIndex((user) => user.id === action.payload.id);

            if (newItemUser_2 !== -1) {
                state.users[newItemUser_2] = action.payload;
            }

            return { ...state, currentUser: action.payload };

        case "REMOVE_USER":
            const newUsers = state.users.filter((user) => user.id !== action.payload);

            return { ...state, users: newUsers };

        case "USER_SIGNOUT":
            const newRecentAccounts = uniqueArray(
                [...state.recentAccounts, state.currentUser],
                "_id"
            );

            localStorage.removeItem("token");
            localStorage.setItem("accounts", JSON.stringify(newRecentAccounts));

            return {
                ...state,
                users: [],
                currentUser: null,
                sendedFriendRequests: [],
                selectedUserProfile: null,
                receivedFriendRequests: [],
                recentAccounts: newRecentAccounts,
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

        case "SET_FRIENDS_REQUEST_SENDED":
            return { ...state, sendedFriendRequests: action.payload };

        case "ADD_FRIENDS_REQUEST_SENDED":
            return {
                ...state,
                sendedFriendRequests: [action.payload, ...state.sendedFriendRequest],
            };

        case "REMOVE_FRIENDS_REQUEST_SENDED":
            const newSendedFriendRequests = state.sendedFriendRequests.filter(
                (item) => item.id !== action.payload
            );

            return {
                ...state,
                sendedFriendRequests: newSendedFriendRequests,
            };

        case "SET_FRIENDS_REQUEST_RECEIVED":
            return { ...state, receivedFriendRequests: action.payload };

        case "ADD_FRIENDS_REQUEST_RECEIVED":
            return {
                ...state,
                receivedFriendRequests: [action.payload, ...state.receivedFriendRequest],
            };

        case "REMOVE_FRIENDS_REQUEST_RECEIVED":
            const newReceivedFriendRequests = state.receivedFriendRequests.filter(
                (item) => item.id !== action.payload
            );

            return {
                ...state,
                receivedFriendRequests: newReceivedFriendRequests,
            };

        case "ADD_FRIEND":
            return {
                ...state,
                currentUser: {
                    ...state.currentUser,
                    friends: [action.payload, ...state.currentUser.friend],
                },
            };

        case "REMOVE_FRIEND":
            return {
                ...state,
                currentUser: {
                    ...state.currentUser,
                    friends: [...action.payload],
                },
            };

        case "ADD_SELECTED_USER_PROFILE":
            return { ...state, selectedUserProfile: action.payload };

        case "REMOVE_SELECTED_USER_PROFILE":
            return { ...state, selectedUserProfile: null };

        default:
            throw new Error(`Action type ${action.type} is undefined`);
    }
};

export { initialUserState, UserReducer };
