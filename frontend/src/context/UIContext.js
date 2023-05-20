const initialUIState = {
    post: null,
    drawer: false,
    message: null,
    loading: false,
    darkMode: false,
    postModel: false,
    notifications: [],
    navDrawerMenu: false,
};

const UIReducer = (state, action) => {
    switch (action.type) {
        case "EDIT_POST":
            return { ...state, post: action.payload };

        case "SET_DRAWER":
            return { ...state, drawer: action.payload };

        case "SET_ALERT_NOTIFICATION":
            return { ...state, message: action.payload };

        case "SET_NAV_MENU":
            return { ...state, navDrawerMenu: action.payload };

        case "SET_POST_MODEL":
            return { ...state, postModel: action.payload };

        case "SET_NOTIFICATIONS":
            return { ...state, notifications: action.payload };

        case "ADD_NOTIFICATION":
            return { ...state, notifications: [action.payload, ...state.notifications] };

        case "SET_LOADING":
            return { ...state, loading: action.payload };

        case "SET_DARK_MODE":
            return { ...state, darkMode: action.payload };

        case "READ_ALL_NOTIFICATIONS":
            const newNotifications = [...state.notifications];
            newNotifications.forEach((item) => (item.is_read = true));
            return { ...state, notifications: newNotifications };

        case "READ_NOTIFICATIONS":
            const notifications = [...state.notifications];
            notifications.forEach((item) => {
                if (item._id === action.payload) {
                    item.is_read = true;
                }
            });
            return { ...state, notifications };

        default:
            throw new Error(`Action type ${action.type} is undefined`);
    }
};

export { UIReducer, initialUIState };
