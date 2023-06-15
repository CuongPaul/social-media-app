import React, { Fragment } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers, faMapMarkerAlt, faUserGraduate } from "@fortawesome/free-solid-svg-icons";
import { Card, Chip, Grid, Avatar, CardHeader, Typography, CardActions } from "@material-ui/core";

import StyledBadge from "../UI/StyledBadge";
import AvatarIcon from "../UI/AvatarIcon";

const Subheader = ({ user }) => {
    return (
        <Fragment>
            {user.hometown && (
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item md={4}>
                        <Avatar
                            style={{
                                color: "black",
                                fontWeight: "800",
                                backgroundColor: "rgb(240,242,245)",
                            }}
                        >
                            <FontAwesomeIcon icon={faMapMarkerAlt} />
                        </Avatar>
                    </Grid>
                    <Grid item md={8}>
                        <Typography>{user.hometown}</Typography>
                    </Grid>
                </Grid>
            )}
            {user.education && (
                <Grid
                    container
                    alignItems="center"
                    justifyContent="space-between"
                    style={{ marginTop: "4px" }}
                >
                    <Grid item md={4}>
                        <Avatar
                            style={{
                                color: "black",
                                fontWeight: "800",
                                backgroundColor: "rgb(240,242,245)",
                            }}
                        >
                            <FontAwesomeIcon icon={faUserGraduate} />
                        </Avatar>
                    </Grid>
                    <Grid item md={8}>
                        <Typography style={{ fontSize: "14px" }} variant="body2">
                            {user.education}
                        </Typography>
                    </Grid>
                </Grid>
            )}
        </Fragment>
    );
};
const AvartarCardHeader = ({ user }) => {
    return user.avatar_image ? (
        <StyledBadge
            isActive={user.is_active}
            border={`3px solid ${user.is_active ? "green" : "red"}`}
        >
            <Avatar alt={""} src={user.avatar_image} style={{ width: "70px", height: "70px" }} />
        </StyledBadge>
    ) : (
        <StyledBadge
            isActive={user.is_active}
            border={`3px solid ${user.is_active ? "green" : "red"}`}
        >
            <AvatarIcon size="70px" text={user?.name} />
        </StyledBadge>
    );
};

const PopoverProfileCard = ({ user }) => {
    return (
        <Card elevation={0} style={{ maxWidth: "400px" }}>
            <CardHeader
                subheader={<Subheader user={user} />}
                avatar={<AvartarCardHeader user={user} />}
                title={
                    <Typography
                        style={{ fontSize: "16px", fontWeight: "800", marginBottom: "8px" }}
                    >
                        {user.name}
                    </Typography>
                }
            />
            <CardActions>
                <Grid container alignItems="center" justifyContent="space-evenly">
                    <Chip
                        size="medium"
                        color="primary"
                        label={`Friends ${user?.friends?.length}`}
                        icon={<FontAwesomeIcon icon={faUsers} />}
                    />
                </Grid>
            </CardActions>
        </Card>
    );
};

export default PopoverProfileCard;
