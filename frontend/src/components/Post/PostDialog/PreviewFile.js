import React from "react";
import { Close } from "@material-ui/icons";
import { Avatar, CardMedia, IconButton } from "@material-ui/core";

const PreviewFile = ({ filePreview, handleRemoveFile }) => {
    const typeFile = filePreview.slice(0, 10);

    let component = "video";
    if (typeFile == "data:image") component = "img";
    if (typeFile == "blob:http:") component = "blob";

    return (
        <div style={{ position: "relative", marginBottom: "25px" }}>
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
                <IconButton onClick={handleRemoveFile} size="medium">
                    <Avatar style={{ background: "tomato", color: "white" }}>
                        <Close />
                    </Avatar>
                </IconButton>
            </div>
        </div>
    );
};

export default PreviewFile;
