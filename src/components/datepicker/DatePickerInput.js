import React from "react"
import TextField from '@mui/material/TextField'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker'
import { useTranslation } from "react-i18next"
import { EFormatDate } from "configs/enums"
import { Controller } from "react-hook-form"
import { useSelector } from "react-redux"
import Skeleton from "@mui/material/Skeleton"
import { _TemplateVariant, EVariant, _ControlSizeDefault,EControlType } from "configs"
import { LabelControl } from 'components/label'
import _ from 'lodash'
import { FormHelperText } from '@mui/material'

const DatePickerInput = ({ size, onChange, disabled, control, name, label,
    formatDate = EFormatDate.ddmmyyyy, isViewMode = false, required, defaultValue = null, readOnly, isShowPlacholder = true }) => {
    const loadingPopup = useSelector((state) => state.master.loadingPopup)
    const { t } = useTranslation()
    const [value, setValue] = React.useState(defaultValue)

    const renderControl = ({ onChange, value, error }) => {
        return loadingPopup ? (
            <Skeleton
                width={"100%"}
                variant="text"
                size={size ? size : _ControlSizeDefault}
            >
                <div className="containerControl">
                    {_TemplateVariant === EVariant.normal ? (label ? <LabelControl required={required} label={label} /> : '') : ''}
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DesktopDatePicker
                            clearable
                            value={null}
                            size={size ? size : _ControlSizeDefault}
                            disabled={disabled ? disabled : false}
                            inputFormat={EFormatDate.ddmmyyyy}
                            onChange={onChange}
                            renderInput={(params) =>
                                <TextField
                                    size={size ? size : _ControlSizeDefault} {...params} />}
                        />
                    </LocalizationProvider >
                </div>
            </Skeleton>

        ) : (
            <div className="containerControl">
                {_TemplateVariant === EVariant.normal ? (label ? <LabelControl required={required} label={label} /> : '') : ''}
                {
                    isViewMode === false ? <FormHelperText children={error?.message} error={!_.isNil(error) ? true : false} /> : ''
                }
                {
                    isViewMode === true ? value : <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DesktopDatePicker
                            label={_TemplateVariant === EVariant.outlined ? label : ''}
                            clearable
                            value={value}
                            readOnly={readOnly}
                            disabled={disabled ? disabled : false}
                            inputFormat={formatDate}
                            mask={""}
                            onChange={onChange}
                            renderInput={(params) => <TextField
                                fullWidth
                                size={size ? size : _ControlSizeDefault}
                                InputProps={params.InputProps}
                                disabled={params.inputProps.disabled}
                                onChange={params.inputProps.onChange}
                                placeholder={isShowPlacholder ? params.inputProps.placeholder : ''}
                                readOnly={params.inputProps.readOnly}
                                value={params.inputProps.value}
                                inputRef={params.inputRef}
                            />
                            }
                        />
                    </LocalizationProvider >
                }
            </div>
        )
    }

    return (
        control ? <Controller
            name={name}
            render={({ field, fieldState: { error } }) =>
                renderControl({
                    value: value || !_.isNil(field?.value) ? field?.value : null,
                    onChange: (newValue) => {
                        setValue(newValue)
                        onChange && onChange(newValue, name, EControlType.datePicker)
                        field.onChange(newValue)
                    },
                    error: error
                })
            }
            control={control}
        /> : renderControl({
            value: value,
            onChange: (newValue) => {
                onChange && onChange(newValue)
            }
        })
    )
}

export default DatePickerInput