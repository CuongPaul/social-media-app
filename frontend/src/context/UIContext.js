const initialUIState = {
    darkMode: false,
    notifications: [],
    alertMessage: null,
    isMobileScreen: false,
};

const UIReducer = (state, action) => {
    switch (action.type) {
        case "SET_DARK_MODE":
            localStorage.setItem("dark_mode", action.payload);

            return { ...state, darkMode: action.payload };

        case "ADD_NOTIFICATION":
            return { ...state, notifications: [action.payload, ...state.notifications] };

        case "SET_MOBILE_SCREEN":
            return { ...state, isMobileScreen: action.payload };

        case "SET_NOTIFICATIONS":
            return { ...state, notifications: action.payload };

        case "SET_ALERT_MESSAGE":
            return { ...state, alertMessage: action.payload };

        case "ADD_NOTIFICATIONS":
            return { ...state, notifications: [...state.notifications, ...action.payload] };

        case "READ_NOTIFICATION":
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
