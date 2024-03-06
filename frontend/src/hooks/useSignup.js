import { useState, useContext } from "react";

import callApi from "../api";
import { UIContext, UserContext } from "../App";

const useSignup = () => {
  const { uiDispatch } = useContext(UIContext);
  const { userDispatch } = useContext(UserContext);

  const [isLoading, setIsLoading] = useState(false);
  const [formValue, setFormValue] = useState({
    name: "",
    email: "",
    password: "",
  });

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
    setIsLoading(true);

    try {
      const { data } = await callApi({
        method: "POST",
        data: formValue,
        url: "/auth/signup",
      });

      localStorage.setItem("token", data.token);

      userDispatch({ type: "SET_CURRENT_USER", payload: data.user });

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
    handleSignup,
    handleChangeName,
    handleChangeEmail,
    handleChangePassword,
  };
};

export default useSignup;
