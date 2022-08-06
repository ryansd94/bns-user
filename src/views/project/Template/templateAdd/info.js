import React, { useEffect, useState } from "react"
import TextInput from "components/input/TextInput"
import Grid from "@mui/material/Grid"
import { EditorControl } from 'components/editor'

const InfoTemplate = React.memo((props) => {
    const { control } = props

    return (
        <Grid item xs={12} container spacing={2} >
            <Grid item xs={12}>
                <TextInput required={true} fullWidth={true} name={'name'} control={control} label="Tên mẫu" />
            </Grid>
            <Grid item xs={12}>
                <TextInput fullWidth={true} name={'description'} control={control} label="Mô tả" />
            </Grid>
        </Grid>
    )
})

export default InfoTemplate