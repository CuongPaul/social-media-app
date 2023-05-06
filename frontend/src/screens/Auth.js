import React, { useState, useEffect, useContext } from "react";
import { Grid, Paper, Button, Divider, Container, Typography } from "@material-ui/core";

import { UIContext, UserContext } from "../App";
import SigninForm from "../components/Auth/SigninForm";
import SignupForm from "../components/Auth/SignupForm";
import AddAccountCard from "../components/Auth/AddAccountCard";
import RecentAccountCard from "../components/Auth/RecentAccountCard";

const Auth = () => {
    const { uiState } = useContext(UIContext);
    const { userState, userDispatch } = useContext(UserContext);

    const [isShowSigninForm, setIsShowSigninForm] = useState(true);

    useEffect(() => {
        userDispatch({ type: "RECENT_ACCOUNTS", payload: localStorage.getItem("accounts") });
    }, [userDispatch]);

    return (
        <div style={{ minHeight: "100vh", paddingBottom: "100px" }}>
            <Container>
                <Grid
                    container
                    direction="column"
                    justifyContent="center"
                    alignItems="flex-start"
                    style={{ paddingTop: "30px" }}
                >
                    <Typography
                        variant="h4"
                        style={{ fontWeight: 800, color: uiState.darkMode ? "white" : "black" }}
                    >
                        Facebook
                    </Typography>
                    <Typography
                        variant="h6"
                        style={{ fontWeight: 800, color: uiState.darkMode ? "white" : "black" }}
                    >
                        Sign in recent
                    </Typography>
                    <Typography
                        variant="body2"
                        style={{
                            fontWeight: 800,
                            marginTop: "16px",
                            color: uiState.darkMode ? "white" : "black",
                        }}
                    >
                        click your picture or add an account
                    </Typography>
                </Grid>
                <Grid container spacing={3} style={{ marginTop: "20px" }}>
                    <Grid item xs={12} sm={6} md={8}>
                        <Grid container spacing={2}>
                            <Grid container spacing={2}>
                                {userState.recentAccounts.map((account) => (
                                    <Grid item xs={6} sm={6} md={3} key={account.id}>
                                        <RecentAccountCard account={account} />
                                    </Grid>
                                ))}
                            </Grid>
                            <Grid item xs={6} sm={6} md={3}>
                                <AddAccountCard />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <Paper
                            elevation={8}
                            style={{
                                padding: "16px",
                                display: "flex",
                                flexDirection: "column",
                            }}
                        >
                            {isShowSigninForm ? <SigninForm /> : <SignupForm />}
                            <Divider />
                            <Button
                                style={{
                                    color: "#fff",
                                    marginTop: "32px",
                                    background: "rgb(74,183,43)",
                                }}
                                onClick={() => setIsShowSigninForm(!isShowSigninForm)}
                            >
                                {isShowSigninForm
                                    ? "Create new account"
                                    : " Already have an account"}
                            </Button>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </div>
    );
};

export default Auth;
