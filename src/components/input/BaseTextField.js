import React from "react"
import TextField from "@mui/material/TextField"
import { _TemplateVariant, EVariant, _ControlSizeDefault } from "configs"

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
        fullWidth = true,
        style,
        onClick,
        variant,
        value,
        inputRef
    } = props
    return (
        <TextField
            inputRef={inputRef}
            variant={variant || EVariant.outlined}
            fullWidth={fullWidth || false}
            name={name}
            style={style}
            disabled={disabled ? disabled : false}
            size={size ? size : _ControlSizeDefault}
            type={type || "text"}
            InputProps={inputProps}
            required={required}
            error={!!error}
            value={value}
            helperText={error?.message}
            label={_TemplateVariant === EVariant.outlined ? label : ''}
            autoComplete="new-password"
            hidden={hidden ? true : false}
            onChange={onChange}
            onClick={onClick}
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