import React, { useState, useEffect, useRef } from "react"
import Autocomplete from "@mui/material/Autocomplete"
import TextField from "@mui/material/TextField"
import { Controller } from "react-hook-form"
import Skeleton from "@mui/material/Skeleton"
import { useSelector } from "react-redux"
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { ChipControl } from "components/chip"
import { _TemplateVariant, EVariant, _ControlSizeDefault } from 'configs'
import { LabelControl } from 'components/label'
import _ from 'lodash'

const MultiSelect = React.memo(
  ({ control, required, data, label, name, placeholder, disabled, size, fullWidth, renderOption, renderTags }) => {
    const loadingPopup = useSelector((state) => state.master.loadingPopup)
    const [value, setValue] = React.useState([])
    const [text, setText] = React.useState("")
    const inputRef = useRef(null)
    const handleKeyDown = (event) => {
      switch (event.key) {
        case ",":
        case " ": {
          event.preventDefault()
          event.stopPropagation()
          if (event.target.value.length > 0) {
            setValue([...value, event.target.value])
          }
          break
        }
        default:
      }
    }

    const onTextChange = (e) => {
      if (e.target.value.indexOf("@") >= 0) {
        let bbbbb = e.target.value + "aaaaaaaa"

        setText(bbbbb)
      }
      setText(e.target.value)
    }

    const onTextKeypress = (e) => {
      if (e.key == "@" && e.target.value.indexOf("@") < 0) {
        e.target.value = e.target.value + "@gmail.com"
        setText(e.target.value + "aaaaaaaa")
        e.preventDefault()
      }
    }
    const handleFocus = (e) => {
      inputRef.target.select()
    }

    const getDataByDefaultValue = (value) => {
      const values = _.filter(data, function (o) {
        return _.indexOf(value, o.id, 0) >= 0;
      })
      return values
    }

    return (
      <Controller
        name={name}
        render={({ field: { onChange, value }, fieldState: { error } }) =>
          loadingPopup ? (
            <Skeleton
              width={"100%"}
              size={size ? size : _ControlSizeDefault}
              variant="text"
            >
              <Autocomplete
                multiple={true}
                options={data}
                size={size ? size : _ControlSizeDefault}
                disabled={disabled}
                fullWidth={fullWidth || false}
                isOptionEqualToValue={(option, value) =>
                  option != null && value != null ? option.id === value.id : ""
                }
                value={value != null ? value : []}
                filterSelectedOptions
                getOptionLabel={(option) => (option ? option.name : "")}
                onChange={(event, newValue) => {
                  onChange(newValue)
                }}
                renderInput={(params) => {
                  params.inputProps.onKeyDown = handleKeyDown
                  return (
                    <TextField
                      {...params}
                      style={{ marginTop: "0px", marginBottom: "0px", minWidth: "250px" }}
                      variant="outlined"
                      label={label}
                      placeholder={placeholder}
                      size={size ? size : _ControlSizeDefault}
                      fullWidth
                    ></TextField>
                  )
                }}
              />
            </Skeleton>
          ) : (
            <div className="containerControl">
              {_TemplateVariant === EVariant.normal ? (label ? <LabelControl required={required} label={label} /> : '') : ''}
              <Autocomplete
                multiple={true}
                options={data}
                size={size ? size : _ControlSizeDefault}
                limitTags={2}
                fullWidth={fullWidth || true}
                style={{ marginTop: "0px" }}
                disabled={disabled}
                isOptionEqualToValue={(option, value) =>
                  option != null && value != null ? option.id === value.id : ""
                }
                value={value != null ? getDataByDefaultValue(value) : []}
                filterSelectedOptions
                getOptionLabel={(option) => (option ? option.name : "")}
                onChange={(event, newValue) => {
                  if (newValue.length > 0) {
                    onChange(_.map(newValue, (item) => {
                      return item.id
                    }))
                  } else {
                    onChange([])
                  }
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
                  params.inputProps.onKeyDown = handleKeyDown
                  return (
                    <TextField
                      {...params}
                      style={{ marginTop: "0px", marginBottom: "0px", minWidth: "250px" }}
                      label={_TemplateVariant === EVariant.outlined ? label : ''}
                      placeholder={placeholder}
                      margin="normal"
                      fullWidth={fullWidth || true}
                      size={size ? size : _ControlSizeDefault}
                    ></TextField>
                  )
                }}
              />
            </div>
          )
        }
        defaultValue={[]}
        control={control}
      />
    )
  }
)

export default MultiSelect
