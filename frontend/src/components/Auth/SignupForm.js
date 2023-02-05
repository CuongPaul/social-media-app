import React, { Fragment } from "react";
import { Button, TextField, FormControl, CircularProgress } from "@material-ui/core";

import useSignup from "../../hooks/useSignup";

const SignupForm = () => {
    const {
        error,
        loading,
        handleSignup,
        handleChangeName,
        handleChangeEmail,
        handleChangePassword,
    } = useSignup();

    return (
        <Fragment>
            <form onSubmit={handleSignup}>
                <FormControl style={{ width: "100%" }}>
                    <TextField
                        label="Name"
                        variant="outlined"
                        style={{ marginTop: "16px" }}
                        error={error?.name ? true : false}
                        helperText={error?.name ? error.name : null}
                        onChange={(e) => handleChangeName(e.target.value)}
                    />
                </FormControl>
                <FormControl style={{ width: "100%" }}>
                    <TextField
                        label="Email"
                        variant="outlined"
                        style={{ marginTop: "16px" }}
                        error={error?.email ? true : false}
                        helperText={error?.email ? error.email : null}
                        onChange={(e) => handleChangeEmail(e.target.value)}
                    />
                </FormControl>
                <FormControl style={{ width: "100%" }}>
                    <TextField
                        type="password"
                        label="Password"
                        variant="outlined"
                        style={{ marginTop: "16px" }}
                        error={error?.password ? true : false}
                        helperText={error?.password ? error.password : null}
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
                        <CircularProgress
                            size={25}
                            variant="indeterminate"
                            style={{ color: "#fff" }}
                        />
                    ) : (
                        " Sign up"
                    )}
                </Button>
            </form>
        </Fragment>
    );
};

export default SignupForm;
