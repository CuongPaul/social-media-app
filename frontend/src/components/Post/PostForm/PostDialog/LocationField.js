import {
    Grid,
    Button,
    Dialog,
    Tooltip,
    TextField,
    Container,
    IconButton,
    Typography,
    CardHeader,
    DialogContent,
} from "@material-ui/core";
import React, { useState } from "react";
import { ArrowBack } from "@material-ui/icons";
import { faMap } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const LocationField = ({ body, setBody }) => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Tooltip title="Add your location" arrow placement="bottom">
                <IconButton onClick={() => setOpen(true)}>
                    <FontAwesomeIcon icon={faMap} color="rgb(250,199,94)" />
                </IconButton>
            </Tooltip>

            <Dialog
                disableEscapeKeyDown
                fullWidth
                scroll="body"
                maxWidth="sm"
                open={open}
                onClose={() => setOpen(false)}
                style={{ width: "100%" }}
            >
                <CardHeader
                    avatar={
                        <IconButton onClick={() => setOpen(false)}>
                            <ArrowBack />
                        </IconButton>
                    }
                    subheader={
                        <Typography style={{ fontWeight: "800", fontSize: "20px" }}>
                            Add your Places
                        </Typography>
                    }
                />

                <DialogContent>
                    <Container>
                        <Grid container alignItems="center" justifyContent="center">
                            <Grid item xs={12} sm={10} md={8}>
                                <TextField
                                    label="Add Location"
                                    variant="outlined"
                                    value={body.at}
                                    onChange={(e) => setBody({ ...body, location: e.target.value })}
                                    style={{ width: "100%" }}
                                />
                                <Button
                                    onClick={() => setOpen(false)}
                                    variant="contained"
                                    color="primary"
                                    style={{
                                        width: "100%",
                                        marginTop: "16px",
                                        marginBottom: "16px",
                                    }}
                                >
                                    Add Location
                                </Button>
                            </Grid>
                        </Grid>
                    </Container>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default LocationField;
