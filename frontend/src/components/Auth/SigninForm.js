import React, { useState } from "react";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import { Button, TextField, IconButton, FormControl, InputAdornment } from "@material-ui/core";

import { useSignin } from "../../hooks";
import LoadingIcon from "../UI/Loading";

const SigninForm = () => {
    const [isShowPassword, setIsShowPassword] = useState(false);

    const { isLoading, handleClickSignin, handleChangeEmail, handleChangePassword } = useSignin();

    return (
        <form onSubmit={handleClickSignin}>
            <FormControl style={{ width: "100%" }}>
                <TextField
                    label="Email"
                    variant="outlined"
                    onChange={(e) => handleChangeEmail(e.target.value)}
                />
            </FormControl>
            <FormControl style={{ width: "100%" }}>
                <TextField
                    label="Password"
                    variant="outlined"
                    style={{ marginTop: "16px" }}
                    type={isShowPassword ? "text" : "password"}
                    onChange={(e) => handleChangePassword(e.target.value)}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={() => setIsShowPassword(!isShowPassword)}>
                                    {isShowPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
            </FormControl>
            <Button
                type="submit"
                variant="contained"
                disabled={isLoading}
                style={{
                    width: "100%",
                    marginTop: "32px",
                    color: "rgb(255,255,255)",
                    background: "rgb(24,119,242)",
                }}
            >
                <LoadingIcon text={"Sign in"} isLoading={isLoading} />
            </Button>
        </form>
    );
};

export default SigninForm;
