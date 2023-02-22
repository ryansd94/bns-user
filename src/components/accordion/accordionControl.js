import React, { useState } from "react"
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import './styles.scss'
import { PopoverControl } from 'components/popover'
import { LabelControl } from 'components/label'

const AccordionControl = (props) => {

    const { title, name, details, isExpand, className = 'accordion-container', genderPopoverControl = null } = props
    const [expanded, setExpanded] = useState(isExpand ? name : '')
    const [showExpandIcon, setShowExpandIcon] = useState(!isExpand ? true : false)
    const [openPopover, setOpenPopover] = useState(null)

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : '')
    }

    const onMouseEnter = (event) => {
        setShowExpandIcon(true)
        if (genderPopoverControl) {
            handlePopoverOpen(event)
        }
    }

    const onMouseLeave = (event) => {
        setShowExpandIcon(expanded == '' ? true : false)
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

    return (
        <Accordion className={className} expanded={expanded === name} onChange={handleChange(name)}>
            <AccordionSummary
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                expandIcon={showExpandIcon ? <ExpandMoreIcon /> : ''}
                aria-controls={`${name}-content`}
                id={`${name}-header`}>
                <LabelControl
                    label={title}
                />
                {genderPopoverControl ? <PopoverControl isCLoseOnHover={true} genderBody={genderPopoverControl} onClose={handlePopoverClose} anchorEl={openPopover} /> : ''}
            </AccordionSummary>
            <AccordionDetails>
                {details}
            </AccordionDetails>
        </Accordion>
    )
}

export default AccordionControl