import io from "socket.io-client";

export const handleListenEvent = ({ uiDispatch, userDispatch, postDispatch, chatDispatch }) => {
    const socketIO = io(`${process.env.REACT_APP_BASE_API_URL}`);

    userDispatch({ type: "SET_SOCKETIO", payload: socketIO });

    socketIO.on("connect", () => console.log("Ta Cuong"));

    socketIO.on("user-offline", ({ user_id }) => {
        userDispatch({ type: "FRIEND_OFFLINE", payload: user_id });
    });

    socketIO.on("user-online", ({ user_id }) => {
        userDispatch({ type: "FRIEND_ONLINE", payload: user_id });
    });

    socketIO.on("friend-request-status", ({ sender }) => {
        userDispatch({
            type: "ADD_FRIENDS_REQUEST_RECEIVED",
            payload: sender,
        });
    });

    socketIO.on("sended-friend-request-cancel", ({ requestId }) => {
        userDispatch({
            type: "REMOVE_FRIENDS_REQUEST_RECEIVED",
            payload: requestId,
        });
    });

    socketIO.on("friend-request-accept-status", ({ user, request_id }) => {
        userDispatch({
            type: "ADD_FRIEND",
            payload: user,
        });
        userDispatch({
            type: "REMOVE_FRIENDS_REQUEST_RECEIVED",
            payload: request_id,
        });
        userDispatch({
            type: "REMOVE_FRIENDS_REQUEST_SENDED",
            payload: request_id,
        });
    });

    socketIO.on("received-friend-request-decline", ({ requestId }) => {
        userDispatch({
            type: "REMOVE_FRIENDS_REQUEST_SENDED",
            payload: requestId,
        });
    });

    socketIO.on("new-post", ({ data }) => {
        postDispatch({ type: "ADD_POST", payload: data });
    });

    socketIO.on("react-post", ({ data }) => {
        postDispatch({
            type: "LIKE_UNLIKE_POST",
            payload: data,
        });
    });

    socketIO.on("post-comment", ({ data }) => {
        postDispatch({ type: "ADD_POST_COMMENT", payload: data });
    });

    socketIO.on("react-comment", ({ data }) => {
        postDispatch({
            type: "LIKE_UNLIKE_COMMENT",
            payload: data,
        });
    });

    socketIO.on("new-message", ({ data }) => {
        chatDispatch({ type: "ADD_MESSAGE", payload: data });
    });

    socketIO.on("notification", ({ data }) => {
        uiDispatch({ type: "ADD_NOTIFICATION", payload: data });
    });

    return () => {
        socketIO.disconnect();
        userDispatch({ type: "SET_SOCKETIO", payload: null });
    };
};
