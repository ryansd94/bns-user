import React, { useState } from "react"
import { styled } from '@mui/material/styles'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import Typography from '@mui/material/Typography'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import './styles.scss'
import { PopoverControl } from 'components/popover'
import { LabelControl } from 'components/label'


const MuiAccordion = styled((props) => (
    <Accordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
    border: `1px solid ${theme.palette.divider}`,
    '&:not(:last-child)': {
        borderBottom: 0,
    },
    '&:before': {
        display: 'none',
    },
}))

const MuiAccordionSummary = styled((props) => (
    <AccordionSummary
        {...props}
    />
))(({ theme }) => ({
    backgroundColor:
        theme.palette.mode === 'dark'
            ? 'rgba(255, 255, 255, .05)'
            : 'rgba(0, 0, 0, .03)',
    flexDirection: 'row-reverse',
    '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
        transform: 'rotate(90deg)',
    },
    '& .MuiAccordionSummary-content': {
        marginLeft: theme.spacing(1),
    },
}))

const MuiAccordionDetails = styled(AccordionDetails)(({ theme }) => ({
    padding: 0,
    // borderTop: '1px solid rgba(0, 0, 0, .125)',
}))

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
        setOpenPopover(event.currentTarget);
    }

    const handlePopoverClose = () => {
        setOpenPopover(null);
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