import React, { useEffect, useState } from "react"
import Grid from "@mui/material/Grid"
import { OverflowTip } from 'components/tooltip'
import { IconHour } from 'components/icon/icon'
import { IconDescription } from 'components/icon/icon'
import { PopoverControl } from 'components/popover'
import { EditorControl } from 'components/editor'

const TaskNoteItem = (props) => {
    const { item } = props

    const [openPopover, setOpenPopover] = useState(null)

    const handlePopoverClose = () => {
        setOpenPopover(null)
    }

    const genderPopoverControl = () => {
        return <EditorControl readOnly={true} isFullScreen={true} value={item?.description} name={'description'} isShowAccordion={false} />
    }
    const handlePopoverOpen = (event) => {
        setOpenPopover(event.currentTarget)
    }

    return <div>
        <IconDescription onClick={handlePopoverOpen} />
        <PopoverControl className='pop-delete-comment' isHideWhenWithOutFocus={false} genderBody={genderPopoverControl} onClose={handlePopoverClose} anchorEl={openPopover} />
    </div>
}

export default TaskNoteItem