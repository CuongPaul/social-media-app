import React from "react";
import Badge from "@material-ui/core/Badge";
import { withStyles } from "@material-ui/core/styles";

const UIBadge = withStyles((theme) => ({
    badge: {
        right: 8,
        top: 32,
        padding: "5px 5px",
        borderRadius: "100%",
        border: `2px solid ${theme.palette.background.paper}`,
    },
}))(Badge);

const StyledBadge = ({ isActive, children, border }) => {
    return (
        <UIBadge
            variant="dot"
            color={isActive ? "secondary" : "error"}
            style={{ border: border, borderRadius: "100%", padding: "4px" }}
        >
            {children}
        </UIBadge>
    );
};

export default StyledBadge;
