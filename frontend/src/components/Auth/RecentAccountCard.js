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
import AvatarIcon from "../UI/AvatarIcon";
import RecentAccountSigninForm from "./RecentAccountSigninForm";

const RecentAccountCard = ({ account }) => {
    const { userDispatch } = useContext(UserContext);

    const [isShowSigninForm, setIsShowSigninForm] = useState(false);

    const handleRemoveAccount = () => {
        userDispatch({ type: "REMOVE_RECENT_ACCOUNT", payload: account._id });
    };

    return (
        <Fragment>
            <div style={{ position: "relative" }}>
                <Card style={{ borderRadius: "8px" }}>
                    <CardActionArea onClick={() => setIsShowSigninForm(true)}>
                        <CardMedia
                            style={{
                                display: "flex",
                                height: "150px",
                                alignItems: "center",
                                justifyContent: "center",
                                background: "rgb(245,246,247)",
                            }}
                        >
                            <AvatarIcon
                                size="80px"
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
                        top: -8,
                        right: -8,
                        color: "#fff",
                        background: "tomato",
                        position: "absolute",
                    }}
                    onClick={handleRemoveAccount}
                >
                    <Close />
                </IconButton>
            </div>
            <RecentAccountSigninForm
                account={account}
                isShowSigninForm={isShowSigninForm}
                setIsShowSigninForm={setIsShowSigninForm}
            />
        </Fragment>
    );
};

export default RecentAccountCard;
