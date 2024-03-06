import React from "react";
import { Box } from "@material-ui/core";

const TabPanel = (props) => {
  const { id, index, children, ...options } = props;

  return (
    <div hidden={index !== id} {...options}>
      {index === id && <Box p={3}>{children}</Box>}
    </div>
  );
};

export default TabPanel;
