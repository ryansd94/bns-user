import React, { useEffect, useState } from 'react'
import { FileHeader } from './'
import Grid from "@mui/material/Grid"
import LinearProgress from "@mui/material/LinearProgress"
import { uploadFile } from 'helpers'

const SingleFileUploadWithProgress = (props) => {
    const { file,
        onDelete,
        onUpload } = props

    const [progress, setProgress] = useState(0)

    useEffect(() => {
        if (file.isAddNew === true) {
            async function upload() {
                const url = await uploadFile(file.file, setProgress)
                onUpload(file.file, url)
            }

            upload()
        }
    }, [])

    return (
        <Grid className='file-item' item style={{ width: '100%' }}>
            <FileHeader file={file} onDelete={onDelete} />
            {file.isAddNew === true ? <LinearProgress variant="determinate" value={progress} /> : ''}
        </Grid>
    )
}

export default SingleFileUploadWithProgress