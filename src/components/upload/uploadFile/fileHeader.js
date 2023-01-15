import { Button, Grid } from '@material-ui/core';
import React from 'react';

const FileHeader = (props) => {
    const { file, onDelete } = props

    return (
        <Grid container alignItems="center">
            <Grid item>{file.name}</Grid>
            <Grid item>
                <Button size="small" onClick={() => onDelete(file)}>
                    Delete
                </Button>
            </Grid>
        </Grid>
    );

}
export default FileHeader