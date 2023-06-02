import { Alert } from "@material-ui/lab";
import React, { useContext } from "react";
import { Snackbar } from "@material-ui/core";

import { UIContext } from "../../App";

const Notification = () => {
    const { uiState, uiDispatch } = useContext(UIContext);

    const handleClose = () => {
        uiDispatch({ payload: null, type: "SET_ALERT_MESSAGE" });
    };

    return (
        <Snackbar
            onClose={handleClose}
            autoHideDuration={3000}
            open={uiState.alert_message.display}
            style={{ color: "#fff", marginTop: 60 }}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
            <Alert onClose={handleClose} severity={uiState.alert_message.color}>
                {uiState.alert_message.text}
            </Alert>
        </Snackbar>
    );
};

export default Notification;
