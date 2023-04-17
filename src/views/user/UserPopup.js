import React, { useEffect, useState, useMemo, useCallback } from "react"
import Popup from "components/popup/Popup"
import Grid from "@mui/material/Grid"
import MultiSelectText from "components/select/MultiSelectText"
import { useTranslation } from "react-i18next"
import { useSelector, useDispatch } from "react-redux"
import * as Yup from "yup"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { close } from "components/popup/popupSlice"
import { openMessage } from "stores/components/snackbar"
import {
  setReload,
  setEditData,
} from "stores/views/master"
import { post } from "services"
import { ERROR_CODE, baseUrl } from "configs"
import { loading as loadingButton } from "stores/components/button"

const UserPopup = React.memo((props) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const openPopup = useSelector((state) => state.popup.open)
  const validationSchema = Yup.object().shape({
    // name: Yup.string().required(t(message.error.fieldNotEmpty)),
  })
  const defaultValues = {
    emails: [],
  }

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: defaultValues,
  })
  const onSubmit = async (data) => {
    // alert(JSON.stringify(data))
    // return
    dispatch(loadingButton(true))
    const res = await post(`${baseUrl.jm_user}/add-user`, data)
    dispatch(loadingButton(false))
    dispatch(openMessage({ ...res }))
    if (res.errorCode == ERROR_CODE.success) {
      dispatch(setEditData(null))
      dispatch(setReload())
      dispatch(close())
    }
  }
  function ModalBody() {
    return (
      <Grid container rowSpacing={2}>
        <Grid item xs={12}>
          <span className="text-note">
            {t(
              "Nhập Email người dùng bạn muốn thêm vào hệ thống, bấm Enter để thêm nhiều người dùng. Hệ thống sẽ gửi email xác nhận đến email của người dùng"
            )}
          </span>
          <MultiSelectText
            control={control}
            name="emails"
            label={t("Email người dùng")}
            placeholder={t("Nhập Email người dùng")}
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

export default UserPopup
