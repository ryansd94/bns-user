import React, { useState, useEffect, useCallback } from "react"
import SingleAddSelect from 'components/select/SingleAddSelect'
import MultiSelect from 'components/select/MultiSelect'
import Grid from "@mui/material/Grid"
import { useTranslation } from "react-i18next"
import { DatePickerInput } from "components/datepicker"
import { EControlType } from "configs"
import { TextInput } from "components/input"
import ButtonIcon from "components/button/ButtonIcon"
import { EButtonIconType } from 'configs'

const FilterItem = React.memo((props) => {
    console.log("render FilterItem")
    const { t } = useTranslation()
    const { columnModel = [], name, index, control, onDeleteItem, onClearValue,
        onClearConditionValue, item, setValue, getValues } = props

    const textOptions = [
        {
            id: 0,
            name: t("Equal")
        },
        {
            id: 1,
            name: t("Not equal")
        },
        {
            id: 2,
            name: t("Contains")
        },
        {
            id: 9,
            name: t("Not contains")
        },
    ]
    const selectOptions = [{
        id: 0,
        name: t("Equal")
    },
    {
        id: 1,
        name: t("Not equal")
    }]
    const dateOptions = [{
        id: 3,
        name: t("Greater than")
    },
    {
        id: 5,
        name: t("Less than")
    },
    {
        id: 4,
        name: t("Greater than or equal")
    },
    {
        id: 6,
        name: t("Less than or equal")
    }]
    const status = [{
        id: 1,
        name: t("Active")
    },
    {
        id: 3,
        name: t("Waiting for confirm")
    },
    {
        id: 4,
        name: t("Temporarily locked")
    }]
    const [conditionOption, setConditionOption] = React.useState([])
    const [conditionValue, setConditionValue] = React.useState(null)
    const [columnValue, setColumnValue] = React.useState(null)
    const [valueComponent, setValueComponent] = React.useState(null)
    const [show, setShow] = React.useState(true)
    const [display, setDisplay] = React.useState("none")
    const [width, setWidth] = React.useState(300)
    const [disableCondition, setDisableCondition] = React.useState(true)
    const size = "small"
    const setColumnModelData = () => {
        const data = []
        columnModel && columnModel.map((item) => {
            if (!item.isHideFilter) {
                data.push({ id: item.field, name: item.label, type: item.type, isCustom: item.isCustom })
            }
        })
        return data
    }

    const getConditionValue = (type) => {
        if (type == EControlType.textField) {
            return textOptions
        } else if (type == EControlType.select) {
            return selectOptions
        } else if (type == EControlType.datetime) {
            return dateOptions
        }
    }

    const onColumnChange = (value) => {
        const valueItem = columnModel.find((item) => {
            return item.field === value
        })
        if (columnValue && valueItem && valueItem.type != columnValue.type) {
            onClearValue(index)
        }
        setColumnValue(valueItem)
        if (valueItem) {
            const currentColumnType = getValues(`test[${index}].type`)
            if (currentColumnType !== valueItem.type) {
                setValue(`test[${index}].condition`, null)
            }
            setDisplay("block")
            setDisableCondition(false)
            setValue(`test[${index}].type`, valueItem.type)
            setValue(`test[${index}].isCustom`, valueItem.isCustom)
            var disabled = true
            if (conditionValue) {
                disabled = false
            }
            setConditionOption(getConditionValue(valueItem.type))
            if (valueItem.type == EControlType.textField) {
                setWidth(300)
                setValueComponent(
                    <TextInput
                        label={t("Value")}
                        disabled={disabled}
                        size={size}
                        name={`test[${index}].value`}
                        control={control}
                    />
                )
            }
            else if (valueItem.type == EControlType.select) {
                setWidth(300)
                setValueComponent(
                    <MultiSelect size={size} multiple={true}
                        disabled={disabled}
                        control={control}
                        label={t("Value")}
                        name={`test[${index}].selectValue`}
                        data={status}>
                    </MultiSelect>
                )
            }
            else if (valueItem.type == EControlType.datetime) {
                setWidth(200)
                setValueComponent(
                    <DatePickerInput
                        label={t("Value")}
                        control={control}
                        disabled={disabled}
                        name={`test[${index}].value`}
                        size="small">
                    </DatePickerInput>
                )
            }

        }
        else {
            setDisplay("none")
            setDisableCondition(true)
            setConditionOption([])
            setConditionValue(null)
            onClearValue(index)
            onClearConditionValue(index)
        }
    }

    const onConditionChange = (value) => {
        setConditionValue(value)
    }

    const onDelete = () => {
        onDeleteItem(index)
    }

    useEffect(() => {
        var disabled = true
        if (conditionValue != null || item.condition != null) {
            disabled = false
        }
        else {
            onClearValue(index)
        }
        const type = columnValue ? columnValue.type : (item ? item.type : null)
        if (item.column) {
            setConditionOption(getConditionValue(type))
        }
        if (item.condition != null) {
            setDisplay('Block')
        }
        if (type != null) {
            if (type == EControlType.textField) {
                setValueComponent(
                    <TextInput
                        label={t("Value")}
                        disabled={disabled}
                        size={size}
                        fullWidth
                        name={`test[${index}].value`}
                        control={control} />
                )
            }
            else if (type == EControlType.select) {
                setValueComponent(
                    <MultiSelect
                        disabled={disabled}
                        control={control}
                        size={size}
                        name={`test[${index}].selectValue`}
                        label={t("Value")}
                        data={status}></MultiSelect>
                )
            }
            else if (type == EControlType.datetime) {
                setValueComponent(<DatePickerInput
                    disabled={disabled}
                    label={t("Value")}
                    control={control}
                    name={`test[${index}].value`}
                    size="small"></DatePickerInput>)
            }
        }
    }, [conditionValue])

    return (
        <Grid key={name} item container gap={2} >
            <Grid width={200}>
                <SingleAddSelect
                    size={size}
                    onSelectChange={({ value }) => onColumnChange(value)}
                    label={t("Column")}
                    data={setColumnModelData()}
                    control={control}
                    name={`test[${index}].column`}
                    isAddWhenNoOption={false}
                >
                </SingleAddSelect>
            </Grid>
            <Grid width={200}  >
                <SingleAddSelect
                    size={size}
                    onSelectChange={({ value }) => onConditionChange(value)}
                    disabled={item && item.condition != null ? false : disableCondition}
                    control={control}
                    label={t("Compare")}
                    name={`test[${index}].condition`}
                    isAddWhenNoOption={false}
                    data={conditionOption}>
                </SingleAddSelect>
            </Grid>
            <Grid display={display} minWidth={width}  >
                {valueComponent}
            </Grid>
            <Grid style={{ display: 'flex', alignItems: 'center' }}  >
                <ButtonIcon onClick={onDelete} type={EButtonIconType.delete}></ButtonIcon>
            </Grid>
        </Grid>
    )
})
export default FilterItem