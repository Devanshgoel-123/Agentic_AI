import React from "react";
import "./styles.scss";

import Box from "@mui/material/Box";
import GradientText from "@/components/common/GradientText";

const EddyV3Label = () => {
  return (
    <Box className="LabelContainer">
      <GradientText text="via EDDYV3" />
    </Box>
  );
};

export default EddyV3Label;
