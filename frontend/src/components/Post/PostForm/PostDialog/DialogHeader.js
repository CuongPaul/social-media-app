import React from "react";
import {
    Paper,
    Avatar,
    IconButton,
    Typography,
    CardHeader,
    DialogContent,
} from "@material-ui/core";
import { Close } from "@material-ui/icons";

import AvartarText from "../../../UI/AvartarText";
import CustomHeaderText from "./CustomHeaderText";

const DialogHeader = ({ userState, handleCloseDialog, body }) => {
    return (
        <div>
            <CardHeader
                avatar={
                    userState.currentUser.profile_pic ? (
                        <Avatar>
                            <img
                                alt="avatar"
                                style={{ width: "100%", height: "100%" }}
                                src={userState.currentUser.profile_pic}
                            />
                        </Avatar>
                    ) : (
                        <AvartarText text={userState.currentUser.name} bg="teal" />
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
                <Paper
                    style={{
                        marginTop: "4px",
                    }}
                    elevation={0}
                >
                    <CustomHeaderText userState={userState} body={body} />
                </Paper>
            </DialogContent>
        </div>
    );
};

export default DialogHeader;
