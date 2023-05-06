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

const ToolBar = React.memo(props => {
    const { onAddClick, visible, onDeleteClick, columnModel,
        onColumnConfigChange, onApplyFilter, component, genarateCustomButton } = props
    const [anchorElColumn, setAnchorElColumn] = useState(null)
    const [anchorElFilter, setAnchorElFilter] = useState(false)
    const dispatch = useDispatch()

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
                <ButtonFuntion spacingLeft={0} visible={visible.column} onClick={handleClickColumn} type={EButtonType.columnConfig} />
                <ButtonFuntion spacingLeft={1} visible={visible.column} open={anchorElFilter} onClick={handleClickFilter} type={EButtonType.filter} />
                <DropdownMenu visible={visible.function} type={EButtonType.function} genderDropdownItem={genderDropdownItem} />
                <ButtonFuntion spacingLeft={1} visible={visible.add} onClick={onAddClick} type={EButtonType.add} />
                <ButtonFuntion spacingLeft={1} visible={visible.delete} onClick={onDeleteClick} type={EButtonType.delete} />
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

})
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