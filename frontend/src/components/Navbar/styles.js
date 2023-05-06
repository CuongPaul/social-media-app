import { makeStyles } from "@material-ui/core";

export default makeStyles((theme) => ({
    leftMenu: {
        flexGrow: 1,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
    },

    logoImg: {
        width: theme.spacing(7),
        height: theme.spacing(7),
    },

    middleMenu: {
        flexGrow: 5,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },

    rightMenu: {
        flexGrow: 2,
        display: "flex",
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "flex-end",
    },

    root: {
        flexGrow: 1,
        zIndex: theme.zIndex.drawer + 1,
    },

    profile_chip: {
        paddingTop: "16px",
        paddingBottom: "16px",
        "&:hover": { cursor: "pointer" },
    },

    activeBtn: {
        borderRadius: "0px",
        background: "transparent",
        borderBottom: "4px solid #3578E5",
    },

    buttonItemMiddle: {
        width: "auto",
        height: "auto",
        padding: "10px 50px 10px 50px",
        borderRadius: "10px 10px 10px 10px",
    },
}));
