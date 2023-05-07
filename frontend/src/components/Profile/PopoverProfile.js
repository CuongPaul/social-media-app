import Popover from "@material-ui/core/Popover";
import React, { Fragment, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";

import PopoverProfileCard from "./PopoverProfileCard";

const useStyles = makeStyles((theme) => ({
    popover: { pointerEvents: "none" },
    paper: { padding: theme.spacing(1) },
}));

const MouseOverPopover = ({ user, children }) => {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = useState(null);

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };

    return (
        <Fragment>
            <div
                aria-haspopup="true"
                onMouseLeave={handlePopoverClose}
                onMouseEnter={(e) => setAnchorEl(e.currentTarget)}
                aria-owns={Boolean(anchorEl) ? "mouse-over-popover" : undefined}
            >
                {children}
            </div>
            <Popover
                anchorEl={anchorEl}
                disableRestoreFocus
                id="mouse-over-popover"
                open={Boolean(anchorEl)}
                className={classes.popover}
                onClose={handlePopoverClose}
                classes={{ paper: classes.paper }}
                anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                transformOrigin={{ vertical: "bottom", horizontal: "right" }}
            >
                <PopoverProfileCard user={user} />
            </Popover>
        </Fragment>
    );
};

export default MouseOverPopover;
