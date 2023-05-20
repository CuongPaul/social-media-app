import { useState, useContext } from "react";

import callApi from "../api";
import { UIContext } from "../App";

const useSignup = () => {
    const { uiDispatch } = useContext(UIContext);

    const [loading, setLoading] = useState(false);
    const [formValue, setFormValue] = useState({ name: "", email: "", password: "" });

    const handleChangeName = (name) => {
        setFormValue({ ...formValue, name });
    };

    const handleChangeEmail = (email) => {
        setFormValue({ ...formValue, email });
    };

    const handleChangePassword = (password) => {
        setFormValue({ ...formValue, password });
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { data, message } = await callApi({
                method: "POST",
                data: formValue,
                url: "/auth/signup",
            });
            setLoading(false);

            localStorage.setItem("token", data.token);

            uiDispatch({
                type: "SET_ALERT_MESSAGE",
                payload: { display: true, text: message, color: "success" },
            });
        } catch (err) {
            setLoading(false);
            uiDispatch({
                type: "SET_ALERT_MESSAGE",
                payload: { display: true, color: "error", text: err.message },
            });
        }
    };

    return {
        loading,
        handleSignup,
        handleChangeName,
        handleChangeEmail,
        handleChangePassword,
    };
};

export default useSignup;
