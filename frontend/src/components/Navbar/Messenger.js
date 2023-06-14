import { NavLink } from "react-router-dom";
import React, { useMemo, useContext } from "react";
import { Badge, IconButton } from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebookMessenger } from "@fortawesome/free-brands-svg-icons";

import { UIContext, ChatContext } from "../../App";

const Messenger = () => {
    const {
        uiState: { darkMode },
    } = useContext(UIContext);
    const {
        chatState: { chatRooms },
    } = useContext(ChatContext);

    const numberOfUnsendMessage = useMemo(
        () => chatRooms.filter((item) => item.unseen_message).length,
        [chatRooms]
    );

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
            <Badge max={9} color="error" overlap="rectangular" badgeContent={numberOfUnsendMessage}>
                <FontAwesomeIcon icon={faFacebookMessenger} />
            </Badge>
        </IconButton>
    );
};

export default Messenger;
