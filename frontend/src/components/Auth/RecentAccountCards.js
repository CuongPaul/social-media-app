import {
    Card,
    Badge,
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
    CardActionArea,
    CircularProgress,
} from "@material-ui/core";
import React, { useContext, useState } from "react";
import { Close, Notifications } from "@material-ui/icons";

import AvartarText from "../UI/AvartarText";
import useSignin from "../../hooks/useSignin";
import { UserContext, UIContext } from "../../App";

const RecentAccountCards = ({ account }) => {
    const { uiDispatch } = useContext(UIContext);
    const { userDispatch } = useContext(UserContext);

    const [isOpenLoginCard, setIsOpenLoginCard] = useState(false);

    const { error, loading, handleSignin, handleChangePassword } =
        useSignin(account);

    const handleRemoveAccount = (account_id) => {
        userDispatch({ type: "REMOVE_RECENT_ACCOUNT", payload: account_id });
        uiDispatch({
            type: "SET_MESSAGE",
            payload: {
                display: true,
                color: "success",
                text: "Account removed",
            },
        });
    };

    return (
        <>
            <Card style={{ position: "relative" }}>
                <CardActionArea onClick={() => setIsOpenLoginCard(true)}>
                    {account.avatar_image ? (
                        <CardMedia
                            style={{ height: "150px" }}
                            image={account.avatar_image}
                        />
                    ) : (
                        <CardMedia
                            style={{
                                display: "flex",
                                height: "150px",
                                alignItems: "center",
                                justifyContent: "center",
                                background: "rgb(245,246,247)",
                            }}
                        >
                            <AvartarText
                                bg="teal"
                                size="60px"
                                fontSize="25px"
                                text={account.name}
                            />
                        </CardMedia>
                    )}
                    <CardHeader
                        avatar={
                            <Badge badgeContent={5} color={"primary"}>
                                <Notifications style={{ color: "GrayText" }} />
                            </Badge>
                        }
                        subheader={
                            <Typography style={{ fontWeight: "800" }}>
                                {account.name.slice(0, 6)}..
                            </Typography>
                        }
                    />
                </CardActionArea>
                <IconButton
                    size="small"
                    style={{
                        top: 0,
                        right: 0,
                        color: "#fff",
                        background: "tomato",
                        position: "absolute",
                    }}
                    onClick={() => handleRemoveAccount(account.id)}
                >
                    <Close />
                </IconButton>
            </Card>
            {isOpenLoginCard && (
                <Dialog
                    fullWidth
                    maxWidth="sm"
                    scroll="body"
                    open={isOpenLoginCard}
                    disableEscapeKeyDown
                    style={{ width: "100%" }}
                    onClose={() => setIsOpenLoginCard(false)}
                >
                    <Card style={{ width: "100%" }}>
                        <CardHeader
                            action={
                                <IconButton
                                    color="primary"
                                    onClick={() => setIsOpenLoginCard(false)}
                                >
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
                                <AvartarText
                                    bg="teal"
                                    text={account.name}
                                    size="100px"
                                    fontSize="35px"
                                />
                            </CardMedia>
                        )}
                        <CardContent>
                            <div
                                style={{
                                    display: "flex",
                                    marginTop: "20px",
                                    alignItems: "center",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                }}
                            >
                                <Typography
                                    style={{
                                        fontSize: "20px",
                                        marginTop: "8px",
                                        fontWeight: "800",
                                    }}
                                >
                                    {account && account.name}
                                </Typography>
                            </div>
                            <form onSubmit={handleSignin}>
                                <FormControl style={{ width: "100%" }}>
                                    <TextField
                                        type="password"
                                        label="Password"
                                        variant="outlined"
                                        style={{ marginTop: "16px" }}
                                        onChange={handleChangePassword}
                                        error={error?.password ? true : false}
                                        helperText={
                                            error?.password
                                                ? error.password
                                                : null
                                        }
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
            )}
        </>
    );
};

export default RecentAccountCards;
