import React, { useState, useEffect } from 'react'
import Grid from "@mui/material/Grid"
import Typography from '@mui/material/Typography'
import { IconDelete } from "components/icon/icon"

const TagItem = React.memo(props => {
    const { tagItem = {}, onDeleteTagClick } = props

    const onClick = () => {
        onDeleteTagClick(tagItem)
    }

    return <Grid className='tag-item-container' item>
            <Typography className={tagItem.name.length > 24 ? 'tag-item ellipsis' : 'tag-item'}>{tagItem.name}</Typography>
            <IconDelete onClick={onClick} />
        </Grid>
})

export default TagItem
