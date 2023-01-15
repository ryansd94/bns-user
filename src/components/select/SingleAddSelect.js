import React, { useState, useEffect } from "react"
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete"
import TextField from "@mui/material/TextField"
import { Controller } from "react-hook-form"
import Skeleton from "@mui/material/Skeleton"
import { useSelector } from "react-redux"
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { ChipControl } from "components/chip"
import { _TemplateVariant, EVariant, _ControlSizeDefault } from 'configs'
import { useTranslation } from "react-i18next"
import { LabelControl } from 'components/label'
import { v4 as uuidv4 } from 'uuid'

const filter = createFilterOptions()

const SingleAddSelect = React.memo(
  (props) => {
    const { control, field, required, data = [], label, name, onSelectChange,
      size, disabled, fullWidth, renderOption, renderTags, renderInput,
      disableClearable = false, freeSolo = false, placeholder, width = '100%', isAddWhenNoOption = true,
      onInputChange } = props
    const loadingPopup = useSelector((state) => state.master.loadingPopup)
    const { t } = useTranslation()

    return (
      <Controller
        name={name}
        render={({ field, fieldState: { error } }) =>
          loadingPopup ? (
            <Skeleton width={"100%"} variant="text">
              <Autocomplete
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
                    size={size ? size : _ControlSizeDefault}
                    variant="outlined"
                  />
                )}
              />
            </Skeleton>
          ) : (
            <div className="containerControl">
              {_TemplateVariant === EVariant.normal ? (label ? <LabelControl required={required} label={label} /> : '') : ''}
              <Autocomplete
                // {...field}
                options={data}
                size={size ? size : _ControlSizeDefault}
                disabled={disabled}
                freeSolo={freeSolo}
                fullWidth={fullWidth || true}
                value={field.value != null ? field.value : null}
                disableClearable={disableClearable}
                selectOnFocus
                autoHighlight
                clearOnBlur
                handleHomeEndKeys
                isOptionEqualToValue={(option, value) => option.id === value || null}
                getOptionLabel={(option) => {
                  if (option.value) {
                    return option.value
                  }
                  if (option.name) {
                    return option.name
                  } else {
                    const item = data.find((x) => { return x.id === option })
                    if (item) {
                      return item.name
                    }
                    return freeSolo ? option : ''
                  }
                }}
                filterOptions={(options, params) => {
                  const filtered = filter(options, params)
                  if (isAddWhenNoOption && params.inputValue !== '' && (!filtered || filtered.length == 0)) {
                    filtered.push({
                      id: uuidv4(),
                      name: `${t('Thêm')} "${params.inputValue}"`,
                      value: params.inputValue,
                      isAddNew: true
                    })
                  }
                  return filtered
                }}
                onChange={(event, value) => {
                  let newValue = value
                  if (newValue && newValue.isAddNew) {
                    newValue = { id: uuidv4(), name: value.value, isAddNew: true }
                  } else {
                    newValue = newValue && newValue.id
                  }
                  field.onChange(newValue)
                  onSelectChange && onSelectChange(newValue)
                }}
                onInputChange={onInputChange}
                renderOption={(props, option) => {
                  return renderOption ? renderOption(props, option) : (<Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props} key={option.id}>
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
                      placeholder={placeholder}
                      helperText={error?.message}
                      fullWidth={fullWidth || true}
                      style={{ width: width }}
                      size={size ? size : _ControlSizeDefault}
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

export default SingleAddSelect
