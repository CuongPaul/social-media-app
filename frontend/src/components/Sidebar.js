import React, { useContext } from "react";
import { Drawer, Toolbar, useTheme, useMediaQuery } from "@material-ui/core";

import { UIContext } from "../App";

const Sidebar = ({
    children,
    width = 350,
    anchor = "left",
    boxShadow = true,
    backgroundColor = "#fff",
}) => {
    const { uiState } = useContext(UIContext);

    const { breakpoints } = useTheme();
    const matches = useMediaQuery(breakpoints.between(960, 1400));

    return (
        <Drawer
            elevation={0}
            anchor={anchor}
            variant="permanent"
            PaperProps={{
                style: {
                    border: "none",
                    backgroundColor: backgroundColor,
                    width: matches ? width - 120 : width,
                    boxShadow: boxShadow
                        ? uiState.darkMode
                            ? "1px 1px 3px rgb(36,37,38)"
                            : "1px 1px 3px rgba(0,0,0,0.1)"
                        : null,
                },
            }}
        >
            <Toolbar />
            <div style={{ overflow: "auto" }}>{children}</div>
        </Drawer>
    );
};

export default Sidebar;
