import { createStyles, withStyles } from '@material-ui/core'
import Typography from "@mui/material/Typography"
import LinearProgress from "@mui/material/LinearProgress"
import React from 'react'
import { FileHeader } from './'


const ErrorLinearProgress = withStyles((theme) =>
    createStyles({
        bar: {
            backgroundColor: theme.palette.error.main,
        },
    })
)(LinearProgress)

const UploadError = (props) => {
    const { file, onDelete, errors } = props
    return (
        <div>
            <FileHeader file={file} onDelete={onDelete} />
            <ErrorLinearProgress variant="determinate" value={100} />
            {errors.map((error) => (
                <div key={error.code}>
                    <Typography color="error">{error.message}</Typography>
                </div>
            ))}
        </div>
    )
}

export default UploadError