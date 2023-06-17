import {
    Card,
    Avatar,
    Dialog,
    CardMedia,
    Typography,
    CardContent,
    CardActionArea,
} from "@material-ui/core";
import { Add } from "@material-ui/icons";
import React, { useState, Fragment } from "react";

import SigninForm from "./SigninForm";

const AddAccountCard = () => {
    const [isOpenAddAccountForm, setIsOpenAddAccountForm] = useState(false);

    return (
        <Fragment>
            <Card style={{ borderRadius: "8px" }}>
                <CardActionArea onClick={() => setIsOpenAddAccountForm(true)}>
                    <CardMedia
                        style={{
                            display: "flex",
                            height: "150px",
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: "rgb(245,246,247)",
                        }}
                    >
                        <Avatar
                            style={{
                                width: "50px",
                                height: "50px",
                                color: "rgb(255,255,255)",
                                backgroundColor: "rgb(24,119,242)",
                            }}
                        >
                            <Add />
                        </Avatar>
                    </CardMedia>
                    <CardContent>
                        <Typography style={{ fontWeight: 600, textAlign: "center" }}>
                            Add account
                        </Typography>
                    </CardContent>
                </CardActionArea>
            </Card>
            <Dialog
                style={{ width: "100%" }}
                open={isOpenAddAccountForm}
                onClose={() => setIsOpenAddAccountForm(false)}
            >
                <Card style={{ width: "100%" }}>
                    <CardContent style={{ padding: "32px" }}>
                        <SigninForm />
                    </CardContent>
                </Card>
            </Dialog>
        </Fragment>
    );
};

export default AddAccountCard;
