import { useState, useEffect, useContext } from "react";

import callApi from "../api";
import { UIContext, UserContext } from "../App";

const useSignin = (formData) => {
    const { uiDispatch } = useContext(UIContext);
    const { userDispatch } = useContext(UserContext);

    const [loading, setLoading] = useState(false);
    const [formValue, setFormValue] = useState({ email: "", password: "" });

    const handleChangeEmail = (email) => {
        setFormValue({ ...formValue, email });
    };

    const handleChangePassword = (password) => {
        setFormValue({ ...formValue, password });
    };

    const handleClickSignin = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { data } = await callApi({
                method: "POST",
                data: formValue,
                url: "/auth/signin",
            });
            setLoading(false);

            localStorage.setItem("token", data.token);

            userDispatch({ type: "SET_FRIENDS_ONLINE", payload: data.friends_online });
            userDispatch({ type: "SET_CURRENT_USER", payload: data.user });
        } catch (err) {
            setLoading(false);
            uiDispatch({
                type: "SET_ALERT_MESSAGE",
                payload: { display: true, color: "error", text: err.message },
            });
        }
    };

    useEffect(() => {
        if (formData?.email) {
            setFormValue({ ...formValue, email: formData.email });
        }
    }, [formData]);

    return {
        loading,
        handleClickSignin,
        handleChangeEmail,
        handleChangePassword,
    };
};

export default useSignin;
