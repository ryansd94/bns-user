import React, { useState } from "react"
import Grid from "@mui/material/Grid"
import ButtonIcon from "components/button/ButtonIcon"
import { EButtonIconType } from 'configs'
import { PopoverControl } from 'components/popover'
import TemplateAddControl from './addControl'

const TooltipControl = React.memo((props) => {
    const { onAction, index, isLastControl, onAddControlSubmit, prefix, item } = props
    const [openPopover, setOpenPopover] = useState(null)

    const handlePopoverOpen = (event) => {
        setOpenPopover(event.currentTarget);
    }

    const handlePopoverClose = () => {
        setOpenPopover(null);
    }

    const genderPopoverControl = () => {
        return <TemplateAddControl onApply={onAddControlSubmit} prefix={prefix} index={index} item={item} />
    }

    return <Grid container spacing={1} style={{ padding: '0.5rem' }}>
        <Grid item>
            <ButtonIcon onClick={handlePopoverOpen} color="success" type={EButtonIconType.add} />
            <PopoverControl isCLoseOnHover={true} genderBody={genderPopoverControl} onClose={handlePopoverClose} anchorEl={openPopover} />
        </Grid>
        <Grid item>
            <ButtonIcon color="primary" disabled={index == 0 ? true : false} onClick={() => onAction(EButtonIconType.up)} type={EButtonIconType.up} />
        </Grid>
        <Grid item>
            <ButtonIcon color="primary" disabled={isLastControl ? true : false} onClick={() => onAction(EButtonIconType.down)} type={EButtonIconType.down} />
        </Grid>
        <Grid item>
            <ButtonIcon color="error" onClick={() => onAction(EButtonIconType.delete)} type={EButtonIconType.delete} />
        </Grid>
    </Grid>
})
export default TooltipControl