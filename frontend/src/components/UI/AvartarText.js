import React from "react";
import { Avatar, Typography } from "@material-ui/core";

const AvartarText = ({ text, background, size = "40px", fontSize = "16px" }) => {
    return (
        <Avatar style={{ background, width: size, height: size, color: "#fff" }}>
            <Typography style={{ fontSize, color: "#fff", fontWeight: "800" }}>TA</Typography>
        </Avatar>
    );
};

export default AvartarText;
