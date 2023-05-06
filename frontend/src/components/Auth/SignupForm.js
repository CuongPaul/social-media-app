import React from "react";
import { Button, TextField, FormControl, CircularProgress } from "@material-ui/core";

import { useSignup } from "../../hooks";

const SignupForm = () => {
    const { loading, handleSignup, handleChangeName, handleChangeEmail, handleChangePassword } =
        useSignup();

    return (
        <form onSubmit={handleSignup}>
            <FormControl style={{ width: "100%" }}>
                <TextField
                    label="Name"
                    variant="outlined"
                    style={{ marginTop: "16px" }}
                    onChange={(e) => handleChangeName(e.target.value)}
                />
            </FormControl>
            <FormControl style={{ width: "100%" }}>
                <TextField
                    label="Email"
                    variant="outlined"
                    style={{ marginTop: "16px" }}
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
                    marginTop: "16px",
                    background: "rgb(24,119,242)",
                }}
            >
                {loading ? (
                    <CircularProgress size={25} variant="indeterminate" style={{ color: "#fff" }} />
                ) : (
                    " Sign up"
                )}
            </Button>
        </form>
    );
};

export default SignupForm;
