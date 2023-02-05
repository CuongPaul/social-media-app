import { useHistory } from "react-router-dom";
import { useState, useEffect, useContext } from "react";

import { UIContext } from "../App";
import { signin } from "../services/AuthService";

const useSignin = (userData = null) => {
    const { uiDispatch } = useContext(UIContext);

    const history = useHistory();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [initialValue, setInitialValue] = useState({ email: "", password: "" });

    const handleChangeEmail = (email) => {
        setError({ ...error, email: "" });
        setInitialValue({ ...initialValue, email });
    };

    const handleChangePassword = (password) => {
        setError({ ...error, password: "" });
        setInitialValue({ ...initialValue, password });
    };

    const handleSignin = async (e) => {
        e.preventDefault();

        setLoading(true);

        try {
            const { data, error, status, message } = await signin(initialValue);

            setLoading(false);

            if (message) {
                localStorage.setItem("token", JSON.stringify(data.token));

                uiDispatch({
                    type: "SET_MESSAGE",
                    payload: { display: true, text: message, color: "success" },
                });

                history.push("/home");
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

    useEffect(() => {
        setInitialValue((initialValue) => ({
            ...initialValue,
            email: userData ? userData.email : "",
        }));
    }, [userData]);

    return {
        error,
        loading,
        handleSignin,
        handleChangeEmail,
        handleChangePassword,
    };
};

export default useSignin;
