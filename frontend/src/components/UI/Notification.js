import { Alert } from "@material-ui/lab";
import React, { useContext } from "react";
import { Snackbar } from "@material-ui/core";

import { UIContext } from "../../App";

const Notification = () => {
    const { uiState, uiDispatch } = useContext(UIContext);

    const handleClose = () => {
        uiDispatch({ payload: null, type: "SET_NOTIFICATION" });
    };

    return (
        <Snackbar
            onClose={handleClose}
            autoHideDuration={3000}
            open={uiState.message.display}
            style={{ color: "#fff", marginTop: 60 }}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
            <Alert onClose={handleClose} severity={uiState.message.color}>
                {uiState.message.text}
            </Alert>
        </Snackbar>
    );
};

export default Notification;
