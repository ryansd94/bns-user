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
        onColumnConfigChange, onApplyFilter, component, genarateCustomButton } = props
    const [anchorElColumn, setAnchorElColumn] = React.useState(null)
    const [anchorElFilter, setAnchorElFilter] = React.useState(false)

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

    return (
        <div>
            <div className="row">
                <div className="col-md-12 grid-margin  justify-content-end">
                    <ConfigColumn onColumnConfigChange={onColumnConfigChange} columnModel={columnModel} anchorEl={anchorElColumn} handleClose={handleCloseColumn}></ConfigColumn>
                    <ButtonFuntion spacingLeft={0} visible={visible.column} onClick={handleClickColumn} type={EButtonType.columnConfig} />
                    <ButtonFuntion spacingLeft={1} visible={visible.column} open={anchorElFilter} onClick={handleClickFilter} type={EButtonType.filter} />
                    <DropdownMenu  visible={visible.function} type={EButtonType.function} genderDropdownItem={genderDropdownItem} />
                    <ButtonFuntion spacingLeft={1} visible={visible.add} onClick={onAddClick} type={EButtonType.add} />
                    <ButtonFuntion spacingLeft={1} visible={visible.delete} onClick={onDeleteClick} type={EButtonType.delete} />
                    {genarateCustomButton && genarateCustomButton()}
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