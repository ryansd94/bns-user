import React, { useState, useEffect, useCallback } from "react"
import TextField from '@mui/material/TextField'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker'
import Stack from '@mui/material/Stack'
import { useTranslation } from "react-i18next"
import { EFormatDate } from "configs/constants"
import { Controller } from "react-hook-form"
import { useSelector } from "react-redux"
import Skeleton from "@mui/material/Skeleton"
import { _TemplateVariant, EVariant, _ControlSizeDefault } from "configs"
import { LabelControl } from 'components/label'
import _ from 'lodash'

const DatePickerInput = ({ size, onChange, disabled, control, name, label, formatDate = EFormatDate.ddmmyyyy }) => {
    const loadingPopup = useSelector((state) => state.master.loadingPopup)
    const { t } = useTranslation()
    const [value, setValue] = React.useState(null)

    return (
        <Controller
            name={name}
            render={({ field, fieldState: { error } }) =>
                loadingPopup ? (
                    <Skeleton
                        width={"100%"}
                        variant="text"
                        size={size ? size : _ControlSizeDefault}
                    >
                        <div className="containerControl">
                            {_TemplateVariant === EVariant.normal ? (label ? <LabelControl label={label} /> : '') : ''}
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DesktopDatePicker
                                    clearable
                                    value={null}
                                    size={size ? size : _ControlSizeDefault}
                                    disabled={disabled ? disabled : false}
                                    inputFormat={EFormatDate.ddmmyyyy}
                                    onChange={(newValue) => {
                                        setValue(newValue)
                                        field.onChange(newValue)
                                        onChange && onChange(newValue)
                                    }}
                                    renderInput={(params) =>
                                        <TextField
                                            size={size ? size : _ControlSizeDefault} {...params} />}
                                />
                            </LocalizationProvider >
                        </div>
                    </Skeleton>

                ) : (
                    <div className="containerControl">
                        {_TemplateVariant === EVariant.normal ? (label ? <LabelControl label={label} /> : '') : ''}
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DesktopDatePicker
                                label={_TemplateVariant === EVariant.outlined ? label : ''}
                                clearable
                                value={value || !_.isNil(field?.value) ? field?.value : null}
                                disabled={disabled ? disabled : false}
                                inputFormat={formatDate}
                                mask={""}
                                onChange={(newValue) => {
                                    setValue(newValue)
                                    field.onChange(newValue)
                                    onChange && onChange(newValue)
                                }}
                                renderInput={(params) => <TextField
                                    fullWidth
                                    size={size ? size : _ControlSizeDefault} {...params} />}
                            />
                        </LocalizationProvider >
                    </div>
                )
            }
            control={control}
        />
    )
}

export default DatePickerInput