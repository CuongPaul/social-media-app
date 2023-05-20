import React from "react";
import { Avatar, Typography } from "@material-ui/core";

import generateColor from "../../utils/generate-color";

const AvatarIcon = ({ text = "?", size = "40px", variant, imageUrl, fontSize = "16px" }) => {
    return (
        <Avatar
            variant={imageUrl && variant}
            style={{
                backgroundColor: generateColor(text),
                width: variant === "square" && imageUrl ? "100%" : size,
                height: variant === "square" && imageUrl ? "100%" : size,
            }}
        >
            {imageUrl ? (
                <img alt={text} width="100%" height="100%" src={imageUrl} />
            ) : (
                <Typography style={{ fontSize, color: "#fff", fontWeight: 800 }}>
                    {text[0]}
                </Typography>
            )}
        </Avatar>
    );
};

export default AvatarIcon;
