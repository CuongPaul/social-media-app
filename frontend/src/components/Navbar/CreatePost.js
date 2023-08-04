import { PostAdd } from "@material-ui/icons";
import { useHistory } from "react-router-dom";
import { IconButton } from "@material-ui/core";
import React, { useState, Fragment, useContext } from "react";

import { PostDialog } from "../Post";
import { UIContext } from "../../App";

const CreatePost = () => {
    const {
        uiState: { darkMode },
    } = useContext(UIContext);

    const history = useHistory();

    const [isOpen, setIsOpen] = useState(false);

    return (
        <Fragment>
            <IconButton
                onClick={() => setIsOpen(true)}
                style={{
                    marginLeft: "32px",
                    color: darkMode ? "rgb(227,229,233)" : "rgb(5,5,5)",
                    backgroundColor: darkMode ? "rgb(58,59,60)" : "rgb(226,228,232)",
                }}
            >
                <PostAdd />
            </IconButton>
            <PostDialog isOpen={isOpen} setIsOpen={setIsOpen} />
        </Fragment>
    );
};

export default CreatePost;
