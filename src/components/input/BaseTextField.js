import React from "react";
import TextField from "@mui/material/TextField";


const BaseTextField = (props) => {
    const {
        required,
        label,
        name,
        autoFocus,
        hidden,
        inputProps,
        type,
        onChange,
        error,
        size,
        disabled,
        value,
    } = props
    return (
        <TextField
            fullWidth
            name={name}
            disabled={disabled ? disabled : false}
            size={size ? size : "medium"}
            type={type || "text"}
            inputProps={inputProps}
            // value={value || ""}
            required={required}
            error={!!error}
            helperText={error?.message}
            label={label}
            autoComplete="new-password"
            hidden={hidden ? true : false}
            onChange={onChange}
            autoFocus={autoFocus}
        />
    );
}

export default BaseTextField;