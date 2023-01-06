import React from "react"
import UploadIconImage from 'components/upload/uploadIconImage'
import Grid from "@mui/material/Grid"
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'

const LabelIconControl = (props) => {
    const { icon, name, color } = props

    return (
        <Grid className="label-control-container" container columnSpacing={2}>
            <Grid item>
                <UploadIconImage color={color} src={icon} />
            </Grid>
            <Grid item className="label-control-text">
                <Tooltip title={name}>
                    <Typography noWrap>{name}</Typography>
                </Tooltip>
            </Grid>
        </Grid>
    )
}

export default LabelIconControl