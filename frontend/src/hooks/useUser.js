import { useState, useContext } from "react";

import callApi from "../api";
import { UIContext, UserContext } from "../App";

const useUser = () => {
    const { socketIO, uiDispatch } = useContext(UIContext);
    const { userState, userDispatch } = useContext(UserContext);

    const [isLoading, setIsLoading] = useState(false);

    const handleSignout = async () => {
        setIsLoading(true);

        try {
            await callApi({
                method: "POST",
                url: "/auth/signout",
                data: { socket_id: socketIO.current.id, friends_online: userState.friendsOnline },
            });

            userDispatch({ type: "SIGN_OUT" });

            setIsLoading(false);
        } catch (err) {
            setIsLoading(false);

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

            userDispatch({ type: "UNFRIEND", payload: friendId });
            uiDispatch({
                type: "SET_ALERT_MESSAGE",
                payload: { display: true, text: message, color: "success" },
            });

            setIsLoading(false);
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

            userDispatch({ type: "BLOCK_USER", payload: userId });
            uiDispatch({
                type: "SET_ALERT_MESSAGE",
                payload: { display: true, text: message, color: "success" },
            });

            setIsLoading(false);
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

            userDispatch({ type: "UNBLOCK_USER", payload: userId });
            uiDispatch({
                type: "SET_ALERT_MESSAGE",
                payload: { display: true, text: message, color: "success" },
            });

            setIsLoading(false);
        } catch (err) {
            setIsLoading(false);

            uiDispatch({
                type: "SET_ALERT_MESSAGE",
                payload: { display: true, color: "error", text: err.message },
            });
        }
    };

    const handleUpdateProfile = async (data) => {
        setIsLoading(true);

        try {
            const { message } = await callApi({ data, method: "PUT", url: "/user/update-profile" });

            userDispatch({ payload: data, type: "UPDATE_PROFILE" });
            uiDispatch({
                type: "SET_ALERT_MESSAGE",
                payload: { display: true, text: message, color: "success" },
            });

            setIsLoading(false);
        } catch (err) {
            setIsLoading(false);

            uiDispatch({
                type: "SET_ALERT_MESSAGE",
                payload: { display: true, color: "error", text: err.message },
            });
        }
    };

    const handleUpdatePassword = async (data) => {
        setIsLoading(true);

        try {
            const { message } = await callApi({
                data,
                method: "PUT",
                url: "/user/update-password",
            });

            uiDispatch({
                type: "SET_ALERT_MESSAGE",
                payload: { display: true, text: message, color: "success" },
            });
            userDispatch({ type: "SIGN_OUT" });

            setIsLoading(false);
        } catch (err) {
            setIsLoading(false);

            uiDispatch({
                type: "SET_ALERT_MESSAGE",
                payload: { display: true, color: "error", text: err.message },
            });
        }
    };

    const handleUpdateCoverImage = async (imageUpload) => {
        setIsLoading(true);

        try {
            const formData = new FormData();
            formData.append("files", imageUpload);
            formData.append("folder", "cover-image");

            const { data } = await callApi({
                data: formData,
                method: "POST",
                url: "/upload/files",
            });
            const image = data.images[0];

            await callApi({
                method: "PUT",
                url: "/user/cover-image",
                data: { cover_image: image.url },
            });

            userDispatch({ payload: image.url, type: "UPDATE_COVER_IMAGE" });

            setIsLoading(false);
        } catch (err) {
            setIsLoading(false);

            uiDispatch({
                type: "SET_ALERT_MESSAGE",
                payload: { display: true, color: "error", text: err.message },
            });
        }
    };

    const handleUpdateAvatarImage = async (imageUpload) => {
        setIsLoading(true);

        try {
            const formData = new FormData();
            formData.append("files", imageUpload);
            formData.append("folder", "avatar-image");

            const { data } = await callApi({
                data: formData,
                method: "POST",
                url: "/upload/files",
            });
            const image = data.images[0];

            await callApi({
                method: "PUT",
                url: "/user/avatar-image",
                data: { avatar_image: image.url },
            });

            userDispatch({ payload: image.url, type: "UPDATE_AVATAR_IMAGE" });

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
        handleUpdateProfile,
        handleUpdatePassword,
        handleUpdateCoverImage,
        handleUpdateAvatarImage,
    };
};

export default useUser;
