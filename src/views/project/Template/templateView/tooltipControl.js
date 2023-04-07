import React, { useState } from "react"
import Grid from "@mui/material/Grid"
import ButtonIcon from "components/button/ButtonIcon"
import { EButtonIconType } from 'configs'
import { PopoverControl } from 'components/popover'
import AddControl from './addControl'
import SettingControl from './settingControl'

const TooltipControl = React.memo((props) => {
    const { onAction, index, isLastControl, onAddControlSubmit,
        onSettingSubmit, prefix, item, templateColumnData = [], field } = props
    const [openAdd, setOpenAdd] = useState(null)
    const [openSetting, setOpenSetting] = useState(null)

    const handleAddOpen = (event) => {
        setOpenAdd(event.currentTarget);
    }

    const handleAddClose = () => {
        setOpenAdd(null);
    }

    const handleSettingOpen = (event) => {
        setOpenSetting(event.currentTarget);
    }

    const handleSettingClose = (data, index, prefix, item) => {
        setOpenSetting(null)
        onSettingSubmit(data, index, prefix, item, field)
    }

    const onAddControl = (data, index, prefix, item) => {
        onAddControlSubmit(data, index, prefix, item, field)
    }

    const renderAddControl = () => {
        return <AddControl templateColumnData={templateColumnData} onApply={onAddControl} prefix={prefix} index={index} item={item} />
    }

    const renderSettingControl = () => {
        return <SettingControl onApply={(data, index, prefix, item) => handleSettingClose(data, index, prefix, item)} prefix={prefix} index={index} item={item} />
    }

    return <Grid container gap={2} style={{ padding: '1rem' }}>
        <Grid item>
            <ButtonIcon onClick={handleAddOpen} color="success" type={EButtonIconType.add} />
            <PopoverControl isCLoseOnHover={true} genderBody={renderAddControl} onClose={handleAddClose} anchorEl={openAdd} />
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
        <Grid item>
            <ButtonIcon onClick={handleSettingOpen} type={EButtonIconType.setting} />
            <PopoverControl isCLoseOnHover={true} genderBody={renderSettingControl} onClose={handleSettingClose} anchorEl={openSetting} />
        </Grid>
    </Grid>
})
export default TooltipControl