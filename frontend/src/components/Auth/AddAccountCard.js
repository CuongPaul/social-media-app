import {
    Card,
    Avatar,
    Dialog,
    CardMedia,
    CardHeader,
    IconButton,
    Typography,
    CardContent,
    CardActionArea,
} from "@material-ui/core";
import { Add, Close } from "@material-ui/icons";
import React, { useState, useContext, Fragment } from "react";

import SigninForm from "./SigninForm";
import { UIContext } from "../../App";

const AddAccountCard = () => {
    const { uiState } = useContext(UIContext);

    const [isShowAddAccountForm, setIsShowAddAccountForm] = useState(false);

    return (
        <Fragment>
            <Card>
                <CardActionArea onClick={() => setIsShowAddAccountForm(true)}>
                    <CardMedia
                        style={{
                            display: "flex",
                            height: "150px",
                            alignItems: "center",
                            justifyContent: "center",
                            background: uiState.darkMode ? null : "rgb(245,246,247)",
                        }}
                    >
                        <Avatar
                            style={{
                                color: "#fff",
                                width: "50px",
                                height: "50px",
                                background: "rgb(24,119,242)",
                            }}
                        >
                            <Add />
                        </Avatar>
                    </CardMedia>
                    <CardContent>
                        <Typography style={{ fontWeight: "600", textAlign: "center" }}>
                            Add account
                        </Typography>
                    </CardContent>
                </CardActionArea>
            </Card>
            {isShowAddAccountForm && (
                <Dialog
                    fullWidth
                    scroll="body"
                    maxWidth="sm"
                    disableEscapeKeyDown
                    style={{ width: "100%" }}
                    open={isShowAddAccountForm}
                    onClose={() => setIsShowAddAccountForm(false)}
                >
                    <Card style={{ width: "100%" }}>
                        <CardHeader
                            action={
                                <IconButton
                                    color="primary"
                                    onClick={() => setIsShowAddAccountForm(false)}
                                >
                                    <Close />
                                </IconButton>
                            }
                            subheader={
                                <Typography style={{ fontWeight: "700", fontSize: "20px" }}>
                                    Add account
                                </Typography>
                            }
                        />
                        <CardContent>
                            <SigninForm />
                        </CardContent>
                    </Card>
                </Dialog>
            )}
        </Fragment>
    );
};

export default AddAccountCard;
