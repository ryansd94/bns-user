import React, { useEffect, useState, useMemo, useCallback } from "react"
import Popup from "components/popup/Popup"
import Grid from "@mui/material/Grid"
import { ColorPickerControl } from "components/colorPicker"
import TextInput from "components/input/TextInput"
import { useTranslation } from "react-i18next"
import { useSelector, useDispatch } from "react-redux"
import * as Yup from "yup"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { open, change_title, close } from "components/popup/popupSlice"
import { openMessage } from "stores/components/snackbar"
import { setLoadingPopup, setReload, setEditData } from "stores/views/master"
import { getByID, save2 } from "services"
import { ERROR_CODE, baseUrl, EControlType } from "configs"
import { loading as loadingButton } from "stores/components/button"
import { message } from "configs"
import { CheckBoxControl } from "components/checkbox"
import { setValuesData } from "helpers"
import DiffTracker from "helpers/diffTracker"
import eventEmitter from "helpers/eventEmitter"
import _ from "lodash"

const StatusPopup = (props) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const {} = props
  const editData = useSelector((state) => state.master.editData)
  const openPopup = useSelector((state) => state.popup.open)
  const validationSchema = Yup.object().shape({
    name: Yup.string().required(t(message.error.fieldNotEmpty)),
  })
  const [statusStartDisable, setStatusStartDisable] = useState(false)
  const [statusEndDisable, setStatusEndDisable] = useState(false)
  const popupId = "popup-status"

  const defaultValues = {
    name: "",
    description: "",
    color: "",
    id: "",
  }

  useEffect(() => {
    onEditClick()
  }, [openPopup])

  const onEditClick = async () => {
    if (!editData) return
    dispatch(change_title(t("Edit status")))
    dispatch(setLoadingPopup(true))
    dispatch(open())
    await getByID(baseUrl.jm_status, editData).then((res) => {
      setValuesData(setValue, res.data)
      dispatch(setLoadingPopup(false))
    })
  }

  const { control, handleSubmit, reset, setValue, getValues } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: defaultValues,
  })

  const onSubmit = async (data) => {
    dispatch(loadingButton(true))
    let saveData = _.cloneDeep({ ...data })
    if (!_.isNil(editData)) {
      saveData = {}
      saveData.id = editData
      saveData.changeFields = data.changeFields
    }
    const res = await save2(baseUrl.jm_status, saveData)
    dispatch(loadingButton(false))
    dispatch(openMessage({ ...res }))
    if (res.errorCode == ERROR_CODE.success) {
      dispatch(setEditData(null))
      dispatch(setReload())
      reset()
      if (!_.isEmpty(editData)) {
        dispatch(close())
      }
    }
  }

  const onStatusStartChange = ({ value, name }) => {
    setStatusEndDisable(value)
    onValueChange({ value, name })
  }

  const onStatusEndChange = ({ value, name }) => {
    setStatusStartDisable(value)
    onValueChange({ value, name })
  }

  const onValueChange = ({
    value,
    name,
    type = EControlType.textField,
    isDelete = false,
  }) => {
    DiffTracker.onValueChange({
      editData,
      value,
      name,
      type,
      isDelete,
      getValues,
      setValue,
      eventEmitter,
      buttonId: popupId,
    })
  }

  function ModalBody() {
    return (
      <Grid container gap={2} item xs direction="column">
        <Grid item xs>
          <TextInput
            autoFocus={true}
            required={true}
            control={control}
            label={t("Status name")}
            name="name"
            onChange={onValueChange}
          />
        </Grid>
        <Grid item xs>
          <ColorPickerControl
            control={control}
            label={t("Color")}
            name="color"
            onChange={onValueChange}
          />
        </Grid>
        <Grid item xs container gap={2} direction="row">
          <Grid item xs>
            <CheckBoxControl
              guidance={{ content: t("The status indicates task started") }}
              disabled={statusStartDisable}
              onChange={onStatusStartChange}
              control={control}
              label={t("Start status")}
              name="isStatusStart"
            />
          </Grid>
          <Grid item xs>
            <CheckBoxControl
              guidance={{ content: t("The status indicates task completed") }}
              disabled={statusEndDisable}
              onChange={onStatusEndChange}
              control={control}
              label={t("End status")}
              name="isStatusEnd"
            />
          </Grid>
        </Grid>
        <Grid item xs>
          <CheckBoxControl
            guidance={{
              content: t(
                "Automatically added to the status list when creating a new the task template",
              ),
            }}
            control={control}
            label={t("Automatically added")}
            name="isAutomaticAdd"
            onChange={onValueChange}
          />
        </Grid>
        <Grid item xs>
          <CheckBoxControl
            guidance={{
              content: t(
                "when the checkbox is selected, this status will automatically be added to the status list of all task types",
              ),
            }}
            control={control}
            label={t("Applied to all types of tasks")}
            name="isApplyAll"
            onChange={onValueChange}
          />
        </Grid>
        <Grid item xs>
          <TextInput
            control={control}
            label={t("Description")}
            name="description"
            onChange={onValueChange}
          />
        </Grid>
      </Grid>
    )
  }
  return (
    <div>
      <Popup
        id={popupId}
        disabledSave={!_.isEmpty(editData) ? true : false}
        reset={reset}
        ModalBody={ModalBody}
        widthSize={"sm"}
        onSave={handleSubmit(onSubmit)}
      />
    </div>
  )
}

export default StatusPopup
