import * as React from 'react'
import Grid from "@mui/material/Grid"

const Group = (props) => {
    const { title, content } = props
    return (
        <Grid container className='group-container' direction='column'>
            <Grid item className='group-header'>{title}</Grid>
            <Grid item className='body-content'>{content}</Grid>
        </Grid>
    )
}
export default Group