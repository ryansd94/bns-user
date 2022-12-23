import React from "react"
import TextField from "@mui/material/TextField"
import { Controller } from "react-hook-form"
import { useSelector } from "react-redux"
import Skeleton from "@mui/material/Skeleton"
import { _TemplateVariant, EVariant, _ControlSizeDefault } from "configs"
import { LabelControl } from 'components/label'

export default function TextInput({
  control,
  required,
  label,
  name,
  autoFocus,
  hidden,
  inputProps,
  type,
  size,
  disabled,
  variant,
  fullWidth,
  multiline,
  defaultValue,
  placeholder,
  focused,
  onChange,
}) {
  const loadingPopup = useSelector((state) => state.master.loadingPopup)
  return (
    <Controller
      render={({ field, fieldState: { error } }) =>
        loadingPopup ? (
          <Skeleton width={"100%"}
            size={size ? size : _ControlSizeDefault} variant="text">
            <TextField
              {...field}
              fullWidth={fullWidth || true}
              type={type || "text"}
              inputProps={inputProps}
              required={required}
              variant={variant || EVariant.outlined}
              error={!!error}
              name={name}
              value={field.value || defaultValue || ''}
              multiline={multiline}
              rows={multiline ? 2 : 1}
              maxRows={multiline ? 4 : 1}
              size={size ? size : _ControlSizeDefault}
              helperText={error?.message}
              label={_TemplateVariant === EVariant.outlined ? label : ''}
              disabled={disabled ? disabled : false}
              autoComplete="new-password"
              hidden={hidden ? true : false}
              onChange={(e) => {
                field.onChange(e.target.value)
              }}
              autoFocus={focused}
            />
          </Skeleton>
        ) : (
          <div className="containerControl">
            {_TemplateVariant === EVariant.normal ? (label ? <LabelControl required={required} label={label} /> : '') : ''}
            <TextField
              {...field}
              fullWidth={fullWidth || true}
              type={type || "text"}
              inputProps={inputProps}
              required={required}
              variant={variant || EVariant.outlined}
              error={!!error}
              name={name}
              focused={focused}
              placeholder={placeholder}
              value={field.value || defaultValue || ''}
              multiline={multiline}
              rows={multiline ? 2 : 1}
              maxRows={multiline ? 4 : 1}
              size={size ? size : _ControlSizeDefault}
              helperText={error?.message}
              label={_TemplateVariant === EVariant.outlined ? label : ''}
              disabled={disabled ? disabled : false}
              autoComplete="new-password"
              hidden={hidden ? true : false}
              onChange={(e) => {
                field.onChange(e.target.value)
                onChange && onChange(e.target.value)
              }}
              autoFocus={autoFocus}
            />
          </div>
        )
      }
      name={name}
      control={control && control}
    />
  )
}
