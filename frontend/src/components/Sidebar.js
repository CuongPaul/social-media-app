import React, { useContext } from "react";
import { Drawer, Toolbar, useTheme, useMediaQuery } from "@material-ui/core";

import { UIContext } from "../App";

const Sidebar = ({
    children,
    anchor = "left",
    boxShadow = true,
    drawerWidth = 380,
    background = "white",
}) => {
    const { uiState } = useContext(UIContext);

    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.between(960, 1400));

    return (
        <Drawer
            elevation={0}
            variant="permanent"
            PaperProps={{
                style: {
                    border: "none",
                    backgroundColor: background,
                    boxShadow: boxShadow
                        ? uiState.darkMode
                            ? "1px 1px 3px rgb(36,37,38)"
                            : "1px 1px 3px rgba(0,0,0,0.1)"
                        : null,
                    width: matches ? drawerWidth - 120 : drawerWidth,
                },
            }}
            anchor={anchor}
        >
            <Toolbar />
            <div style={{ overflow: "auto" }}>{children}</div>
        </Drawer>
    );
};

export default Sidebar;
