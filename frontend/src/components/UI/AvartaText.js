import React from "react";
import { Avatar, Typography } from "@material-ui/core";

import generateColor from "../../utils/generate-color";

const AvartaText = ({ text = "?", size = "40px", fontSize = "16px" }) => {
    return (
        <Avatar style={{ width: size, height: size, backgroundColor: generateColor(text) }}>
            <Typography style={{ fontSize, color: "#fff", fontWeight: "800" }}>
                {text[0]}
            </Typography>
        </Avatar>
    );
};

export default AvartaText;
