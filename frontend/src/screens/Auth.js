import React, { useState, useEffect, useContext } from "react";
import { Grid, Paper, Button, Divider, Container, Typography } from "@material-ui/core";

import { UIContext, UserContext } from "../App";
import { SigninForm, SignupForm, AddAccountCard, RecentAccountCard } from "../components/Auth";

const Auth = () => {
    const { uiState } = useContext(UIContext);
    const { userState, userDispatch } = useContext(UserContext);

    const [isShowSigninForm, setIsShowSigninForm] = useState(true);

    useEffect(() => {
        userDispatch({
            type: "SET_RECENT_ACCOUNTS",
            payload: JSON.parse(localStorage.getItem("accounts")) || [],
        });
    }, []);

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
                <Grid container spacing={9} style={{ marginTop: "20px" }}>
                    <Grid item sm={6} md={8} xs={12} container spacing={2}>
                        {userState.recentAccounts.map((account) => (
                            <Grid item md={3} xs={6} sm={6} key={account._id}>
                                <RecentAccountCard account={account} />
                            </Grid>
                        ))}
                        <Grid item md={3} xs={6} sm={6}>
                            <AddAccountCard />
                        </Grid>
                    </Grid>
                    <Grid item md={4} xs={12} sm={6}>
                        <Paper
                            elevation={8}
                            style={{
                                padding: "32px",
                                display: "flex",
                                borderRadius: "10px",
                                flexDirection: "column",
                            }}
                        >
                            {isShowSigninForm ? <SigninForm /> : <SignupForm />}
                            <Divider />
                            <Button
                                style={{
                                    color: "#fff",
                                    marginTop: "16px",
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
