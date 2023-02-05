import { useState, useContext } from "react";

import { UIContext } from "../App";
import { signup } from "../services/AuthService";

const useSignup = () => {
    const { uiDispatch } = useContext(UIContext);

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [initialValue, setInitialValue] = useState({ name: "", email: "", password: "" });

    const handleChangeName = (name) => {
        setError({ ...error, name: "" });
        setInitialValue({ ...initialValue, name });
    };

    const handleChangeEmail = (email) => {
        setError({ ...error, email: "" });
        setInitialValue({ ...initialValue, email });
    };

    const handleChangePassword = (password) => {
        setError({ ...error, password: "" });
        setInitialValue({ ...initialValue, password });
    };

    const handleSignup = async (e) => {
        e.preventDefault();

        setLoading(true);

        try {
            const { error, status, message } = await signup(initialValue);

            setLoading(false);

            if (message) {
                uiDispatch({
                    type: "SET_MESSAGE",
                    payload: { display: true, text: message, color: "success" },
                });
            } else {
                if (status === 422) {
                    setError({ ...error });
                } else {
                    uiDispatch({
                        type: "SET_MESSAGE",
                        payload: { text: error, display: true, color: "error" },
                    });
                }
            }
        } catch (err) {
            setLoading(false);

            uiDispatch({
                type: "SET_MESSAGE",
                payload: { text: err.message, display: true, color: "error" },
            });
        }
    };

    return {
        error,
        loading,
        handleSignup,
        handleChangeName,
        handleChangeEmail,
        handleChangePassword,
    };
};

export default useSignup;
