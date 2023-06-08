const initialUIState = {
    posts: [],
    darkMode: false,
    notifications: [],
    alert_message: null,
};

const UIReducer = (state, action) => {
    switch (action.type) {
        case "ADD_POSTS":
            return { ...state, posts: [...state.posts, ...action.payload] };

        case "SET_POSTS":
            return { ...state, posts: action.payload };

        case "UPDATE_POST":
            const postsAfterUpdate = [...state.posts];

            const postUpdatedIndex = postsAfterUpdate.findIndex(
                (post) => post._id === action.payload._id
            );
            postsAfterUpdate[postUpdatedIndex] = action.payload;

            return { ...state, posts: postsAfterUpdate };

        case "CREATE_POST":
            const postsAfterCreate = [...state.posts];
            postsAfterCreate.unshift(action.payload);

            return { ...state, posts: postsAfterCreate };

        case "DELETE_POST":
            const postsAfterDelete = state.posts.filter((post) => post._id !== action.payload);

            return { ...state, posts: postsAfterDelete };

        case "SET_DARK_MODE":
            localStorage.setItem("dark_mode", action.payload);

            return { ...state, darkMode: action.payload };

        case "ADD_NOTIFICATION":
            return { ...state, notifications: [action.payload, ...state.notifications] };

        case "SET_NOTIFICATIONS":
            return { ...state, notifications: action.payload };

        case "SET_ALERT_MESSAGE":
            return { ...state, alert_message: action.payload };

        case "ADD_NOTIFICATIONS":
            return { ...state, notifications: [...state.notifications, ...action.payload] };

        case "READ_NOTIFICATIONS":
            const notificationReadIndex = state.notifications.findIndex(
                (item) => item._id === action.payload
            );

            const notificationsAfterRead = [...state.notifications];
            notificationsAfterRead[notificationReadIndex].is_read = true;

            return { ...state, notifications: notificationsAfterRead };

        case "READ_ALL_NOTIFICATIONS":
            const notificationsAfterReadAll = [...state.notifications];
            notificationsAfterReadAll.forEach((item) => (item.is_read = true));

            return { ...state, notifications: notificationsAfterReadAll };

        default:
            throw new Error(`Action type ${action.type} is undefined`);
    }
};

export { UIReducer, initialUIState };
