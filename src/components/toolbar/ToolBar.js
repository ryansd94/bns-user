import React from 'react'
import ButtonFuntion from 'components/button/ButtonFuntion'
import PropTypes from 'prop-types'
import { EButtonType } from 'configs/constants'
import { ConfigColumn, DropdownMenu } from 'components/dropdown'
import { Filter } from 'components/filter'
import MenuItem from '@mui/material/MenuItem'
import { IconDelete } from "components/icon/icon"

const ToolBar = React.memo(props => {

    const { onAddClick, visible, onDeleteClick, columnModel,
        onColumnConfigChange, dropdownItem, onApplyFilter, component } = props
    const [anchorElColumn, setAnchorElColumn] = React.useState(null)
    const [anchorElFilter, setAnchorElFilter] = React.useState(false)
    const [anchorElFunction, setAnchorElFunction] = React.useState(null)

    const handleClickColumn = (event) => {
        setAnchorElColumn(event.currentTarget)
    }

    const handleCloseColumn = () => {
        setAnchorElColumn(null)
    }

    const handleClickFilter = () => {
        setAnchorElFilter(!anchorElFilter)
    }

    const handleClickFunction = (event) => {
        setAnchorElFunction(event.currentTarget)
    }

    const handleCloseFunction = () => {
        setAnchorElFunction(null)
    }

    const genderDropdownItem = () => {
        return <MenuItem disableRipple>
            <IconDelete size={18} />
        </MenuItem>
    }

    return (
        <div>
            <div className="row">
                <div className="col-md-12 grid-margin  justify-content-end">
                    <ConfigColumn onColumnConfigChange={onColumnConfigChange} columnModel={columnModel} anchorEl={anchorElColumn} handleClose={handleCloseColumn}></ConfigColumn>

                    <DropdownMenu dropdownItem={dropdownItem ? dropdownItem : genderDropdownItem()} onColumnConfigChange={onColumnConfigChange} anchorEl={anchorElFunction} handleClose={handleCloseFunction} />
                    <ButtonFuntion spacingLeft={0} visible={visible.column} onClick={handleClickColumn} type={EButtonType.columnConfig} />
                    <ButtonFuntion spacingLeft={1} visible={visible.column} open={anchorElFilter} onClick={handleClickFilter} type={EButtonType.filter} />
                    <ButtonFuntion spacingLeft={1} visible={visible.function} onClick={handleClickFunction} type={EButtonType.function} />
                    <ButtonFuntion spacingLeft={1} visible={visible.add} onClick={onAddClick} type={EButtonType.add} />
                    <ButtonFuntion spacingLeft={1} visible={visible.delete} onClick={onDeleteClick} type={EButtonType.delete} />
                </div>
            </div>
            <Filter
                component={component}
                onApplyFilter={onApplyFilter}
                onColumnConfigChange={onColumnConfigChange}
                columnModel={columnModel}
                anchorEl={anchorElFilter}>
            </Filter>

        </div>
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