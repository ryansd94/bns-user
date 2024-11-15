﻿import React from "react";
import TextField from "@mui/material/TextField";
import { Controller } from "react-hook-form";
import { useSelector } from "react-redux";
import Skeleton from "@mui/material/Skeleton";
import { _TemplateVariant, EVariant, _ControlSizeDefault } from "configs";
import { LabelControl } from "components/label";
import Grid from "@mui/material/Grid";
import _ from "lodash";

export default function TextInput({
  control,
  required,
  label,
  name,
  autoFocus,
  hidden,
  inputProps,
  type = "text",
  size,
  disabled,
  variant,
  fullWidth = true,
  multiline,
  defaultValue,
  placeholder,
  focused,
  onChange,
  style,
  className = "containerControl",
  isFormArray = false,
}) {
  const loadingPopup = useSelector((state) => state.master.loadingPopup);

  const renderElement = (field, error) => {
    return (
      <TextField
        {...field}
        fullWidth={fullWidth || false}
        type={type || "text"}
        InputProps={inputProps}
        required={required}
        variant={variant || EVariant.outlined}
        error={!!error}
        name={name}
        style={style}
        focused={focused}
        placeholder={placeholder}
        value={field.value || defaultValue || ""}
        multiline={multiline}
        rows={multiline ? 2 : 1}
        maxRows={multiline ? 4 : 1}
        size={size ? size : _ControlSizeDefault}
        helperText={isFormArray === true ? "" : error?.message}
        label={_TemplateVariant === EVariant.outlined ? label : ""}
        disabled={disabled ? disabled : false}
        autoComplete="new-password"
        hidden={hidden ? true : false}
        onChange={(e) => {
          let valueChange = e.target.value;
          if (type === "number") {
            if (!_.isEmpty(valueChange)) {
              valueChange = parseFloat(valueChange);
            } else {
              valueChange = null;
            }
          }
          onChange && onChange({ value: valueChange, name });
          field.onChange(valueChange);
        }}
        sx={{
          "& .MuiInputBase-input": {
            overflow: "hidden",
            textOverflow: "ellipsis",
          },
        }}
        autoFocus={autoFocus}
      />
    );
  };

  return (
    <Controller
      render={({ field, fieldState: { error } }) =>
        loadingPopup ? (
          <>
            {_TemplateVariant === EVariant.normal ? (
              label ? (
                <LabelControl required={required} label={label} />
              ) : (
                ""
              )
            ) : (
              ""
            )}
            <Skeleton width={"100%"} variant="text" height={"40px"}>
              {renderElement(field, error)}
            </Skeleton>
          </>
        ) : (
          <div className={className}>
            {_TemplateVariant === EVariant.normal ? (
              label ? (
                <LabelControl required={required} label={label} />
              ) : (
                ""
              )
            ) : (
              ""
            )}
            {renderElement(field, error)}
          </div>
        )
      }
      name={name}
      control={control && control}
    />
  );
}
