import React from "react"
import TextField from "@mui/material/TextField"
import { Controller } from "react-hook-form"
import { useSelector } from "react-redux"
import Skeleton from "@mui/material/Skeleton"
import { _TemplateVariant, EVariant, _ControlSizeDefault } from "configs"
import { LabelControl } from 'components/label'
import { ColorPicker } from 'mui-color'

export default function ColorPickerControl({
    control,
    required,
    label,
    name,
    onChange,
    defaultValue,
    hideTextfield = true,
    readOnly
}) {
    const loadingPopup = useSelector((state) => state.master.loadingPopup)
    return (
        control ?
            <Controller
                render={({ field, fieldState: { error } }) =>
                    loadingPopup ? (
                        <Skeleton width={"100%"} height={"56px"} variant="text">
                            <ColorPicker control={control}
                                name={name}
                                value={field.value || defaultValue || ''}
                                onChange={(e) => field.onChange(e.hex)}
                                hideTextfield={hideTextfield}
                                defaultValue="transparent"
                            />
                        </Skeleton>
                    ) : (
                        <div className="containerControl">
                            {_TemplateVariant === EVariant.normal ? (label ? <LabelControl required={required} label={label} /> : '') : ''}
                            <ColorPicker
                                control={control}
                                name={name}
                                value={field.value || defaultValue || ''}
                                onChange={(e) => {
                                    field.onChange(`#${e.hex}`)
                                    onChange && onChange(e)
                                }}
                                hideTextfield={hideTextfield}
                                defaultValue="transparent"
                            />
                        </div>
                    )
                }
                name={name}
                control={control && control}
            /> :
            <div className={readOnly ? "disabled" : undefined}>
                <ColorPicker
                    name={name}
                    value={defaultValue || ''}
                    onChange={onChange}
                    hideTextfield={hideTextfield}
                    defaultValue="transparent"
                />
            </div>
    )
}