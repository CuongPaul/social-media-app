import uniqueArray from "../utils/unique-array";

const initialUserState = {
    currentUser: null,
    recentAccounts: [],
    selectedUserProfile: null,
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
            const recentAccountsAfterSignout = uniqueArray([
                ...state.recentAccounts,
                state.currentUser,
            ]).map((account) => ({
                _id: account._id,
                name: account.name,
                email: account.email,
                avatar_image: account.avatar_image,
            }));

            localStorage.removeItem("token");
            localStorage.setItem("recent_accounts", JSON.stringify(recentAccountsAfterSignout));

            return {
                ...state,
                currentUser: null,
                recentAccounts: recentAccountsAfterSignout,
            };

        case "ADD_SELECTED_USER_PROFILE":
            return {
                ...state,
                selectedUserProfile: action.payload,
            };

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
