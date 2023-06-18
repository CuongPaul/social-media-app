import {
    Grid,
    Button,
    Dialog,
    Divider,
    TextField,
    Typography,
    DialogTitle,
    DialogActions,
    DialogContent,
} from "@material-ui/core";
import React, { useState, Fragment, useContext } from "react";

import { useUser } from "../../hooks";
import { LoadingIcon } from "../common";
import { UserContext } from "../../App";

const General = () => {
    const {
        userState: { currentUser },
    } = useContext(UserContext);

    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [fieldSelected, setFieldSelected] = useState("");

    const { isLoading, handleUpdateProfile } = useUser();

    const handleClickUpdate = () => {
        handleUpdateProfile({
            name: fieldSelected === "Name" ? inputValue : currentUser?.name,
            gender: fieldSelected === "Gender" ? inputValue : currentUser?.gender,
            hometown: fieldSelected === "Hometown" ? inputValue : currentUser?.hometown,
            education: fieldSelected === "Education" ? inputValue : currentUser?.education,
        });
        setIsOpen(false);
    };

    const ItemEdited = ({ value, fieldName }) => {
        return (
            <Grid container spacing={2} alignItems="center" style={{ margin: "8px 0px" }}>
                <Grid item md={3}>
                    <Typography style={{ fontWeight: 800 }}>{fieldName}</Typography>
                </Grid>
                <Grid item sm={7}>
                    <Typography>{value}</Typography>
                </Grid>
                {fieldName !== "Email" && (
                    <Grid item md={2}>
                        <Button
                            color="secondary"
                            variant="contained"
                            onClick={() => {
                                setIsOpen(true);
                                setInputValue(value);
                                setFieldSelected(fieldName);
                            }}
                        >
                            Edit
                        </Button>
                    </Grid>
                )}
            </Grid>
        );
    };

    return (
        <Fragment>
            <Typography style={{ fontWeight: 800, fontSize: "24px", margin: "16px 0px" }}>
                General account setting
            </Typography>
            <Divider />
            <ItemEdited fieldName="Name" value={currentUser?.name} />
            <Divider />
            <ItemEdited fieldName="Email" value={currentUser?.email} />
            <Divider />
            <ItemEdited fieldName="Gender" value={currentUser?.gender} />
            <Divider />
            <ItemEdited fieldName="Hometown" value={currentUser?.hometown} />
            <Divider />
            <ItemEdited fieldName="Education" value={currentUser?.education} />
            <Dialog fullWidth open={isOpen} onClose={() => setIsOpen(false)}>
                <DialogTitle>Update {fieldSelected.toLocaleLowerCase()}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        value={inputValue}
                        variant="outlined"
                        style={{ width: "100%" }}
                        onChange={(e) => setInputValue(e.target.value)}
                    />
                </DialogContent>
                <DialogActions style={{ padding: "20px 24px" }}>
                    <Button
                        variant="outlined"
                        disabled={isLoading}
                        onClick={() => setIsOpen(false)}
                        style={{ color: "rgb(24,127,245)", borderColor: "rgb(24,127,245)" }}
                    >
                        <LoadingIcon text={"Cancel"} isLoading={isLoading} />
                    </Button>
                    <Button
                        variant="contained"
                        disabled={isLoading}
                        onClick={handleClickUpdate}
                        style={{
                            marginLeft: "25px",
                            color: "rgb(255,255,255)",
                            backgroundColor: "rgb(24,127,245)",
                        }}
                    >
                        <LoadingIcon text={"Update"} isLoading={isLoading} />
                    </Button>
                </DialogActions>
            </Dialog>
        </Fragment>
    );
};

export default General;
