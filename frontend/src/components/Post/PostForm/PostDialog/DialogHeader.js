import {
    Paper,
    Avatar,
    IconButton,
    Typography,
    CardHeader,
    DialogContent,
} from "@material-ui/core";
import React, { useContext } from "react";
import { Close } from "@material-ui/icons";

import { UserContext } from "../../../../App";
import AvartarText from "../../../UI/AvartarText";
import CustomHeaderText from "./CustomHeaderText";

const DialogHeader = ({ handleCloseDialog, body }) => {
    const { userState } = useContext(UserContext);
    return (
        <div>
            <CardHeader
                avatar={
                    userState.currentUser.avatar_image ? (
                        <Avatar>
                            <img
                                alt="avatar"
                                style={{ width: "100%", height: "100%" }}
                                src={userState.currentUser.avatar_image}
                            />
                        </Avatar>
                    ) : (
                        <AvartarText backgroundColor="teal" text={userState?.currentUser?.name} />
                    )
                }
                title={
                    <>
                        <Typography style={{ fontWeight: "800", fontSize: "16px" }}>
                            {userState.currentUser.name}
                        </Typography>
                    </>
                }
                action={
                    <IconButton onClick={() => handleCloseDialog()}>
                        <Close />
                    </IconButton>
                }
            />
            <DialogContent>
                <Paper style={{ marginTop: "4px" }} elevation={0}>
                    <CustomHeaderText body={body} />
                </Paper>
            </DialogContent>
        </div>
    );
};

export default DialogHeader;
