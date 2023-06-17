import {
    Grid,
    List,
    Button,
    Dialog,
    Divider,
    ListItem,
    IconButton,
    Typography,
    DialogTitle,
    ListItemIcon,
    ListItemText,
    DialogContent,
    DialogActions,
    OutlinedInput,
    InputAdornment,
    ListItemSecondaryAction,
} from "@material-ui/core";
import { Lock } from "@material-ui/icons";
import React, { useState, Fragment } from "react";
import { Visibility, VisibilityOff } from "@material-ui/icons";

import { useUser } from "../../hooks";
import LoadingIcon from "../common/LoadingIcon";

const Security = () => {
    const [password, setPassword] = useState({
        newPassword: "",
        currentPassword: "",
        showNewPassword: false,
        showCurrentPassword: false,
    });
    const [isOpen, setIsOpen] = useState(false);

    const { isLoading, handleUpdatePassword } = useUser();

    const handleClickUpdate = () => {
        handleUpdatePassword({
            new_password: password.newPassword,
            current_password: password.currentPassword,
        });
        setIsOpen(false);
    };

    return (
        <Fragment>
            <Typography style={{ fontWeight: 800, fontSize: "24px", margin: "16px 0px" }}>
                Security and signin
            </Typography>
            <Divider />
            <Grid container spacing={2}>
                <List style={{ width: "100%" }}>
                    <ListItem>
                        <ListItemIcon>
                            <Lock />
                        </ListItemIcon>
                        <ListItemText
                            primary={<Typography>Change password</Typography>}
                            secondary={
                                <Typography>
                                    Use a strong password that you're not using elsewhere
                                </Typography>
                            }
                        />
                        <ListItemSecondaryAction>
                            <Button
                                color="primary"
                                variant="contained"
                                onClick={() => setIsOpen(true)}
                            >
                                Edit
                            </Button>
                        </ListItemSecondaryAction>
                    </ListItem>
                </List>
            </Grid>
            <Dialog fullWidth open={isOpen} onClose={() => setIsOpen(false)}>
                <DialogTitle>Update password</DialogTitle>
                <DialogContent>
                    <OutlinedInput
                        style={{ width: "100%" }}
                        placeholder="Current password"
                        value={password.currentPassword}
                        type={password.showCurrentPassword ? "text" : "password"}
                        onChange={(e) =>
                            setPassword({ ...password, currentPassword: e.target.value })
                        }
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    onClick={() =>
                                        setPassword({
                                            ...password,
                                            showCurrentPassword: !password.showCurrentPassword,
                                        })
                                    }
                                >
                                    {password.showCurrentPassword ? (
                                        <Visibility />
                                    ) : (
                                        <VisibilityOff />
                                    )}
                                </IconButton>
                            </InputAdornment>
                        }
                    />
                    <OutlinedInput
                        placeholder="New password"
                        value={password.newPassword}
                        style={{ width: "100%", marginTop: "8px" }}
                        type={password.showNewPassword ? "text" : "password"}
                        onChange={(e) => setPassword({ ...password, newPassword: e.target.value })}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    onClick={() =>
                                        setPassword({
                                            ...password,
                                            showNewPassword: !password.showNewPassword,
                                        })
                                    }
                                >
                                    {password.showNewPassword ? <Visibility /> : <VisibilityOff />}
                                </IconButton>
                            </InputAdornment>
                        }
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

export default Security;
