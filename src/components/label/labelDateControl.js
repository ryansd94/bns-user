import React from "react"
import Grid from "@mui/material/Grid"
import { OverflowTip } from 'components/tooltip'
import { IconHour } from 'components/icon/icon'

const LabelDateControl = (props) => {
    const { name, id, value, className } = props

    const genderTooltipContent = () => {
        return <Grid className="label-icon-control-container" item container gap={1}>
            <Grid item>
                <IconHour />
            </Grid>
            <Grid item>
                <span style={{ textOverflow: 'ellipsis' }}>{value}</span>
            </Grid>
        </Grid>
    }

    return (
        <Grid item className={`label-icon-control-text ${className}`}>
            <OverflowTip disableHoverListener={false} value={name} genderTooltipContent={genderTooltipContent} />
        </Grid>
    )
}

export default LabelDateControl