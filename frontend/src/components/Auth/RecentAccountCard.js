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

import { UserContext } from "../../App";
import AvartaText from "../UI/AvartaText";
import RecentAccountSigninForm from "./RecentAccountSigninForm";

const RecentAccountCard = ({ account }) => {
    const { userDispatch } = useContext(UserContext);

    const [isShowSigninForm, setIsShowSigninForm] = useState(false);

    const handleRemoveAccount = () => {
        userDispatch({ type: "REMOVE_RECENT_ACCOUNT", payload: account._id });
    };

    return (
        <Fragment>
            <Card style={{ position: "relative", borderRadius: "5px" }}>
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
                            <AvartaText size="60px" fontSize="25px" text={account.name} />
                        </CardMedia>
                    )}
                    <CardHeader
                        subheader={
                            <Typography style={{ fontWeight: 800, textAlign: "center" }}>
                                {account.name}
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
                    onClick={handleRemoveAccount}
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
