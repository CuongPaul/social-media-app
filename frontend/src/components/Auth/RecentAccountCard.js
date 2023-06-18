import {
    Card,
    CardMedia,
    CardHeader,
    IconButton,
    Typography,
    CardActionArea,
} from "@material-ui/core";
import { Close } from "@material-ui/icons";
import React, { useState, Fragment, useContext } from "react";

import { AvatarIcon } from "../common";
import { UserContext } from "../../App";
import RecentAccountSigninForm from "./RecentAccountSigninForm";

const RecentAccountCard = ({ account }) => {
    const { userDispatch } = useContext(UserContext);

    const [isOpenSigninForm, setIsOpenSigninForm] = useState(false);

    const handleRemoveAccount = (accountId) => {
        userDispatch({ type: "REMOVE_RECENT_ACCOUNT", payload: accountId });
    };

    return (
        <Fragment>
            <div style={{ position: "relative" }}>
                <Card style={{ borderRadius: "8px" }}>
                    <CardActionArea onClick={() => setIsOpenSigninForm(true)}>
                        <CardMedia
                            style={{
                                display: "flex",
                                height: "150px",
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor: "rgb(245,246,247)",
                            }}
                        >
                            <AvatarIcon
                                size="80px"
                                border={false}
                                fontSize="40px"
                                variant="square"
                                text={account.name}
                                imageUrl={account.avatar_image}
                            />
                        </CardMedia>
                        <CardHeader
                            subheader={
                                <Typography style={{ fontWeight: 800, textAlign: "center" }}>
                                    {account.name}
                                </Typography>
                            }
                        />
                    </CardActionArea>
                </Card>
                <IconButton
                    size="small"
                    style={{
                        top: "-8px",
                        right: "-8px",
                        position: "absolute",
                        color: "rgb(255,255,255)",
                        backgroundColor: "rgb(255,99,72)",
                    }}
                    onClick={() => handleRemoveAccount(account._id)}
                >
                    <Close />
                </IconButton>
            </div>
            <RecentAccountSigninForm
                account={account}
                isOpenSigninForm={isOpenSigninForm}
                setIsOpenSigninForm={setIsOpenSigninForm}
            />
        </Fragment>
    );
};

export default RecentAccountCard;
