import React from "react";
import { Avatar, Typography } from "@material-ui/core";

import generateColor from "../../utils/generate-color";

const AvatarIcon = ({
  style,
  onClick,
  variant,
  imageUrl,
  text = "?",
  border = true,
  size = "40px",
  fontSize = "16px",
}) => {
  return (
    <Avatar
      alt={""}
      onClick={onClick}
      variant={imageUrl ? variant : "circular"} // If imageUrl === "" => Text avatar => Avatar shape alaways is circl. On the other hand shape of avatar dependent value of variable variant
      style={{
        ...style,
        backgroundColor: generateColor(text),
        width: variant === "square" && imageUrl ? "100%" : size,
        height: variant === "square" && imageUrl ? "100%" : size,
        border:
          border &&
          `${parseInt(size.slice(0, -2)) / 34}px solid rgb(255 255 255)`,
      }}
    >
      {imageUrl ? (
        <img alt={""} width="100%" height="100%" src={imageUrl} />
      ) : (
        <Typography
          style={{ fontSize, color: "rgb(255,255,255)", fontWeight: 800 }}
        >
          {text[0]}
        </Typography>
      )}
    </Avatar>
  );
};

export default AvatarIcon;
