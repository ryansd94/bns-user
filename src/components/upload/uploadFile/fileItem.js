import React, { useEffect, useState } from 'react'
import { FileHeader } from './'
import Grid from "@mui/material/Grid"

const FileItem = (props) => {
    const { file, onDelete } = props

    return (
        <Grid className='file-item' item style={{ width: '100%' }}>
            <FileHeader file={file} onDelete={onDelete} />
        </Grid>
    )
}

export default FileItem