import React, { useState, useEffect, useCallback } from "react"
import { styled, alpha } from '@mui/material/styles'
import PropTypes from 'prop-types'
import FilterItem from './filterItem'
import Popover from '@mui/material/Popover'
import Grid from "@mui/material/Grid"
import Box from "@mui/material/Box"
import style from "components/resizable/ResizableNew.scss"
import { saveFilter } from "services"
import Collapse from '@mui/material/Collapse'
import classNames from "classnames/bind"
import ButtonFuntion from 'components/button/ButtonFuntion'
import { EButtonType, EButtonIconType } from 'configs'
import { useTranslation } from 'react-i18next'
import { useForm, useFieldArray, Controller } from "react-hook-form"
import { TextInput } from "components/input"
import ButtonIcon from "components/button/ButtonIcon"
let cx = classNames.bind(style)
const StyledMenu = styled((props) => (
    <Popover
        elevation={0}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
        }}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
        }}
        {...props}
    />
))(({ theme }) => ({
    '& .MuiPaper-root': {
        borderRadius: 6,
        marginTop: theme.spacing(1),
        padding: theme.spacing(1.5),
        with: "auto",
        color: theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
        boxShadow:
            'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
        '& .MuiMenu-list': {
            padding: '4px 0',
        },
        '& .MuiMenuItem-root': {
            '& .MuiSvgIcon-root': {
                fontSize: 18,
                // color: theme.palette.text.secondary,
                marginRight: theme.spacing(1.5),
            },
            '&:active': {
                backgroundColor: alpha(
                    theme.palette.primary.main,
                    theme.palette.action.selectedOpacity,
                ),
            },
        },
    },
}))
const Filter = (props) => {
    const { anchorEl, handleClose, onApplyFilter, columnModel, dropdownItem } = props
    const open = Boolean(anchorEl)
    const [anchorSave, setAnchorSave] = React.useState(null)

    const { control, reset, handleSubmit, setValue, setError } = useForm({
    })

    const { fields, append, remove } = useFieldArray({
        control,
        name: "test",
    })

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
            condition: null,
        }]
    }
    const { t } = useTranslation()
    const onAdd = () => {
        append({
            column: null,
            condition: null,
            value: "",
            selectValue: null
        })
    }

    useEffect(() => {
        reset(dataFromServer)
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
            const res = await saveFilter({ name: data.name, filterData: JSON.stringify(value) })
        }
    }
    const getDataFilter = (data) => {
        if (data && data.test) {
            const value = []
            data.test.map((item, index) => {
                if (item.column && item.condition) {
                    if (!item.selectValue) {
                        value.push({ column: item.column, operation: item.condition, value: item.value })
                    }
                    else {
                        value.push({ column: item.column, operation: item.condition, value: item.selectValue.map(e => e.id).join(',') })
                    }
                }
            })
            return value
        }
    }
    const onSubmit = (data) => {
        const value = getDataFilter(data)
        if (value) {
            onApplyFilter(value)
        }
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
    return (
        <Collapse in={open} timeout="auto" unmountOnExit>
            <div className={cx("containerNew")}>
                <Box className="box-container">
                    <Grid width="auto" container
                        direction="column" rowSpacing={2}  >
                        <Grid key="header" item xs={12}>
                            <ButtonFuntion spacingLeft={0} visible={true} onClick={onAdd} type={EButtonType.addFilter} />
                        </Grid>

                        {
                            fields.map((item, index) => {
                                return (
                                    <FilterItem onClearConditionValue={onClearConditionValue}
                                        onClearValue={onClearValue} onDeleteItem={onDeleteItem}
                                        control={control}
                                        key={`item_${index}`}
                                        index={index} name={`item_${index}`}
                                        columnModel={columnModel}></FilterItem>
                                )
                            })
                        }
                        {/* {inputList} */}
                        <Grid key="footer" style={{ display: "flex" }} item xs={12}>
                            <ButtonFuntion spacingLeft={0} visible={true} onClick={onClear} type={EButtonType.clearFilter} />
                            <ButtonFuntion spacingLeft={2} visible={true} onClick={handleSubmit(onSubmit)} type={EButtonType.apply} />
                            <ButtonFuntion style={{ marginLeft: "auto" }} visible={true} onClick={handleClickSave} type={EButtonType.save} />
                            <Popover
                                id={id}
                                open={openSave}
                                anchorEl={anchorSave}
                                onClose={handleCloseSave}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'right',
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                            >
                                <Grid className="containerNew" style={{ display: "flex", marginBottom: "0px", flexDirection: "row" }} width="auto" container
                                    rowSpacing={2} columnSpacing={1} >
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
                                        />
                                    </Grid>
                                    <Grid item  >
                                        <ButtonIcon
                                            onClick={handleSubmit(onSave)}
                                            type={EButtonIconType.apply}
                                        />
                                    </Grid>
                                </Grid>
                            </Popover>
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