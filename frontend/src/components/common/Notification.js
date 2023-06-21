import { Alert } from "@material-ui/lab";
import React, { useContext } from "react";
import { Snackbar } from "@material-ui/core";

import { UIContext } from "../../App";

const Notification = () => {
    const {
        uiState: { alertMessage },
        uiDispatch,
    } = useContext(UIContext);

    const handleClose = () => {
        uiDispatch({ payload: null, type: "SET_ALERT_MESSAGE" });
    };

    return (
        <Snackbar
            onClose={handleClose}
            autoHideDuration={3000}
            open={alertMessage.display}
            style={{ color: "rgb(255,255,255)", marginTop: "60px" }}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
            <Alert onClose={handleClose} severity={alertMessage.color}>
                {alertMessage.text}
            </Alert>
        </Snackbar>
    );
};

export default Notification;
