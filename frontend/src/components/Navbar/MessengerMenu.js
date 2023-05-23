import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { Badge, IconButton } from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebookMessenger } from "@fortawesome/free-brands-svg-icons";

import { UIContext } from "../../App";

const MessengerMenu = () => {
    const { uiState } = useContext(UIContext);

    return (
        <IconButton
            to="/messenger"
            component={NavLink}
            activeStyle={{ color: "rgb(1,133,243)" }}
            style={{
                color: uiState.darkMode ? null : "black",
                backgroundColor: uiState.darkMode ? null : "#F0F2F5",
            }}
        >
            <Badge max={9} color="error" badgeContent={8} overlap="rectangular">
                <FontAwesomeIcon icon={faFacebookMessenger} />
            </Badge>
        </IconButton>
    );
};

export default MessengerMenu;
