import Grid from "@mui/material/Grid"
import TextInput from "components/input/TextInput"
import { useTranslation } from "react-i18next"
import { UploadIcon } from 'components/upload'
import _ from 'lodash'
import { DatePickerInput } from 'components/datepicker'
import { EditorControl } from 'components/editor'

const ProjectSprintTab = (props) => {
    const { control } = props
    const { t } = useTranslation()

    return <Grid container gap={2}>
        <Grid item xs={12}>
            
        </Grid>
    </Grid>
}

export default ProjectSprintTab