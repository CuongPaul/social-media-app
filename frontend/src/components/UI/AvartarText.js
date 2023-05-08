import React from "react";
import { Avatar, Typography } from "@material-ui/core";

const AvartarText = ({ text = "?", size = "40px", backgroundColor, fontSize = "16px" }) => {
    return (
        <Avatar style={{ width: size, height: size, backgroundColor }}>
            <Typography style={{ fontSize, color: "#fff", fontWeight: "800" }}>
                {text[0]}
            </Typography>
        </Avatar>
    );
};

export default AvartarText;
