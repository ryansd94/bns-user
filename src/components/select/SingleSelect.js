import React, { useState, useEffect } from "react"
import Autocomplete from "@mui/material/Autocomplete"
import TextField from "@mui/material/TextField"
import { Controller } from "react-hook-form"
import Skeleton from "@mui/material/Skeleton"
import { useSelector } from "react-redux"
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { ChipControl } from "components/chip"
import { IconCricle } from "components/icon/icon"
import { _TemplateVariant, EVariant, _ControlSizeDefault } from 'configs'
import { LabelControl } from 'components/label'

const SingleSelect = React.memo(
  (props) => {
    const { control, field, required, data = [], label, name, onSelectChange,
      size, disabled, fullWidth, renderOption, renderTags, renderInput, disableClearable = false } = props
    const loadingPopup = useSelector((state) => state.master.loadingPopup)
    return (
      <Controller
        name={name}
        render={({ field: { onChange, value }, fieldState: { error } }) =>
          loadingPopup ? (
            <Skeleton width={"100%"} size={size ? size : "medium"} variant="text">
              <Autocomplete
                {...field}
                options={data}
                size={size ? size : _ControlSizeDefault}
                disabled={disabled}
                fullWidth={fullWidth || false}
                isOptionEqualToValue={(option, value) => option != null && value != null ? option.id === value.id : ""}
                getOptionLabel={(option) => option.name}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    required={required}
                    error={!!error}
                    helperText={error?.message}
                    label={label}
                    variant="outlined"
                  />
                )}
                onChange={(event, value) => field.onChange(value)}
              />
            </Skeleton>
          ) : (
            <div className="containerControl">
              {_TemplateVariant === EVariant.normal ? (label ? <LabelControl required={required} label={label} /> : '') : ''}
              <Autocomplete
                {...field}
                options={data}
                size={size ? size : _ControlSizeDefault}
                disabled={disabled}
                fullWidth={fullWidth || true}
                value={value != null ? value : ''}
                disableClearable={disableClearable}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                getOptionLabel={(option) => {
                  if (option.name) {
                    return option.name
                  } else {
                    const item = data.find((x) => { return x.id === option })
                    if (item) {
                      return item.name
                    }
                    return ''
                  }
                }}
                onChange={(event, value) => {
                  onChange(value)
                  onSelectChange && onSelectChange(value)
                }}
                renderOption={(props, option) => {
                  return renderOption ? renderOption(props, option) : (<Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                    <Typography key={option.id}>{option.name}</Typography>
                  </Box>)
                }}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => {
                    return renderTags ? renderTags(option, { ...getTagProps({ index }) })
                      : <ChipControl label={option.name} {...getTagProps({ index })} />
                  })
                }
                renderInput={(params) => {
                  return renderInput ? renderInput({ ...props }, { ...params }) :
                    <TextField
                      {...params}
                      required={required}
                      error={!!error}
                      helperText={error?.message}
                      fullWidth={fullWidth || true}
                      label={_TemplateVariant === EVariant.outlined ? label : ''}
                      variant="outlined"
                    />
                }}
              />
            </div>
          )
        }
        control={control}
      />
    )
  }
)

export default SingleSelect
