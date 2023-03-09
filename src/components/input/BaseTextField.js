import React from "react"
import TextField from "@mui/material/TextField"
import { _ControlSizeDefault } from "configs"

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
        fullWidth = true,
        style
    } = props
    return (
        <TextField
            fullWidth={fullWidth || false}
            name={name}
            style={style}
            disabled={disabled ? disabled : false}
            size={size ? size : _ControlSizeDefault}
            type={type || "text"}
            inputProps={inputProps}
            required={required}
            error={!!error}
            helperText={error?.message}
            label={label}
            autoComplete="new-password"
            hidden={hidden ? true : false}
            onChange={onChange}
            sx={{
                "& .MuiInputBase-input": {
                    overflow: "hidden",
                    textOverflow: "ellipsis"
                }
            }}
            autoFocus={autoFocus}
        />
    )
}

export default BaseTextField