import React, { useEffect, useState } from "react"
import Grid from "@mui/material/Grid"
import SingleAddSelect from "components/select/SingleAddSelect"
import TextInput from "components/input/TextInput"
import { useTranslation } from "react-i18next"

const InfoTab = (props) => {
    const { t } = useTranslation()
    const { control, dataTeam } = props

    return <Grid container gap={2}>
        <Grid item xs={12}>
            <TextInput
                autoFocus={true}
                required={true}
                control={control}
                label={t("Team name")}
                name="name"
            />
        </Grid>
        <Grid item xs={12}>
            <TextInput
                control={control}
                label={t("Description")}
                name="description"
            />
        </Grid>
        <Grid item xs={12}>
            <SingleAddSelect
                data={dataTeam}
                control={control}
                name="parentId"
                label={t("Team parent")}
            />
        </Grid>
    </Grid>
}

export default InfoTab