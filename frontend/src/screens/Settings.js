import {
  Grid,
  List,
  Paper,
  ListItem,
  Container,
  ListItemIcon,
  ListItemText,
} from "@material-ui/core";
import React, { useState, useContext } from "react";
import { PersonOutline, SecurityOutlined } from "@material-ui/icons";

import { UIContext } from "../App";
import { General, Security } from "../components/Settings";

const Settings = () => {
  const {
    uiState: { darkMode },
  } = useContext(UIContext);

  const [tab, setTab] = useState("general");

  return (
    <Container
      style={{
        display: "flex",
        marginTop: "64px",
        alignItems: "center",
        minHeight: `calc(100vh - 64px)`,
      }}
    >
      <Grid container spacing={2} style={{ minHeight: "75vh" }}>
        <Grid item md={4}>
          <Paper
            style={{ height: "100%", padding: "16px", borderRadius: "10px" }}
          >
            <List>
              <ListItem
                button
                onClick={() => setTab("general")}
                style={{
                  height: "50px",
                  borderRadius: "10px",
                  backgroundColor:
                    tab === "general"
                      ? darkMode
                        ? "rgb(76,76,76)"
                        : "rgb(235,237,240)"
                      : null,
                }}
              >
                <ListItemIcon>
                  <PersonOutline />
                </ListItemIcon>
                <ListItemText primary="General" />
              </ListItem>
              <ListItem
                button
                style={{
                  height: "50px",
                  marginTop: "10px",
                  borderRadius: "10px",
                  backgroundColor:
                    tab === "security"
                      ? darkMode
                        ? "rgb(76,76,76)"
                        : "rgb(235,237,240)"
                      : null,
                }}
                onClick={() => setTab("security")}
              >
                <ListItemIcon>
                  <SecurityOutlined />
                </ListItemIcon>
                <ListItemText primary="Security" />
              </ListItem>
            </List>
          </Paper>
        </Grid>
        <Grid item md={8}>
          <Paper
            style={{
              height: "100%",
              padding: "16px 48px",
              borderRadius: "10px",
            }}
          >
            {tab === "general" && <General />}
            {tab === "security" && <Security />}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Settings;
