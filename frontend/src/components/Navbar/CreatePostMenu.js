import { useHistory } from "react-router-dom";
import { IconButton } from "@material-ui/core";
import React, { Fragment, useContext } from "react";

import { UIContext } from "../../App";
import { PostAdd } from "@material-ui/icons";

const CreatePostMenu = () => {
    const { uiState, uiDispatch } = useContext(UIContext);

    const history = useHistory();

    const handlePostOpen = () => {
        history.push("/home");
        uiDispatch({ type: "DISPLAY_POST_DIALOG", payload: true });
    };

    return (
        <Fragment>
            <IconButton
                style={{
                    marginLeft: "8px",
                    color: uiState.darkMode ? null : "black",
                    backgroundColor: uiState.darkMode ? null : "#F0F2F5",
                }}
                onClick={handlePostOpen}
            >
                <PostAdd />
            </IconButton>
        </Fragment>
    );
};

export default CreatePostMenu;
