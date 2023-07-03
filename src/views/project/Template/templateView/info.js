import React from "react"
import TextInput from "components/input/TextInput"
import Grid from "@mui/material/Grid"
import { useTranslation } from "react-i18next"

const InfoTemplate = React.memo((props) => {
    const { control } = props
    const { t } = useTranslation()
    return (
        <Grid item xs={12} container gap={2} >
            <Grid item xs={12}>
                <TextInput required={true} name={'name'} control={control} label={"Template name"} />
            </Grid>
            <Grid item xs={12}>
                <TextInput name={'description'} control={control} label={t("Description")} />
            </Grid>
        </Grid>
    )
})

export default InfoTemplate