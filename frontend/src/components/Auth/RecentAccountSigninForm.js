import {
    Button,
    Dialog,
    TextField,
    CardMedia,
    CardHeader,
    IconButton,
    Typography,
    CardContent,
    FormControl,
    InputAdornment,
    CircularProgress,
} from "@material-ui/core";
import React, { useState } from "react";
import { Close, Visibility, VisibilityOff } from "@material-ui/icons";

import { useSignin } from "../../hooks";
import AvatarIcon from "../UI/AvatarIcon";

const RecentAccountSigninForm = ({ account, isShowSigninForm, setIsShowSigninForm }) => {
    const [isShowPassword, setIsShowPassword] = useState(false);

    const { loading, handleClickSignin, handleChangePassword } = useSignin(account);

    return (
        <Dialog fullWidth open={isShowSigninForm} onClose={() => setIsShowSigninForm(false)}>
            <CardHeader
                action={
                    <IconButton color="primary" onClick={() => setIsShowSigninForm(false)}>
                        <Close />
                    </IconButton>
                }
            />
            <CardMedia
                style={{
                    width: "100%",
                    display: "flex",
                    height: "150px",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <AvatarIcon
                    size="200px"
                    fontSize="150px"
                    text={account.name}
                    imageUrl={account.avatar_image}
                />
            </CardMedia>
            <CardContent>
                <Typography
                    style={{
                        fontWeight: 800,
                        fontSize: "20px",
                        marginTop: "40px",
                        textAlign: "center",
                    }}
                >
                    {account.name}
                </Typography>
                <form onSubmit={handleClickSignin} style={{ padding: "20px 32px" }}>
                    <FormControl style={{ width: "100%" }}>
                        <TextField
                            autoFocus
                            label="Password"
                            variant="outlined"
                            style={{ marginTop: "16px" }}
                            type={isShowPassword ? "text" : "password"}
                            onChange={(e) => handleChangePassword(e.target.value)}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() => setIsShowPassword(!isShowPassword)}
                                        >
                                            {isShowPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
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
        </Dialog>
    );
};

export default RecentAccountSigninForm;
