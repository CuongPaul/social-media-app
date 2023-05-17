import React from "react";
import {
    Card,
    Avatar,
    Button,
    Dialog,
    TextField,
    CardMedia,
    CardHeader,
    IconButton,
    Typography,
    CardContent,
    FormControl,
    CircularProgress,
} from "@material-ui/core";
import { Close } from "@material-ui/icons";

import { useSignin } from "../../hooks";
import AvatarIcon from "../UI/AvatarIcon";

const RecentAccountSigninForm = ({ account, isShowSigninForm, setIsShowSigninForm }) => {
    const { loading, handleClickSignin, handleChangePassword } = useSignin(account);

    return (
        <Dialog
            fullWidth
            open={isShowSigninForm}
            style={{ width: "100%" }}
            onClose={() => setIsShowSigninForm(false)}
        >
            <Card style={{ width: "100%", borderRadius: "5px" }}>
                <CardHeader
                    action={
                        <IconButton color="primary" onClick={() => setIsShowSigninForm(false)}>
                            <Close />
                        </IconButton>
                    }
                />
                {account.avatar_image ? (
                    <CardMedia
                        style={{
                            width: "100%",
                            display: "flex",
                            height: "150px",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <Avatar
                            src={account.avatar_image}
                            style={{ height: "200px", width: "200px" }}
                        />
                    </CardMedia>
                ) : (
                    <CardMedia
                        style={{
                            height: "150px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <AvatarIcon text={account.name} size="100px" fontSize="35px" />
                    </CardMedia>
                )}
                <CardContent>
                    <Typography
                        style={{
                            fontSize: "20px",
                            marginTop: "8px",
                            fontWeight: "800",
                            textAlign: "center",
                        }}
                    >
                        {account.name}
                    </Typography>
                    <form onSubmit={handleClickSignin}>
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
                                color: "#fff",
                                width: "100%",
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
                                "Sign in"
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </Dialog>
    );
};

export default RecentAccountSigninForm;
