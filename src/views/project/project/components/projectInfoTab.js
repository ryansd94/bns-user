import Grid from "@mui/material/Grid"
import TextInput from "components/input/TextInput"
import { useTranslation } from "react-i18next"
import { UploadIcon } from "components/upload"
import _ from "lodash"
import { DatePickerInput } from "components/datepicker"
import { EditorControl } from "components/editor"
import { RadioGroupControl } from "components/radio"
import { EProjectTypeOption } from "configs"

const ProjectInfoTab = (props) => {
  const { control, onTypeChange, onValueChange } = props
  const { t } = useTranslation()
  const typeOptions = [
    {
      id: EProjectTypeOption.basic,
      label: t("Basic"),
      guidance: t("The project are not phased"),
    },
    {
      id: EProjectTypeOption.phase,
      label: t("Phase"),
      guidance: t("The project is divided into several different phases"),
    },
  ]

  return (
    <Grid container gap={2}>
      <Grid item xs={12}>
        <TextInput
          autoFocus={true}
          required={true}
          control={control}
          label={t("Project name")}
          name="name"
          onChange={onValueChange}
        />
      </Grid>
      <Grid item xs={12}>
        <TextInput
          required={true}
          control={control}
          label={t("Project code")}
          name="code"
          onChange={onValueChange}
        />
      </Grid>
      <Grid item>
        <RadioGroupControl
          onChange={onTypeChange}
          isShowGuidance={true}
          label={t("Type")}
          options={typeOptions}
          control={control}
          name="type"
        />
      </Grid>
      <Grid item xs={12}>
        <UploadIcon
          label={t("Icon")}
          control={control}
          name="icon"
          onChange={onValueChange}
        />
      </Grid>
      <Grid item container direction={"row"} gap={2}>
        <Grid item xs>
          <DatePickerInput
            label={t("Start date")}
            control={control}
            onChange={onValueChange}
            name={`startDate`}
          />
        </Grid>
        <Grid item xs>
          <DatePickerInput
            label={t("End date")}
            control={control}
            onChange={onValueChange}
            name={`endDate`}
          />
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <EditorControl
          control={control}
          isFullScreen={true}
          label={t("Description")}
          onChange={onValueChange}
          name="description"
          isShowAccordion={true}
        />
      </Grid>
    </Grid>
  )
}

export default ProjectInfoTab
