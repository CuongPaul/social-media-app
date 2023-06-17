import React from "react";
import { CircularProgress } from "@material-ui/core";

const LoadingIcon = ({ text, isLoading }) => {
    return isLoading ? (
        <CircularProgress size={25} variant="indeterminate" style={{ color: "rgb(255,255,255)" }} />
    ) : (
        text
    );
};

export default LoadingIcon;
