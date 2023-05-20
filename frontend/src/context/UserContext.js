import uniqueArray from "../utils/unique-array";

const initialUserState = {
    currentUser: null,
    selectedUserProfile: null,
    recentAccounts: [],
};

const UserReducer = (state, action) => {
    switch (action.type) {
        case "ADD_SELECTED_USER_PROFILE":
            return {
                ...state,
                selectedUserProfile: action.payload,
            };

        case "SET_RECENT_ACCOUNTS":
            return { ...state, recentAccounts: action.payload };

        case "SIGN_OUT":
            const newRecentAccounts = uniqueArray([...state.recentAccounts, state.currentUser]);

            localStorage.removeItem("token");
            localStorage.setItem("accounts", JSON.stringify(newRecentAccounts));

            return {
                ...state,
                currentUser: null,
                recentAccounts: newRecentAccounts,
            };

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
            return { ...state, currentUser: action.payload };

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

        case "REMOVE_FRIEND":
            return {
                ...state,
                currentUser: {
                    ...state.currentUser,
                    friends: [...action.payload],
                },
            };

        default:
            throw new Error(`Action type ${action.type} is undefined`);
    }
};

export { initialUserState, UserReducer };
