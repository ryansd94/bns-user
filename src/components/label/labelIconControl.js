import React from "react"
import UploadIconImage from 'components/upload/uploadIcon/uploadIconImage'
import Grid from "@mui/material/Grid"
import { OverflowTip } from 'components/tooltip'

const LabelIconControl = (props) => {
    const { icon, name, color, id } = props

    const genderTooltipContent = () => {
        return <span style={{ textOverflow: 'ellipsis' }}>{name}</span>
    }

    return (
        <Grid className="label-icon-control-container" item container columnSpacing={2}>
            <Grid item>
                <UploadIconImage color={color} src={icon} />
            </Grid>
            <Grid item xs={12} className="label-icon-control-text">
                <OverflowTip value={name} genderTooltipContent={genderTooltipContent} />
            </Grid>
        </Grid>
    )
}

export default LabelIconControl