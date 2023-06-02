import React from "react";
import { makeStyles, InputBase } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    search: {
        width: "100%",
        marginLeft: "8px",
        position: "relative",
        borderRadius: "50px 50px 50px 50px",
        backgroundColor: "#F0F2F5",
    },
    searchIcon: {
        right: "0px",
        height: "100%",
        display: "flex",
        color: "#606770;",
        cursor: "pointer",
        marginLeft: "16px",
        position: "absolute",
        alignItems: "center",
        justifyContent: "center",
        padding: theme.spacing(0, 2),
    },
    inputRoot: {
        width: "70%",
        color: "black",
    },
    inputInput: {
        flexGrow: 1,
        width: "100%",
        paddingLeft: "8px",
    },
}));

const Search = ({ placeholder, children }) => {
    const classes = useStyles();

    return (
        <div className={classes.search}>
            <div className={classes.searchIcon}>{children}</div>
            <InputBase
                placeholder={placeholder}
                classes={{
                    root: classes.inputRoot,
                    input: classes.inputInput,
                }}
                inputProps={{ "aria-label": "search" }}
            />
        </div>
    );
};

export default Search;
