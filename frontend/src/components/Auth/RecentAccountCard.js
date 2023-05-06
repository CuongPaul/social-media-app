import {
    Card,
    Badge,
    CardMedia,
    CardHeader,
    IconButton,
    Typography,
    CardActionArea,
} from "@material-ui/core";
import { Close, Notifications } from "@material-ui/icons";
import React, { useContext, useState, Fragment } from "react";

import { UserContext } from "../../App";
import AvartarText from "../UI/AvartarText";
import RecentAccountSigninForm from "./RecentAccountSigninForm";

const RecentAccountCard = ({ account }) => {
    const { userDispatch } = useContext(UserContext);

    const [isShowSigninForm, setIsShowSigninForm] = useState(false);

    const handleRemoveAccount = (account_id) => {
        userDispatch({ type: "REMOVE_RECENT_ACCOUNT", payload: account_id });
    };

    return (
        <Fragment>
            <Card style={{ position: "relative" }}>
                <CardActionArea onClick={() => setIsShowSigninForm(true)}>
                    {account.avatar_image ? (
                        <CardMedia style={{ height: "150px" }} image={account.avatar_image} />
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
                            <Typography style={{ fontWeight: "800" }}>{account.name}</Typography>
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
            {isShowSigninForm && (
                <RecentAccountSigninForm
                    account={account}
                    isShowSigninForm={isShowSigninForm}
                    setIsShowSigninForm={setIsShowSigninForm}
                />
            )}
        </Fragment>
    );
};

export default RecentAccountCard;