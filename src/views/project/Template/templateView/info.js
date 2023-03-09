import React, { useEffect, useState } from "react"
import TextInput from "components/input/TextInput"
import Grid from "@mui/material/Grid"
import { EditorControl } from 'components/editor'

const InfoTemplate = React.memo((props) => {
    const { control, dataTemplate = null } = props
    return (
        <Grid item xs={12} container spacing={2} >
            <Grid item xs={12}>
                <TextInput defaultValue={dataTemplate && dataTemplate.name} required={true} name={'name'} control={control} label="Tên mẫu" />
            </Grid>
            <Grid item xs={12}>
                <TextInput defaultValue={dataTemplate && dataTemplate.description} name={'description'} control={control} label="Mô tả" />
            </Grid>
        </Grid>
    )
})

export default InfoTemplate