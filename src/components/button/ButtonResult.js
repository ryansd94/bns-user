import React from "react";
import Button from "@mui/material/Button";

export default ({ data, reset, defaultValues }) => (
  <>
    <Button
      className="button buttonBlack"
      type="button"
      onClick={() => {
        reset(defaultValues);
      }}
    >
      Reset Form
    </Button>
    <Button className="button">submit</Button>
  </>
);
