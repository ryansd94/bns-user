import React from "react"
import TextField from "@mui/material/TextField"
import { Controller } from "react-hook-form"
import { useSelector } from "react-redux"
import Skeleton from "@mui/material/Skeleton"
import { _TemplateVariant, EVariant, _ControlSizeDefault } from "configs"
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import { LabelControl } from 'components/label'


export default function RadioGroupControl({
    control,
    required,
    label,
    name,
    autoFocus,
    hidden,
    inputProps,
    type,
    onChange,
    size,
    disabled,
    variant,
    fullWidth,
    options
}) {
    const loadingPopup = useSelector((state) => state.master.loadingPopup)
    return (
        <Controller
            render={({ field: { onChange, value }, fieldState: { error } }) =>
                loadingPopup ? (
                    <Skeleton width={"100%"} height={"56px"} variant="text">
                        <RadioGroup
                            name={name}
                            onChange={(e) => {
                                onChange && onChange(e.target.value)
                            }}
                        >
                            {options && options.map((item) => {
                                return <FormControlLabel key={item.id} value={item.id} control={<Radio />} label={item.label} />
                            })}
                        </RadioGroup>
                    </Skeleton>
                ) : (
                    <div className="containerControl">
                        {_TemplateVariant === EVariant.normal ? (label ? <LabelControl label={label} /> : '') : ''}
                        <RadioGroup
                            row
                            value={value}
                            name={name}
                            onChange={(e) => {
                                onChange && onChange(e.target.value)
                            }}
                        >
                            {options && options.map((item) => {
                                return <FormControlLabel key={item.id} value={item.id} control={<Radio />} label={item.label} />
                            })}
                        </RadioGroup>
                    </div>
                )
            }
            name={name}
            control={control && control}
        />
    )
}
