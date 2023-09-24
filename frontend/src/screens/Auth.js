import React, { useState, useContext } from "react";
import { Grid, Paper, Button, Container, Typography } from "@material-ui/core";

import { UIContext, UserContext } from "../App";
import { SigninForm, SignupForm, AddAccountCard, RecentAccountCard } from "../components/Auth";

const Auth = () => {
    const {
        uiState: { darkMode },
    } = useContext(UIContext);
    const {
        userState: { recentAccounts },
    } = useContext(UserContext);

    const [isShowSigninForm, setIsShowSigninForm] = useState(true);

    return (
        <Container style={{ minHeight: "100vh" }}>
            <Grid style={{ paddingTop: "30px" }}>
                <Typography
                    variant="h4"
                    style={{
                        fontWeight: 800,
                        color: darkMode ? "rgb(255,255,255)" : "rgb(24,119,242)",
                    }}
                >
                    Fansoan
                </Typography>
                <Typography
                    variant="h6"
                    style={{
                        fontWeight: 800,
                        color: darkMode ? "rgb(255,255,255)" : "rgb(24,119,242)",
                    }}
                >
                    Recent sign in
                </Typography>
                <Typography
                    variant="body2"
                    style={{
                        fontWeight: 800,
                        marginTop: "16px",
                        color: darkMode ? "rgb(255,255,255)" : "rgb(24,119,242)",
                    }}
                >
                    click your picture or add an account
                </Typography>
            </Grid>
            <Grid container spacing={9} style={{ marginTop: "20px" }}>
                <Grid item md={8} container spacing={2}>
                    {recentAccounts.map((account) => (
                        <Grid item md={3} key={account._id}>
                            <RecentAccountCard account={account} />
                        </Grid>
                    ))}
                    <Grid item md={3} xs={6} sm={6}>
                        <AddAccountCard />
                    </Grid>
                </Grid>
                <Grid item md={4}>
                    <Paper
                        style={{
                            padding: "32px",
                            display: "flex",
                            borderRadius: "10px",
                            flexDirection: "column",
                        }}
                    >
                        {isShowSigninForm ? <SigninForm /> : <SignupForm />}
                        <Button
                            style={{
                                marginTop: "16px",
                                color: "rgb(255,255,255)",
                                backgroundColor: "rgb(74,183,43)",
                            }}
                            onClick={() => setIsShowSigninForm(!isShowSigninForm)}
                        >
                            {isShowSigninForm ? "Create new account" : "Already have an account"}
                        </Button>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default Auth;
