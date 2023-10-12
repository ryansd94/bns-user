import React, { useEffect, useState } from 'react'
import ButtonFuntion from 'components/button/ButtonFuntion'
import { EButtonType, EButtonIconType, ESize } from 'configs/enums'
import { PopperControl } from 'components/popover'
import PopupContent from 'components/popup/popupContent'
import { useTranslation } from 'react-i18next'
import StatusItem from 'views/category/status/statusItem'
import Grid from "@mui/material/Grid"
import { IconHide, IconUnhide } from 'components/icon/icon'
import ButtonIcon from 'components/button/ButtonIcon'

const TaskButtonSetting = (props) => {
    const { listStatus = [] } = props
    const [anchorEl, setAnchorEl] = React.useState(null)
    const open = Boolean(anchorEl)
    const { t } = useTranslation()

    const onClick = (event) => {
        setAnchorEl(event.currentTarget)
    }

    const onClose = () => {
        setAnchorEl(null)
    }

    const renderListStatus = () => {
        return <Grid container item gap={2} xs direction='column'>{
            _.map(listStatus, (item) => {
                return <Grid item justifyContent={'space-between'} key={item.id} xs container>
                    <Grid item>
                        <StatusItem status={item} />
                    </Grid>
                    <Grid item>
                        <ButtonIcon size={ESize.small} type={EButtonIconType.unhide} />
                    </Grid>
                </Grid>
            })
        }
        </Grid>
    }

    const renderPopupContent = () => {
        return <div>
            {renderListStatus()}
        </div>
    }

    const handleSave = () => {

    }

    return <>
        <ButtonFuntion onClick={onClick} isTextAndIcon={false} spacingLeft={1} type={EButtonType.setting} />
        {open ? <PopperControl
            anchorEl={anchorEl}
            className='popper-task-settings'
        >
            <PopupContent handleSave={handleSave} onClose={onClose} id='popper-task-settings' title={t('Setting')} isShowFooter={true} ModalBody={renderPopupContent} />
        </PopperControl> : ''}
    </>

}

export default TaskButtonSetting