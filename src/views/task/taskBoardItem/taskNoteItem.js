import React, { useEffect, useState } from "react"
import Grid from "@mui/material/Grid"
import { OverflowTip } from 'components/tooltip'
import { IconDescription } from 'components/icon/icon'
import { PopoverControl } from 'components/popover'
import { EditorControl } from 'components/editor'
import ClickAwayListener from '@mui/material/ClickAwayListener'

const TaskNoteItem = (props) => {
    const { item, title } = props

    const [openPopover, setOpenPopover] = useState(null)
    const [isShow, setIsShow] = useState(null)
    const handlePopoverClose = () => {
        setOpenPopover(null)
    }
    
    const genderPopoverControl = () => {
        return <EditorControl isShowPlaceholder={false} className='editor-popover' readOnly={true} isFullScreen={true} value={item?.description} name={'description'} isShowAccordion={false} />
    }

    const handlePopoverOpen = (event) => {
        setIsShow(false)
        setOpenPopover(event.currentTarget)
    }

    const genderTooltip = (item) => {
        return <div>
            <IconDescription className={'cursor-pointer'} onClick={handlePopoverOpen} />
            <PopoverControl isHideWhenWithOutFocus={false} genderBody={genderPopoverControl} onClose={handlePopoverClose} anchorEl={openPopover} />
        </div >
    }
    return <OverflowTip disableHoverListener={false} value={title} genderTooltipContent={() => genderTooltip(item)} />

}

export default TaskNoteItem