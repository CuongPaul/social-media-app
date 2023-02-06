import React from "react";
import { Close } from "@material-ui/icons";
import { Avatar, CardMedia, IconButton } from "@material-ui/core";

const PreviewImage = ({ previewImage, removeFileImage }) => {
    return (
        <>
            <CardMedia
                image={previewImage}
                style={{ width: "100", height: "240px" }}
                component={
                    previewImage.substring(0, previewImage.indexOf("/")) === "data:image"
                        ? "img"
                        : "video"
                }
                controls
            />
            <div
                style={{
                    display: "flex",
                    marginTop: "16px",
                    marginBottom: "16px",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <IconButton onClick={removeFileImage} size="medium">
                    <Avatar style={{ background: "tomato", color: "white" }}>
                        <Close />
                    </Avatar>
                </IconButton>
            </div>
        </>
    );
};

export default PreviewImage;
