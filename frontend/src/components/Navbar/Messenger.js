import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { Badge, IconButton } from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebookMessenger } from "@fortawesome/free-brands-svg-icons";

import { UIContext } from "../../App";

const Messenger = () => {
    const {
        uiState: { darkMode },
    } = useContext(UIContext);

    return (
        <IconButton
            to="/messenger"
            component={NavLink}
            style={{
                marginLeft: "16px",
                color: darkMode ? "rgb(227,229,233)" : "rgb(5,5,5)",
                backgroundColor: darkMode ? "rgb(58,59,60)" : "rgb(226,228,232)",
            }}
            activeStyle={{
                color: "rgb(24,118,242)",
                backgroundColor: darkMode ? "rgb(38,57,81)" : "rgb(230,242,254)",
            }}
        >
            <Badge max={9} color="error" badgeContent={8} overlap="rectangular">
                <FontAwesomeIcon icon={faFacebookMessenger} />
            </Badge>
        </IconButton>
    );
};

export default Messenger;
