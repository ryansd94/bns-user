import React, { useState } from "react"
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import FullscreenIcon from '@mui/icons-material/Fullscreen'
import './styles.scss'
import { PopoverControl } from 'components/popover'
import { LabelControl } from 'components/label'
import { FullScreen, useFullScreenHandle } from "react-full-screen"

const AccordionControl = (props) => {

    const { title, name, details, isExpand, className = 'accordion-container',
        genderPopoverControl = null, isFullScreen = false, required } = props
    const [expanded, setExpanded] = useState(isExpand ? name : '')
    const [showIcon, setShowIcon] = useState(!isExpand ? true : false)
    const [openPopover, setOpenPopover] = useState(null)
    const handle = useFullScreenHandle()

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : '')
    }

    const onMouseEnter = (event) => {
        setShowIcon(true)
        if (genderPopoverControl) {
            handlePopoverOpen(event)
        }
    }

    const onMouseLeave = (event) => {
        setShowIcon(expanded == '' ? true : false)
        if (genderPopoverControl) {
            handlePopoverClose(event)
        }
    }

    const handlePopoverOpen = (event) => {
        setOpenPopover(event.currentTarget)
    }

    const handlePopoverClose = () => {
        setOpenPopover(null)
    }

    const onFullScreen = (event) => {
        event.stopPropagation()
        handle.enter()
    }

    return (
        <FullScreen handle={handle}>
            <Accordion className={className} expanded={expanded === name} onChange={handleChange(name)}>
                <AccordionSummary
                    onMouseEnter={onMouseEnter}
                    onMouseLeave={onMouseLeave}
                    expandIcon={showIcon ? <ExpandMoreIcon /> : ''}
                    aria-controls={`${name}-content`}
                    id={`${name}-header`}>
                    <LabelControl
                        required={required}
                        label={title}
                    />
                    {isFullScreen && showIcon ? <FullscreenIcon onClick={onFullScreen} /> : ''}
                    {/* {showExpandIcon ? expanded === name ? <ExpandLessIcon /> : <ExpandMoreIcon /> : ''} */}
                    {genderPopoverControl ? <PopoverControl isCLoseOnHover={true} genderBody={genderPopoverControl} onClose={handlePopoverClose} anchorEl={openPopover} /> : ''}
                </AccordionSummary>
                <AccordionDetails>
                    {details}
                </AccordionDetails>
            </Accordion>
        </FullScreen>
    )
}

export default AccordionControl