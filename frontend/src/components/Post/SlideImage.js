import React, { Fragment } from "react";
import { CardMedia } from "@material-ui/core";
import { Slide } from "react-slideshow-image";
import "react-slideshow-image/dist/styles.css";

const SlideImage = ({ images }) => {
    const isMultipleImage = images.length > 1;

    return (
        <Fragment>
            <Slide
                duration={5000}
                indicators={true}
                arrows={isMultipleImage}
                transitionDuration={500}
                infinite={isMultipleImage}
            >
                {images.map((item, index) => (
                    <CardMedia
                        controls
                        key={index}
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
