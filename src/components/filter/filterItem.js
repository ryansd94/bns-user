import React, { useState, useEffect, useCallback } from "react"
import SingleSelect from 'components/select/SingleSelect'
import MultiSelect from 'components/select/MultiSelect'

import Grid from "@mui/material/Grid"
import { useTranslation } from "react-i18next"
import { DatePickerInput } from "components/datepicker"
import { EFilterType } from "configs"
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
            name: t("Bằng")
        },
        {
            id: 1,
            name: t("Không bằng")
        },
        {
            id: 2,
            name: t("Có chứa")
        },
    ]
    const selectOptions = [{
        id: 0,
        name: t("Bằng")
    },
    {
        id: 1,
        name: t("Không bằng")
    }]
    const dateOptions = [{
        id: 3,
        name: t("Lớn hơn")
    },
    {
        id: 5,
        name: t("Nhỏ hơn")
    },
    {
        id: 4,
        name: t("Lớn hơn hoặc bằng")
    },
    {
        id: 6,
        name: t("Nhỏ hơn hoặc bằng")
    }]
    const status = [{
        id: 1,
        name: t("Kích hoạt")
    },
    {
        id: 3,
        name: t("Chờ xác nhận")
    },
    {
        id: 4,
        name: t("Tạm khóa")
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
                data.push({ id: item.field, name: item.label, type: item.type })
            }
        })
        return data
    }

    const getConditionValue = (type) => {
        if (type == EFilterType.text) {
            return textOptions
        } else if (type == EFilterType.select) {
            return selectOptions
        } else if (type == EFilterType.datetime) {
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
            var disabled = true
            if (conditionValue) {
                disabled = false
            }
            setConditionOption(getConditionValue(valueItem.type))
            if (valueItem.type == EFilterType.text) {
                setWidth(300)
                setValueComponent(
                    <TextInput
                        label={t("Giá trị")}
                        disabled={disabled}
                        size={size}
                        name={`test[${index}].value`}
                        control={control}
                    />
                )
            }
            else if (valueItem.type == EFilterType.select) {
                setWidth(300)
                setValueComponent(
                    <MultiSelect size={size} multiple={true}
                        disabled={disabled}
                        control={control}
                        label={t("Giá trị")}
                        name={`test[${index}].selectValue`}
                        data={status}>
                    </MultiSelect>
                )
            }
            else if (valueItem.type == EFilterType.datetime) {
                setWidth(200)
                setValueComponent(
                    <DatePickerInput
                        label={t("Giá trị")}
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
            if (type == EFilterType.text) {
                setValueComponent(
                    <TextInput
                        label={t("Giá trị")}
                        disabled={disabled}
                        size={size}
                        fullWidth
                        name={`test[${index}].value`}
                        control={control} />
                )
            }
            else if (type == EFilterType.select) {
                setValueComponent(
                    <MultiSelect
                        disabled={disabled}
                        control={control}
                        size={size}
                        name={`test[${index}].selectValue`}
                        label={t("Giá trị")}
                        data={status}></MultiSelect>
                )
            }
            else if (type == EFilterType.datetime) {
                setValueComponent(<DatePickerInput
                    disabled={disabled}
                    label={t("Giá trị")}
                    control={control}
                    name={`test[${index}].value`}
                    size="small"></DatePickerInput>)
            }
        }
    }, [conditionValue])

    return (
        <Grid key={name} item container spacing={2} >
            <Grid item width={200}>
                <SingleSelect
                    size={size}
                    onSelectChange={onColumnChange}
                    label={t("Cột")}
                    data={setColumnModelData()}
                    control={control}
                    name={`test[${index}].column`}
                >
                </SingleSelect>
            </Grid>
            <Grid item width={200}  >
                <SingleSelect
                    size={size}
                    onSelectChange={onConditionChange}
                    disabled={item && item.condition != null ? false : disableCondition}
                    control={control}
                    label={t("So sánh")}
                    name={`test[${index}].condition`}
                    data={conditionOption}>
                </SingleSelect>
            </Grid>
            <Grid display={display} item minWidth={width}  >
                {valueComponent}
            </Grid>
            <Grid item style={{ display: 'flex', alignItems: 'center' }}  >
                <ButtonIcon onClick={onDelete} type={EButtonIconType.delete}></ButtonIcon>
            </Grid>

        </Grid>
    )
})
export default FilterItem