import React from "react";
import { Avatar, Typography } from "@material-ui/core";

import generateColor from "../../utils/generate-color";

const AvatarIcon = ({ variant, imageUrl, text = "?", size = "40px", fontSize = "16px" }) => {
    return (
        <Avatar
            alt={text}
            variant={imageUrl ? variant : "circular"}
            style={{
                backgroundColor: generateColor(text),
                width: variant === "square" && imageUrl ? "100%" : size,
                height: variant === "square" && imageUrl ? "100%" : size,
                border: `${parseInt(size.slice(0, -2)) / 34}px solid rgb(255 255 255)`,
            }}
        >
            {imageUrl ? (
                <img width="100%" height="100%" src={imageUrl} />
            ) : (
                <Typography style={{ fontSize, color: "#fff", fontWeight: 800 }}>
                    {text[0]}
                </Typography>
            )}
        </Avatar>
    );
};

export default AvatarIcon;
