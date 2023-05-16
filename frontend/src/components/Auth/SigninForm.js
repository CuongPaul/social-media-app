import React from "react";
import { Button, TextField, FormControl, CircularProgress } from "@material-ui/core";

import { useSignin } from "../../hooks";

const SigninForm = () => {
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
                    type="password"
                    label="Password"
                    variant="outlined"
                    style={{ marginTop: "16px" }}
                    onChange={(e) => handleChangePassword(e.target.value)}
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
