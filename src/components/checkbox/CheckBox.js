import * as React from "react";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

const CheckBox = (props) => {
  const { name, label, checked, onChange, disabled } = props;
  return (
    <FormGroup style={{ width: "100%" }}>
      <FormControlLabel
        control={
          <Checkbox
            disabled={disabled}
            name={name}
            onChange={onChange}
            checked={checked}
          />
        }
        label={label}
      />
    </FormGroup>
  );
};
export default CheckBox;
