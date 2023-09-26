import React, { useState, useEffect, useCallback } from "react"
import ButtonFuntion from 'components/button/ButtonFuntion'
import { EButtonType } from 'configs/enums'
import { PopoverControl } from 'components/popover'
import { Filter } from 'components/filter'
import Grid from "@mui/material/Grid"
import ClickAwayListener from '@mui/material/ClickAwayListener'
import Box from '@mui/material/Box'

const GridSelectFilter = (props) => {
    const { visibleObject, onApplyFilter, onColumnConfigChange, columnModel, filterModels = '' } = props
    const [anchorElFilter, setAnchorElFilter] = useState(false)

    const handleClickFilter = (event) => {
        if (anchorElFilter) {
            handleClose()
        } else {
            setAnchorElFilter(event.currentTarget)
        }
    }

    const handleClose = () => {
        setAnchorElFilter(null)
    }

    const handleApplyFiler = (filters) => {
        setAnchorElFilter(null)
        onApplyFilter(filters)
    }

    const renderPopoverControl = () => {
        return <Filter
            filterModels={!_.isEmpty(filterModels) ? JSON.parse(filterModels) : []}
            isChangeUrlWhenApplyFilters={false}
            isSaveFilter={false}
            onApplyFilter={handleApplyFiler}
            onColumnConfigChange={onColumnConfigChange}
            columnModel={columnModel}
            anchorEl={anchorElFilter}>
        </Filter>
    }

    return <Grid item container gap={2} direction='column'>
        <Grid item>
            <ButtonFuntion spacingLeft={1} visible={visibleObject?.column} open={anchorElFilter} onClick={handleClickFilter} type={EButtonType.filter} />
        </Grid>
        <ClickAwayListener onClickAway={handleClose}>
            <Box>
                <Grid item>
                    <PopoverControl id={'popoverGridSelectFilter'} genderBody={renderPopoverControl} onClose={handleClose} anchorEl={anchorElFilter} />
                </Grid>
            </Box>
        </ClickAwayListener>
    </Grid>
}
export default GridSelectFilter