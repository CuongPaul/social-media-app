import { useState, useEffect, useContext } from "react";

import CallAPI from "../api";
import { UIContext } from "../App";

const useSignin = (formData = null) => {
    const { uiDispatch } = useContext(UIContext);

    const [loading, setLoading] = useState(false);
    const [formValue, setFormValue] = useState({ email: "", password: "" });

    const handleChangeEmail = (email) => {
        setFormValue({ ...formValue, email });
    };

    const handleChangePassword = (password) => {
        setFormValue({ ...formValue, password });
    };

    const handleSignin = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { data, message } = await CallAPI({
                method: "POST",
                data: formValue,
                url: "/auth/signin",
            });
            setLoading(false);

            localStorage.setItem("token", data.token);

            uiDispatch({
                type: "SET_MESSAGE",
                payload: { display: true, text: message, color: "success" },
            });
        } catch (err) {
            setLoading(false);
            uiDispatch({
                type: "SET_MESSAGE",
                payload: { display: true, color: "error", text: err.message },
            });
        }
    };

    useEffect(() => {
        if (formData?.email) {
            setFormValue((formValue) => ({ ...formValue, email: formData.email }));
        }
    }, [formData]);

    return {
        loading,
        handleSignin,
        handleChangeEmail,
        handleChangePassword,
    };
};

export default useSignin;
