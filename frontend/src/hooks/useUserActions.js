import { useState, useContext } from "react";

import callApi from "../api";
import { UIContext, UserContext } from "../App";

const useUserActions = () => {
    const { socketIO, uiDispatch } = useContext(UIContext);
    const { userState, userDispatch } = useContext(UserContext);

    const [isLoading, setIsLoading] = useState(false);

    const handleSignout = async () => {
        try {
            await callApi({
                method: "POST",
                url: "/auth/signout",
                data: { socket_id: socketIO.current.id, friends_online: userState.friendsOnline },
            });

            userDispatch({ type: "SIGN_OUT" });
        } catch (err) {
            uiDispatch({
                type: "SET_ALERT_MESSAGE",
                payload: { display: true, color: "error", text: err.message },
            });
        }
    };

    const handleUnfriend = async (friendId) => {
        setIsLoading(true);

        try {
            const { message } = await callApi({ method: "PUT", url: `/user/unfriend/${friendId}` });
            setIsLoading(false);

            userDispatch({ type: "UNFRIEND", payload: friendId });

            uiDispatch({
                type: "SET_ALERT_MESSAGE",
                payload: { display: true, text: message, color: "success" },
            });
        } catch (err) {
            setIsLoading(false);
            uiDispatch({
                type: "SET_ALERT_MESSAGE",
                payload: { display: true, color: "error", text: err.message },
            });
        }
    };

    const handleBlockUser = async (userId) => {
        setIsLoading(true);

        try {
            const { message } = await callApi({ method: "PUT", url: `/user/block/${userId}` });
            setIsLoading(false);

            userDispatch({ type: "BLOCK_USER", payload: userId });

            uiDispatch({
                type: "SET_ALERT_MESSAGE",
                payload: { display: true, text: message, color: "success" },
            });
        } catch (err) {
            setIsLoading(false);
            uiDispatch({
                type: "SET_ALERT_MESSAGE",
                payload: { display: true, color: "error", text: err.message },
            });
        }
    };

    const handleUnblockUser = async (userId) => {
        setIsLoading(true);

        try {
            const { message } = await callApi({ method: "PUT", url: `/user/unblock/${userId}` });
            setIsLoading(false);

            userDispatch({ type: "UNBLOCK_USER", payload: userId });

            uiDispatch({
                type: "SET_ALERT_MESSAGE",
                payload: { display: true, text: message, color: "success" },
            });
        } catch (err) {
            setIsLoading(false);
            uiDispatch({
                type: "SET_ALERT_MESSAGE",
                payload: { display: true, color: "error", text: err.message },
            });
        }
    };

    const handleUpdateCoverImage = async (image) => {
        setIsLoading(true);

        try {
            const formData = new FormData();
            formData.append("files", image);
            formData.append("folder", "avatar-image");

            const { data } = await callApi({
                data: formData,
                method: "POST",
                url: "/upload/files",
            });
            const cover_image = data.images[0];

            await callApi({
                method: "PUT",
                data: { cover_image },
                url: "/user/cover-image",
            });
            userDispatch({ payload: cover_image, type: "UPDATE-COVER-IMAGE" });

            setIsLoading(false);
        } catch (err) {
            setIsLoading(false);
            uiDispatch({
                type: "SET_ALERT_MESSAGE",
                payload: { display: true, color: "error", text: err.message },
            });
        }
    };

    const handleUpdateAvatarImage = async (image) => {
        setIsLoading(true);

        try {
            const formData = new FormData();
            formData.append("files", image);
            formData.append("folder", "avatar-image");

            const { data } = await callApi({
                data: formData,
                method: "POST",
                url: "/upload/files",
            });
            const avatar_image = data.images[0];

            await callApi({
                method: "PUT",
                data: { avatar_image },
                url: "/user/avatar-image",
            });
            userDispatch({ payload: avatar_image, type: "UPDATE-AVATAR-IMAGE" });

            setIsLoading(false);
        } catch (err) {
            setIsLoading(false);
            uiDispatch({
                type: "SET_ALERT_MESSAGE",
                payload: { display: true, color: "error", text: err.message },
            });
        }
    };

    return {
        isLoading,
        handleSignout,
        handleUnfriend,
        handleBlockUser,
        handleUnblockUser,
        handleUpdateCoverImage,
        handleUpdateAvatarImage,
    };
};

export default useUserActions;
