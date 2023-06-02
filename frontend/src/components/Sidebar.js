import React, { useContext } from "react";
import { Drawer } from "@material-ui/core";

import { UIContext } from "../App";

const Sidebar = ({ children, anchor = "left", width = "300px" }) => {
    const { uiState } = useContext(UIContext);

    return (
        <Drawer
            anchor={anchor}
            variant="permanent"
            PaperProps={{
                style: {
                    width,
                    border: "none",
                    marginTop: "75px",
                    backgroundColor: uiState.darkMode ? "rgb(24,25,26)" : "rgb(244,245,246)",
                },
            }}
        >
            <div style={{ overflow: "auto" }}>{children}</div>
        </Drawer>
    );
};

export default Sidebar;
