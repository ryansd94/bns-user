import React, { useState, useEffect } from "react"
import PropTypes from 'prop-types'
import FilterItem from './filterItem'
import Grid from "@mui/material/Grid"
import Box from "@mui/material/Box"
import { save, get } from "services"
import Collapse from '@mui/material/Collapse'
import ButtonFuntion from 'components/button/ButtonFuntion'
import { EButtonType, EButtonIconType, baseUrl } from 'configs'
import { useTranslation } from 'react-i18next'
import { useForm, useFieldArray, Controller } from "react-hook-form"
import { TextInput } from "components/input"
import ButtonIcon from "components/button/ButtonIcon"
import { PopoverControl } from 'components/popover'
import './styles.scss'
import { useHistory, useLocation } from 'react-router'
import { v4 as uuidv4 } from 'uuid'
import SingleAddSelect from 'components/select/SingleAddSelect'
import _ from 'lodash'

const Filter = (props) => {
    console.log("render Filter")
    const { anchorEl, onApplyFilter, columnModel, dropdownItem, component } = props
    const open = Boolean(anchorEl)
    const [anchorSave, setAnchorSave] = React.useState(null)
    const [filterData, setFilterData] = React.useState(null)
    const { control, reset, handleSubmit, setValue, getValues, setError } = useForm({
    })
    const { fields, append, remove } = useFieldArray({
        control,
        name: "test",
    })
    const history = useHistory()
    const location = useLocation()

    const handleClickSave = (event) => {
        setAnchorSave(event.currentTarget)
    }

    const handleCloseSave = () => {
        setAnchorSave(null)
    }

    const openSave = Boolean(anchorSave)
    const id = openSave ? 'simple-popover' : undefined
    const dataFromServer = {
        name: "",
        test: [{
            value: "", selectValue: null, column: null,
            condition: null, id: uuidv4(), type: null
        }]
    }
    const { t } = useTranslation()
    const onAdd = () => {
        append({
            column: null,
            condition: null,
            value: "",
            selectValue: null,
            id: uuidv4(),
            type: null
        })
    }

    const loadFilters = async () => {
        await get(baseUrl.sys_filter, {
            component: component,
            isGetAll: true
        }).then((data) => {
            if (data && data.data.items.length > 0) {
                setFilterData(data.data.items)
            }
        })
    }

    useEffect(() => {
        loadFilters()
    }, [])

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search)
        const filters = urlParams.get('filters')
        if (filters) {
            const filterObject = JSON.parse(filters)
            console.log(filterObject)
            setValue('test', filterObject)
        } else {
            reset(dataFromServer)
        }
    }, [])

    const onClear = () => {
        reset(dataFromServer)
    }

    const onSave = async (data) => {
        if (!data.name) {
            setError('name', { type: 'focus', message: t("Nhập tên bộ lọc") })
        }
        const value = getDataFilter(data)
        if (value) {
            const res = await save(baseUrl.sys_filter, { name: data.name, filterData: JSON.stringify(value), component: component })
        }
    }

    const getDataFilter = (data) => {
        if (data && data.test) {
            const value = []
            data.test.map((item, index) => {
                if (item.column && item.condition != null) {
                    if (!item.selectValue) {
                        value.push({ column: item.column, condition: item.condition, value: item.value, type: item.type, isCustom: item.isCustom })
                    }
                    else {
                        value.push({ column: item.column, condition: item.condition, value: item.selectValue.map(e => e.id).join(','), type: item.type, isCustom: item.isCustom })
                    }
                }
            })
            return value
        }
    }

    const onSubmit = (data) => {
        const filters = getDataFilter(data)
        const url = new URL(window.location)
        if (_.isArray(filters) && filters.length > 0) {
            url.searchParams.set('filters', JSON.stringify(filters))
            window.history.pushState(null, '', url.toString())

            // const params = new URLSearchParams({ filters: JSON.stringify(value) })
            // history.replace({ pathname: location.pathname, search: params.toString() })
        } else {
            url.searchParams.delete('filters')
            window.history.pushState(null, '', url.toString())
        }
        onApplyFilter(filters)
    }

    const onDeleteItem = (index) => {
        remove(index)
    }

    const onClearValue = (value) => {
        setValue(`test[${value}].value`, "")
        setValue(`test[${value}].selectValue`, null)
    }

    const onClearConditionValue = (value) => {
        setValue(`test[${value}].condition`, null)
    }

    const genderPopoverControl = () => {
        return (
            <Grid className='box-container' flexWrap='nowrap' width="auto" container
            >
                <Grid item  >
                    <TextInput label={t("Nhập tên bộ lọc")}
                        fullWidth
                        required={true}
                        size={"small"}
                        control={control}
                        name={"name"} />
                </Grid>
                <Grid item  >
                    <ButtonIcon
                        onClick={handleCloseSave}
                        type={EButtonIconType.cancel}
                        color="neutral"
                    />
                </Grid>
                <Grid item  >
                    <ButtonIcon
                        onClick={handleSubmit(onSave)}
                        type={EButtonIconType.apply}
                        color="primary"
                    />
                </Grid>
            </Grid>
        )
    }

    return (
        <Collapse in={open} timeout="auto" unmountOnExit>
            <div className="containerNew">
                <Box className="box-container">
                    <Grid width="auto" container
                        direction="column" rowSpacing={2}  >
                        <Grid key="header" container item columnSpacing={2}>
                            <Grid item>
                                <ButtonFuntion spacingLeft={0} onClick={onAdd} type={EButtonType.addFilter} />
                            </Grid>
                            <Grid item xs={3}>
                                <SingleAddSelect
                                    data={filterData}
                                    control={control}
                                    name='filterId'
                                />
                            </Grid>
                        </Grid>

                        {
                            fields.map((item, index) => {
                                return (
                                    <FilterItem onClearConditionValue={onClearConditionValue}
                                        onClearValue={onClearValue} onDeleteItem={onDeleteItem}
                                        control={control}
                                        key={`item_${item.id}`}
                                        item={item}
                                        getValues={getValues}
                                        setValue={setValue}
                                        index={index} name={`item_${item.id}`}
                                        columnModel={columnModel}></FilterItem>
                                )
                            })
                        }
                        {/* {inputList} */}
                        <Grid key="footer" style={{ display: "flex" }} item xs={12}>
                            <ButtonFuntion spacingLeft={0} onClick={onClear} type={EButtonType.clearFilter} />
                            <ButtonFuntion spacingLeft={2} onClick={handleSubmit(onSubmit)} type={EButtonType.apply} />
                            <ButtonFuntion style={{ marginLeft: "auto" }} onClick={handleClickSave} type={EButtonType.save} />
                            <PopoverControl
                                anchorEl={anchorSave}
                                onClose={handleCloseSave}
                                genderBody={genderPopoverControl}
                            >

                            </PopoverControl>
                        </Grid>
                    </Grid>
                </Box>
            </div >
        </Collapse>
    )
}

Filter.propTypes = {
    anchorEl: PropTypes.bool,
    handleClose: PropTypes.func,
    onColumnConfigChange: PropTypes.func,
    dropdownItem: PropTypes.object,
}
export default Filter