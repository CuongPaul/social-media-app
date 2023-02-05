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
    const [isOpenAddForm, setIsOpenAddForm] = useState(false);

    const handleAddAccount = () => {
        setIsOpenAddForm(!isOpenAddForm);
    };

    return (
        <Fragment>
            <Card>
                <CardActionArea onClick={handleAddAccount}>
                    <CardMedia
                        style={{
                            display: "flex",
                            height: "150px",
                            alignItems: "center",
                            justifyContent: "center",
                            background: !uiState.darkMode ? "rgb(245,246,247)" : null,
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
                        <Typography style={{ fontWeight: "600" }}>Add account</Typography>
                    </CardContent>
                </CardActionArea>
            </Card>
            {isOpenAddForm && (
                <Dialog
                    fullWidth
                    scroll="body"
                    maxWidth="sm"
                    open={isOpenAddForm}
                    disableEscapeKeyDown
                    style={{ width: "100%" }}
                    onClose={handleAddAccount}
                >
                    <Card style={{ width: "100%" }}>
                        <CardHeader
                            subheader={
                                <Typography style={{ fontWeight: "700", fontSize: "20px" }}>
                                    Add account
                                </Typography>
                            }
                            action={
                                <IconButton color="primary" onClick={handleAddAccount}>
                                    <Close />
                                </IconButton>
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
