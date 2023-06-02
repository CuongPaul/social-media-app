import {
    Button,
    TextField,
    IconButton,
    FormControl,
    InputAdornment,
    CircularProgress,
} from "@material-ui/core";
import React, { useState } from "react";
import { Visibility, VisibilityOff } from "@material-ui/icons";

import { useSignin } from "../../hooks";

const SigninForm = () => {
    const [isShowPassword, setIsShowPassword] = useState(false);

    const { loading, handleClickSignin, handleChangeEmail, handleChangePassword } = useSignin();

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
                disabled={loading}
                variant="contained"
                style={{
                    width: "100%",
                    color: "#fff",
                    marginTop: "32px",
                    background: "rgb(24,119,242)",
                }}
            >
                {loading ? (
                    <CircularProgress size={25} variant="indeterminate" style={{ color: "#fff" }} />
                ) : (
                    "Sign in"
                )}
            </Button>
        </form>
    );
};

export default SigninForm;
