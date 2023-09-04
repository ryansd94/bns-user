import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from "react-redux"
import ButtonFuntion from 'components/button/ButtonFuntion'
import PropTypes from 'prop-types'
import { EButtonType } from 'configs/enums'
import { ConfigColumn, DropdownMenu } from 'components/dropdown'
import { Filter } from 'components/filter'
import MenuItem from '@mui/material/MenuItem'
import { IconDelete } from "components/icon/icon"
import {
    setReload,
} from "stores/views/master"
import Grid from "@mui/material/Grid"
import { VisibleDefault } from 'configs/enums'
import eventEmitter from 'helpers/eventEmitter'

const ToolBar = (props) => {
    const { onAddClick, visible, onDeleteClick, columnModel,
        onColumnConfigChange, onApplyFilter, component, genarateCustomButton, gridId } = props
    const [anchorElColumn, setAnchorElColumn] = useState(null)
    const [anchorElFilter, setAnchorElFilter] = useState(false)
    const [visibleObject, setVisibleObject] = useState({ ...VisibleDefault })
    const dispatch = useDispatch()

    const onChangeVisibleToolbar = ({ id, visibleObject }) => {
        if (id === gridId) {
            setVisibleObject(visibleObject)
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

    const genderDropdownItem = () => {
        return <MenuItem disableRipple>
            <IconDelete size={18} />
        </MenuItem>
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
                <DropdownMenu visible={visibleObject.function} type={EButtonType.function} genderDropdownItem={genderDropdownItem} />
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