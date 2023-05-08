import React from "react";
import {
    Grid,
    Card,
    Paper,
    Avatar,
    CardMedia,
    IconButton,
    Typography,
    CardContent,
} from "@material-ui/core";

import AvartarText from "./UI/AvartarText";
import { MoreHoriz as MoreHorizIcon } from "@material-ui/icons";

const PeopleYouMayKnow = ({ users }) => {
    return (
        <Paper style={{ marginTop: "20px", padding: "8px" }}>
            <Grid container justifyContent="space-between" alignItems="center">
                <Grid item>
                    <Typography
                        variant="h6"
                        style={{
                            fontWeight: "800",
                            color: "rgb(101,110,119)",
                        }}
                    >
                        People you may know
                    </Typography>
                </Grid>
                <Grid item>
                    <IconButton>
                        <MoreHorizIcon />
                    </IconButton>
                </Grid>
            </Grid>
            <Grid
                container
                justifyContent="flex-start"
                alignItems="center"
                spacing={1}
                style={{ marginTop: "16px" }}
            >
                {users.map((user) => (
                    <Grid item md={4} xs={4} sm={4} key={user.id}>
                        <Card elevation={0}>
                            {user.profile_pic && (
                                <CardMedia
                                    style={{ width: "100%", height: "200px" }}
                                    image={user.profile_pic}
                                    title="Contemplative Reptile"
                                />
                            )}
                            <CardContent>
                                <Typography style={{ fontWeight: "700" }}>{user.name}</Typography>
                                {user.friends && user.friends.length
                                    ? user.friends.map((friend) => (
                                          <div style={{ display: "flex" }} key={friend.id}>
                                              {friend.profile_pic ? (
                                                  <Avatar
                                                      style={{ width: "20px", height: "20px" }}
                                                      alt="Remy Sharp"
                                                      src={friend.profile_pic}
                                                  />
                                              ) : (
                                                  <AvartarText
                                                      backgroundColor={
                                                          user.active ? "seagreen" : "tomato"
                                                      }
                                                      text={friend?.name}
                                                      size="20px"
                                                  />
                                              )}

                                              <Typography
                                                  style={{
                                                      marginLeft: "10px",
                                                      color: "rgb(101,110,119)",
                                                  }}
                                              >
                                                  {user.friends.length} friends
                                              </Typography>
                                          </div>
                                      ))
                                    : null}
                            </CardContent>
                            <div style={{ padding: "10px" }}></div>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Paper>
    );
};

export default PeopleYouMayKnow;
