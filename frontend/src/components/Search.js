import React, { useContext } from "react";
import { makeStyles, InputBase } from "@material-ui/core";
import { Search as SearchIcon } from "@material-ui/icons";

import { UIContext } from "../App";

const useStyles = makeStyles((theme) => ({
    search: {
        width: "100%",
        position: "relative",
        borderRadius: "50px 50px 50px 50px",
    },
    searchIcon: {
        height: "100%",
        display: "flex",
        alignItems: "center",
        position: "absolute",
        pointerEvents: "none",
        justifyContent: "center",
        padding: theme.spacing(0, 2),
    },
    inputRoot: {
        padding: "3px 10px 3px 0px",
    },
    inputInput: {
        flexGrow: 1,
        paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    },
}));

const Search = ({ placeholder }) => {
    const {
        uiState: { darkMode },
    } = useContext(UIContext);

    const classes = useStyles();

    return (
        <div className={classes.search} style={{ backgroundColor: !darkMode ? "#F0F2F5" : null }}>
            <div className={classes.searchIcon} style={{ color: !darkMode ? "#606770" : null }}>
                <SearchIcon />
            </div>
            <InputBase
                style={{ width: "100%" }}
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
