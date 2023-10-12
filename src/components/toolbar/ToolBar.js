import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from "react-redux"
import ButtonFuntion from 'components/button/ButtonFuntion'
import PropTypes from 'prop-types'
import { EButtonType } from 'configs/enums'
import { ConfigColumn, DropdownMenu, DropDownItem } from 'components/dropdown'
import { Filter } from 'components/filter'
import { IconDelete } from "components/icon/icon"
import {
    setReload,
} from "stores/views/master"
import Grid from "@mui/material/Grid"
import { VisibleDefault } from 'configs/enums'
import eventEmitter from 'helpers/eventEmitter'
import { useTranslation } from "react-i18next"
import MenuItem from '@mui/material/MenuItem'
import { isHasPermissionForButton } from "helpers"
import { setDeleteData } from "stores/views/master"
import { open as openAlert } from "stores/components/alert-dialog"

const ToolBar = (props) => {
    const { onAddClick, visible, onDeleteClick, columnModel,
        onColumnConfigChange, onApplyFilter, component, genarateCustomButton, gridId } = props
    const { t } = useTranslation()
    const [anchorElColumn, setAnchorElColumn] = useState(null)
    const [anchorElFilter, setAnchorElFilter] = useState(false)
    const [visibleObject, setVisibleObject] = useState({ ...visible } || { ...VisibleDefault })
    const [selectedIds, setSelectedIds] = useState([])
    const dispatch = useDispatch()

    const getListPermission = () => {
        let result = []
        if (isHasPermissionForButton(EButtonType.delete)) {
            result.push(EButtonType.delete)
        }
        return result
    }
    const listPermission = getListPermission()

    const onChangeVisibleToolbar = ({ id, visibleObject, selectedIds }) => {
        if (id === gridId) {
            setVisibleObject(visibleObject)
            setSelectedIds(selectedIds)
        }
    }

    useEffect(() => {
        eventEmitter.on('onChangeVisibleToolbar', onChangeVisibleToolbar)

        return () => {
            eventEmitter.off('onChangeVisibleToolbar')
        }
    }, [])

    const handleClickColumn = (event) => {
        setAnchorElColumn(event.currentTarget)
    }

    const handleCloseColumn = () => {
        setAnchorElColumn(null)
    }

    const handleClickFilter = () => {
        setAnchorElFilter(!anchorElFilter)
    }

    const onDeleteRowsSelectedClick = () => {
        console.log(selectedIds)
        if (!_.isEmpty(selectedIds)) {
            dispatch(setDeleteData({ id: selectedIds, url: component }))
            dispatch(openAlert({ open: true }))
        }
    }

    const renderDropdownItem = () => {
        return <Grid container item direction={'column'}>
            {_.includes(listPermission, EButtonType.delete) ? <MenuItem onClick={onDeleteRowsSelectedClick}>
                <DropDownItem
                    title={t('Delete')}
                    icon={<IconDelete />}
                />
            </MenuItem> : ''}
        </Grid>
    }

    const onRefreshClick = () => {
        dispatch(setReload())
    }

    return (
        <Grid container gap={2} item xs direction={'column'} className='no-wrap fg-initial body-content-item'>
            <Grid item xs>
                <ConfigColumn onColumnConfigChange={onColumnConfigChange} columnModel={columnModel} anchorEl={anchorElColumn} handleClose={handleCloseColumn} />
                <ButtonFuntion spacingLeft={0} visible={visibleObject.column} onClick={handleClickColumn} type={EButtonType.columnConfig} />
                <ButtonFuntion spacingLeft={1} visible={visibleObject.column} open={anchorElFilter} onClick={handleClickFilter} type={EButtonType.filter} />
                {!_.isEmpty(listPermission) ? <DropdownMenu isShowEndIcon={false} isCloseOnClick={true} visible={visibleObject.function} type={EButtonType.function} renderDropdownItem={renderDropdownItem} /> : ''}
                <ButtonFuntion spacingLeft={1} visible={visibleObject.add} onClick={onAddClick} type={EButtonType.add} />
                <ButtonFuntion spacingLeft={1} visible={visibleObject.delete} onClick={onDeleteClick} type={EButtonType.delete} />
                <ButtonFuntion spacingLeft={1} onClick={onRefreshClick} type={EButtonType.refresh} />
                {genarateCustomButton}
            </Grid>
            <Grid item xs className=''>
                <Filter
                    component={component}
                    onApplyFilter={onApplyFilter}
                    onColumnConfigChange={onColumnConfigChange}
                    columnModel={columnModel}
                    anchorEl={anchorElFilter}>
                </Filter>
            </Grid>
        </Grid>
    )

}

ToolBar.propTypes = {
    onAddClick: PropTypes.func,
    onDeleteClick: PropTypes.func,
    onConfigColumn: PropTypes.func,
    columnModel: PropTypes.array,
    onColumnConfigChange: PropTypes.func,
    visible: PropTypes.object,
    dropdownItem: PropTypes.object,
}
ToolBar.defaultProps = {
    addVisible: true,
    deleteVisible: false
}
export default ToolBar