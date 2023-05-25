import React from "react";
import { Avatar, Typography } from "@material-ui/core";

import generateColor from "../../utils/generate-color";

const AvatarIcon = ({ variant, imageUrl, text = "?", size = "40px", fontSize = "16px" }) => {
    console.log({ text, imageUrl });
    return (
        <Avatar
            alt={text}
            variant={imageUrl ? variant : "circular"}
            style={{
                backgroundColor: generateColor(text),
                width: variant === "square" && imageUrl ? "100%" : size,
                height: variant === "square" && imageUrl ? "100%" : size,
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
