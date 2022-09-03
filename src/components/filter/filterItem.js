import React, { useState, useEffect, useCallback } from "react"
import SingleSelect from 'components/select/SingleSelect'
import MultiSelect from 'components/select/MultiSelect'


import Grid from "@mui/material/Grid"
import { useTranslation } from "react-i18next"
import { DatePickerInput } from "components/datepicker"
import {
    IconDelete
} from "components/icon/icon"
import IconButton from '@mui/material/IconButton'
import { EFilterType } from "configs"
import { TextInput } from "components/input"
const FilterItem = React.memo((props) => {
    console.log("render FilterItem")
    const { t } = useTranslation()
    const { columnModel = [], name, index, control, onDeleteItem, onClearValue, onClearConditionValue } = props

    const [conditionOption, setConditionOption] = React.useState([])
    const [conditionValue, setConditionValue] = React.useState(null)
    const [columnValue, setColumnValue] = React.useState(null)
    const [valueComponent, setValueComponent] = React.useState(null)
    const [show, setShow] = React.useState(true)
    const [display, setDisplay] = React.useState("none")
    const [width, setWidth] = React.useState(300)
    // const [disabled, setDisabled] = React.useState(true)
    const [disableCondition, setDisableCondition] = React.useState(true)
    const size = "small"
    const setColumnModelData = () => {
        const data = []
        columnModel && columnModel.map((item) => {
            data.push({ id: item.field, name: item.label, type: item.type })
        })
        return data
    }
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

    const onColumnChange = (value) => {
        const valueItem = columnModel.find((item) => {
            return item.field === value
        })
        if (columnValue && valueItem && valueItem.type != columnValue.type) {
            onClearValue(index)
        }
        setColumnValue(valueItem)
        //setConditionValue(null)
        if (valueItem) {
            setDisplay("block")
            setDisableCondition(false)
            var disabled = true
            if (conditionValue) {
                disabled = false
            }
            if (valueItem.type == EFilterType.text) {
                setConditionOption(textOptions)
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
                setConditionOption(selectOptions)
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
                setConditionOption(dateOptions)
                setValueComponent(
                    <DatePickerInput
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
        if (conditionValue != null) {
            disabled = false
        }
        else {
            onClearValue(index)
        }
        if (columnValue) {
            if (columnValue.type == EFilterType.text) {
                setValueComponent(
                    <TextInput label={t("Giá trị")}
                        disabled={disabled}
                        size={size}
                        fullWidth
                        name={`test[${index}].value`}
                        control={control} />
                )
            }
            else if (columnValue.type == EFilterType.select) {
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
            else if (columnValue.type == EFilterType.datetime) {
                setValueComponent(<DatePickerInput
                    disabled={disabled}
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
                    disabled={disableCondition}
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
                <IconButton onClick={onDelete}><IconDelete></IconDelete></IconButton>
            </Grid>

        </Grid>
    )
})
export default FilterItem