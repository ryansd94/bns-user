import Button from "@mui/material/Button"
import Grid from "@mui/material/Grid"
import React from 'react'

const FileHeader = (props) => {
    const { file, onDelete } = props

    return (
        <Grid container alignItems="center">
            <Grid item></Grid>
            <Grid item>
                <Button size="small" onClick={() => onDelete(file)}>
                    Delete
                </Button>
            </Grid>
        </Grid>
    )

}
export default FileHeader