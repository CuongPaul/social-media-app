import { filterArray } from "../utils/filter-array";

const initialUserState = {
    users: [],
    currentUser: null,
    recentAccounts: [],
    sendedFriendRequests: [],
    selectedUserProfile: null,
    receivedFriendRequests: [],
};

const UserReducer = (state, action) => {
    switch (action.type) {
        case "RECENT_ACCOUNTS":
            const recentAccounts = filterArray(action.payload);

            return { ...state, recentAccounts: recentAccounts };

        case "ADD_RECENT_ACCOUNT":
            const account = state.recentAccounts.find(
                (account) => account.id === action.payload.id
            );

            if (!account) {
                const accounts = localStorage.accounts ? JSON.parse(localStorage.accounts) : [];

                accounts.push(action.payload);
                localStorage.setItem("accounts", JSON.stringify(accounts));

                return { ...state, recentAccounts: [action.payload, ...state.recentAccounts] };
            } else {
                return { ...state };
            }

        case "REMOVE_RECENT_ACCOUNT":
            const accountArray = state.recentAccounts.filter(
                (account) => account.id !== action.payload
            );

            localStorage.setItem("accounts", JSON.stringify(accountArray));

            return { ...state, recentAccounts: accountArray };

        case "UPDATE_PROFILE":
            return {
                ...state,
                currentUser: { ...state.currentUser, [action.payload.label]: action.payload.value },
            };

        case "SET_CURRENT_USER":
            return { ...state, currentUser: action.payload };

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

        case "LOGOUT_USER":
            localStorage.getItem("token") && localStorage.removeItem("token");

            return {
                ...state,
                users: [],
                currentUser: null,
                sendedFriendRequests: [],
                selectedUserProfile: null,
                receivedFriendRequests: [],
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
