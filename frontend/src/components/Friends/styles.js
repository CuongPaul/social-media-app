const { makeStyles } = require("@material-ui/core");

const drawerWidth = 380;

export default makeStyles(() => ({
    drawerContainer: {
        overflow: "auto",
    },
    drawer: {
        flexShrink: 0,
        width: drawerWidth,
    },
    drawerPaper: {
        width: drawerWidth,
        backgroundColor: "white",
        boxShadow: "1px 1px 3px rgba(0,0,0,0.1)",
    },
}));
