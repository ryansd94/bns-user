import Grid from "@mui/material/Grid"
import TextInput from "components/input/TextInput"
import { useTranslation } from "react-i18next"
import { UploadIcon } from 'components/upload'
import _ from 'lodash'
import { DatePickerInput } from 'components/datepicker'
import { EditorControl } from 'components/editor'

const ProjectCreateContent = (props) => {
    const { control } = props
    const { t } = useTranslation()
    return (
        <Grid container gap={2}>
            <Grid item xs={12}>
                <TextInput
                    autoFocus={true}
                    required={true}
                    control={control}
                    label={t("Project name")}
                    name="name"
                />
            </Grid>
            <Grid item xs={12}>
                <TextInput
                    required={true}
                    control={control}
                    label={t("Project code")}
                    name="code"
                />
            </Grid>
            <Grid item xs={12}>
                <UploadIcon
                    label={t("Icon")}
                    control={control}
                    name="icon"
                />
            </Grid>
            <Grid item container direction={'row'} gap={2}>
                <Grid item xs>
                    <DatePickerInput
                        label={t("Start date")}
                        control={control}
                        name={`startDate`} />
                </Grid>
                <Grid item xs>
                    <DatePickerInput
                        label={t("End date")}
                        control={control}
                        name={`endDate`} />
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <EditorControl
                    control={control}
                    isFullScreen={true}
                    label={t("Description")}
                    name="description"
                    isShowAccordion={true} />
            </Grid>
        </Grid>
    )
}

export default ProjectCreateContent