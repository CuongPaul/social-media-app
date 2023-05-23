import { makeStyles } from "@material-ui/core";

export default makeStyles((theme) => ({
    leftMenu: {
        flexGrow: 1,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
    },

    middleMenu: {
        flexGrow: 5,
        display: "flex",
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
        borderBottom: "4px solid #3578E5",
    },

    buttonItemMiddle: {
        padding: "10px 50px 10px 50px",
    },
}));
