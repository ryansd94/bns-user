import React from "react"
import { Controller } from "react-hook-form"
import { useSelector } from "react-redux"
import Skeleton from "@mui/material/Skeleton"
import { _TemplateVariant, EVariant, _ControlSizeDefault, EAlertType } from "configs"
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import { LabelControl } from 'components/label'
import { Alert } from 'components/alert'
import Grid from "@mui/material/Grid"
import _ from 'lodash'

export default function RadioGroupControl({
    control,
    label,
    name,
    options = [],
    isShowGuidance = false
}) {

    const loadingPopup = useSelector((state) => state.master.loadingPopup)

    const renderInfo = (value) => {
        const item = _.find(options, (x) => x.id == value)
        return !_.isNil(item) ? <Alert type={EAlertType.info} message={item.guidance} /> : ''
    }

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
                    <Grid container gap={1} direction='column'>
                        {_TemplateVariant === EVariant.normal ? (label ? <Grid item xs><LabelControl label={label} /></Grid> : '') : ''}
                        <Grid item xs>
                            <RadioGroup
                                row
                                value={value}
                                name={name}
                                onChange={(e) => {
                                    onChange && onChange(e.target.value)
                                }}
                            >
                                <Grid container gap={2} direction='column'>
                                    <Grid item xs>
                                        {options && options.map((item) => {
                                            return <FormControlLabel key={item.id} value={item.id} control={<Radio />} label={item.label} />
                                        })}
                                    </Grid>
                                    {isShowGuidance === true ? <Grid item xs>{renderInfo(value)}</Grid> : ''}
                                </Grid>
                            </RadioGroup>
                        </Grid>
                    </Grid>
                )
            }
            name={name}
            control={control && control}
        />
    )
}
