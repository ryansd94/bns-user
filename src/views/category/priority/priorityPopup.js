import React, { useEffect } from "react"
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
import { getByID, save } from "services"
import { ERROR_CODE, baseUrl } from "configs"
import { loading as loadingButton } from "stores/components/button"
import { message } from "configs"
import _ from "lodash"

const PriorityPopup = React.memo((props) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const {} = props
  const editData = useSelector((state) => state.master.editData)
  const openPopup = useSelector((state) => state.popup.open)
  const validationSchema = Yup.object().shape({
    name: Yup.string().required(t(message.error.fieldNotEmpty)),
  })
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
    await getByID(baseUrl.jm_priority, editData).then((res) => {
      setValue("id", res.data.id || "")
      setValue("name", res.data.name || "")
      setValue("description", res.data.description || "")
      setValue("color", res.data.color)
      dispatch(setLoadingPopup(false))
    })
  }

  const { control, handleSubmit, reset, setValue } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: defaultValues,
  })

  const onSubmit = async (data) => {
    dispatch(loadingButton(true))
    var postData = data
    if (!editData) postData.id = editData
    const res = await save(baseUrl.jm_priority, postData)
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

  function ModalBody() {
    return (
      <Grid container gap={2}>
        <Grid item xs={12}>
          <TextInput
            autoFocus={true}
            required={true}
            control={control}
            label={t("Priority")}
            name="name"
          />
        </Grid>
        <Grid item xs={12}>
          <ColorPickerControl
            control={control}
            label={t("Color")}
            name="color"
          />
        </Grid>
        <Grid item xs={12}>
          <TextInput
            control={control}
            label={t("Description")}
            name="description"
          />
        </Grid>
      </Grid>
    )
  }

  return (
    <div>
      <Popup
        reset={reset}
        ModalBody={ModalBody}
        widthSize={"sm"}
        onSave={handleSubmit(onSubmit)}
      />
    </div>
  )
})

export default PriorityPopup
