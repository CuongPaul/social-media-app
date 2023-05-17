import {
    Button,
    Dialog,
    Tooltip,
    TextField,
    CardHeader,
    IconButton,
    Typography,
    DialogContent,
    InputAdornment,
} from "@material-ui/core";
import { ArrowBack } from "@material-ui/icons";
import React, { useState, Fragment } from "react";
import { faSmile } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Emoji from "../../Emoji";

const Feelings = ({ feelings, setFeelings }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Fragment>
            <Tooltip arrow placement="bottom" title="Share feelings with post">
                <IconButton onClick={() => setIsOpen(true)}>
                    <FontAwesomeIcon icon={faSmile} color="rgb(250,199,94)" />
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
                            Express your feelings
                        </Typography>
                    }
                />
                <DialogContent style={{ display: "flex", marginBottom: "32px" }}>
                    <TextField
                        label="Feelings"
                        value={feelings}
                        variant="outlined"
                        placeholder="Enter feelings"
                        onChange={(e) => setFeelings(e.target.value)}
                        style={{ flex: 4, width: "100%", marginRight: "16px" }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <Emoji setText={setFeelings} />
                                </InputAdornment>
                            ),
                        }}
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

export default Feelings;
