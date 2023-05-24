import React from "react";
import { Close } from "@material-ui/icons";
import { Avatar, CardMedia, IconButton } from "@material-ui/core";

const PreviewFile = ({ filePreview, handleRemoveFile }) => {
    const fileType = filePreview.slice(0, 10);

    let component = "video";
    if (fileType === "data:image") component = "img";
    if (fileType === "blob:http:") component = "blob";

    if (filePreview.includes("https://firebasestorage.googleapis.com")) {
        const beforeString = filePreview.substring(0, filePreview.indexOf("?alt=media&token="));

        const fileTypeUpload = beforeString.substring(beforeString.lastIndexOf(".") + 1);

        if (fileTypeUpload !== "mp4") component = "img";
    }

    return (
        <div style={{ position: "relative", margin: "20px 0px" }}>
            {component == "blob" ? (
                <img
                    alt="File upload"
                    src={filePreview}
                    style={{ width: "100%", height: "100%" }}
                />
            ) : (
                <CardMedia
                    controls
                    image={filePreview}
                    component={component}
                    style={{ width: "100%", height: "240px" }}
                />
            )}
            <div
                style={{
                    top: "-24px",
                    right: "-24px",
                    position: "absolute",
                }}
            >
                <IconButton size="medium" onClick={handleRemoveFile}>
                    <Avatar style={{ background: "tomato", color: "white" }}>
                        <Close />
                    </Avatar>
                </IconButton>
            </div>
        </div>
    );
};

export default PreviewFile;
