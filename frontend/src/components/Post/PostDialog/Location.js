import {
    Button,
    Dialog,
    Tooltip,
    TextField,
    CardHeader,
    IconButton,
    Typography,
    DialogContent,
} from "@material-ui/core";
import { ArrowBack } from "@material-ui/icons";
import React, { useState, Fragment } from "react";
import { faMap } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Location = ({ location, setLocation }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Fragment>
            <Tooltip arrow placement="bottom" title="Add your location">
                <IconButton onClick={() => setIsOpen(true)}>
                    <FontAwesomeIcon icon={faMap} color="rgb(250,199,94)" />
                </IconButton>
            </Tooltip>
            <Dialog
                fullWidth
                open={isOpen}
                style={{ marginTop: "50px" }}
                onClose={() => setIsOpen(false)}
            >
                <CardHeader
                    avatar={
                        <IconButton onClick={() => setIsOpen(false)}>
                            <ArrowBack />
                        </IconButton>
                    }
                    subheader={
                        <Typography style={{ fontWeight: 800, fontSize: "20px" }}>
                            Add your places
                        </Typography>
                    }
                />
                <DialogContent style={{ display: "flex", marginBottom: "32px" }}>
                    <TextField
                        autoFocus
                        label="Location"
                        value={location}
                        variant="outlined"
                        placeholder="Enter location"
                        onChange={(e) => setLocation(e.target.value)}
                        style={{ flex: 4, width: "100%", marginRight: "16px" }}
                        onKeyPress={(e) => e.key === "Enter" && setIsOpen(false)}
                    />
                    <Button
                        color="primary"
                        variant="contained"
                        onClick={() => setIsOpen(false)}
                        style={{ flex: 1, width: "100%", borderRadius: "5px" }}
                    >
                        Add
                    </Button>
                </DialogContent>
            </Dialog>
        </Fragment>
    );
};

export default Location;
