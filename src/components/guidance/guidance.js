import React, { useEffect, useState } from "react"
import Grid from "@mui/material/Grid"
import { EPosition, EAlertType, EGuidanceContentType } from "configs"
import { Alert } from 'components/alert'
import { IconInfo } from "components/icon/icon"
import { PopoverControl } from 'components/popover'
import _ from 'lodash'

const Guidance = (props) => {
    const { guidance = null, element } = props
    const [anchorEl, setAnchorEl] = useState(null)

    const renderIconGuidance = () => {
        return <div onMouseEnter={handlePopoverOpen}
            onMouseLeave={handlePopoverClose}><IconInfo className='icon-guidance'/></div>
    }

    const handlePopoverOpen = (event) => {
        setAnchorEl(event.currentTarget)
    }

    const handlePopoverClose = () => {
        setAnchorEl(null)
    }

    const renderGuidanceContent = (content, type, contentType) => {
        if (contentType === EGuidanceContentType.icon) {
            return <>
                {renderIconGuidance()}
                <PopoverControl
                    anchorEl={anchorEl}
                    onClose={handlePopoverClose}
                    genderBody={() => { return <Alert className='alert-guidance' type={type} message={content} /> }}
                >
                </PopoverControl>
            </>
        }
        return <Alert type={type} message={content} />
    }

    const renderContent = () => {
        if (_.isNil(guidance)) {
            return element
        }
        const position = guidance.position || EPosition.top
        const content = guidance.content
        const type = guidance.type || EAlertType.info
        const contentType = guidance.contentType || EGuidanceContentType.icon

        if (position === EPosition.top) {
            return <Grid container gap={2} direction='column'>
                <Grid container gap={2} direction='row'>
                    {renderGuidanceContent(content, type, contentType)}
                </Grid>
                <Grid container gap={2} direction='row'>
                    <Grid item>
                        {element}
                    </Grid>
                </Grid>
            </Grid>
        } else if (position === EPosition.right) {
            return <Grid container gap={2} direction='column'>
                <Grid container gap={2} direction='row' alignItems='center'>
                    <Grid item>
                        {element}
                    </Grid>
                    <Grid item>
                        {renderGuidanceContent(content, type, contentType)}
                    </Grid>
                </Grid>
            </Grid>

        }
    }
    return renderContent()
}
export default Guidance