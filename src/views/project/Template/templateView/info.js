import React from "react"
import TextInput from "components/input/TextInput"
import Grid from "@mui/material/Grid"

const InfoTemplate = React.memo((props) => {
    const { control } = props
    return (
        <Grid item xs={12} container gap={2} >
            <Grid item xs={12}>
                <TextInput required={true} name={'name'} control={control} label="Tên mẫu" />
            </Grid>
            <Grid item xs={12}>
                <TextInput name={'description'} control={control} label="Mô tả" />
            </Grid>
        </Grid>
    )
})

export default InfoTemplate