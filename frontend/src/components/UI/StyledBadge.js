import React from "react";
import { Badge } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

const BadgeWithStyles = withStyles((theme) => ({
    badge: {
        top: "32px",
        right: "8px",
        padding: "5px 5px",
        borderRadius: "100%",
        border: `2px solid ${theme.palette.background.paper}`,
    },
}))(Badge);

const StyledBadge = ({ max, border, children, isActive, badgeContent }) => {
    return (
        <BadgeWithStyles
            max={max}
            overlap="rectangular"
            badgeContent={badgeContent ? badgeContent : ""}
            color={isActive ? "secondary" : "error"}
            style={{ border, padding: "4px", borderRadius: "100%" }}
        >
            {children}
        </BadgeWithStyles>
    );
};

export default StyledBadge;
