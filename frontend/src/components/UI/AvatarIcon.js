import React from "react";
import { Avatar, Typography } from "@material-ui/core";

import generateColor from "../../utils/generate-color";

const AvatarIcon = ({ text = "?", size = "40px", imageUrl, fontSize = "16px" }) => {
    return (
        <Avatar style={{ width: size, height: size, backgroundColor: generateColor(text) }}>
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
