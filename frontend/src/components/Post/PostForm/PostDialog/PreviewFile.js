import React, { Fragment } from "react";
import { Close } from "@material-ui/icons";
import { Avatar, CardMedia, IconButton } from "@material-ui/core";

const PreviewFile = ({ filePreview, handleRemoveFile }) => {
    const typeFile = filePreview.slice(0, 10);
    const component =
        typeFile === "data:image" ? "img" : typeFile === "data:video" ? "video" : undefined;

    return (
        <Fragment>
            {component ? (
                <CardMedia
                    controls
                    image={filePreview}
                    component={component}
                    style={{ width: "100%", height: "240px" }}
                />
            ) : (
                <img
                    alt="File upload"
                    src={filePreview}
                    style={{ width: "100%", height: "100%" }}
                />
            )}
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
                <IconButton onClick={handleRemoveFile} size="medium">
                    <Avatar style={{ background: "tomato", color: "white" }}>
                        <Close />
                    </Avatar>
                </IconButton>
            </div>
        </Fragment>
    );
};

export default PreviewFile;
