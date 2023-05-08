import React, { Fragment } from "react";
import { CardMedia } from "@material-ui/core";
import { Slide } from "react-slideshow-image";
import "react-slideshow-image/dist/styles.css";

const SlideImage = ({ images }) => {
    return (
        <Fragment>
            <Slide
                arrows={true}
                duration={5000}
                infinite={true}
                indicators={true}
                transitionDuration={500}
            >
                {images.map((item) => (
                    <CardMedia
                        controls
                        image={item}
                        style={{ width: "100%", maxHeight: "500px", objectFit: "fill" }}
                        component={
                            item.split(".").pop().substring(0, 3) === "mp4" ? "video" : "img"
                        }
                    />
                ))}
            </Slide>
        </Fragment>
    );
};

export default SlideImage;
