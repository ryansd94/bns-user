import React, { useEffect, useState } from "react"
import Popup from "components/popup/Popup"
import Grid from "@mui/material/Grid"
import SingleAddSelect from "components/select/SingleAddSelect"
import PropTypes from "prop-types"
import MultiSelect from "components/select/MultiSelect"
import TextInput from "components/input/TextInput"
import { useTranslation } from "react-i18next"
import { useSelector, useDispatch } from "react-redux"
import * as Yup from "yup"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { open, change_title } from "components/popup/popupSlice"
import { openMessage } from "stores/components/snackbar"
import {
  setLoadingPopup,
  setReload,
} from "stores/views/master"
import { getByID, save, get } from "services"
import { ERROR_CODE, baseUrl } from "configs"
import { loading as loadingButton } from "stores/components/button"

import { message } from "configs"
const TeamPopup = React.memo((props) => {
  console.log("render TeamPopup")
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const editData = useSelector((state) => state.master.editData)
  const isReload = useSelector((state) => state.master.isReload)
  const [dataTeam, setDataTeam] = useState([])
  const [dataUser, setDataUser] = useState([])
  const validationSchema = Yup.object().shape({
    name: Yup.string().required(t(message.error.fieldNotEmpty)),
  })

  const defaultValues = {
    name: "",
    description: "",
    parentId: null,
    id: "",
    members: [],
  }

  const fetchDataTeam = async () => {
    await get(baseUrl.jm_team, {
      draw: 0,
      start: 0,
      length: 10000,
    }).then((data) => {
      setDataTeam(data && data.data && data.data.items)
    })
  }

  useEffect(() => {
    if (isReload != null) {
      fetchDataTeam()
    }
  }, [isReload])

  useEffect(() => {
    fetchDataTeam()
  }, [])

  useEffect(() => {
    if (editData) {
      onEditClick()
    }
  }, [editData])

  const fetchDataUser = async () => {
    await get(`${baseUrl.jm_team}/users`, {
      draw: 0,
      start: 0,
      length: 10000,
    }).then((data) => {
      const users =
        data &&
        data.data &&
        data.data.items.map((item, index) => ({
          name: item.email,
          id: item.id,
        }))
      setDataUser(users)
    })
  }

  useEffect(() => {
    fetchDataUser()
  }, [])

  const onEditClick = async () => {
    if (!editData) return
    dispatch(change_title(t("Edit team")))
    dispatch(setLoadingPopup(true))
    dispatch(open())
    await getByID(baseUrl.jm_team, editData).then((res) => {
      //dispatch(setEditData(res.data))
      setValue("id", res.data.id || "")
      setValue("name", res.data.name || "")
      setValue("description", res.data.description || "")
      setValue(
        "parentId",
        res.data.parentId
      )
      if (res.data.teamMembers != null) {
        var teamMembers = []
        res.data.teamMembers.map((item, index) => {
          teamMembers.push(dataUser.find((d) => d.id == item))
        })
        setValue("members", teamMembers)
        //setValue("members2", teamMembers )
      }
      dispatch(setLoadingPopup(false))
    })
  }

  const {
    control,
    handleSubmit,
    reset,
    setValue,
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: defaultValues,
  })

  const onSubmit = async (data) => {
    dispatch(loadingButton(true))
    var postData = data
    if (!editData) postData.id = editData
    if (data.parentId) postData.parentId = data.parentId
    if (data.members)
      postData.members = data.members.map((item, index) => item.id)
    // alert(JSON.stringify(postData))
    // return
    const res = await save(baseUrl.jm_team, postData)
    dispatch(loadingButton(false))
    dispatch(openMessage({ ...res }))
    if (res.errorCode == ERROR_CODE.success) {
      //dispatch(setEditData(null))
      dispatch(setReload())
      //dispatch(close())
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
        <Grid item xs={12}>
          <span className="text-note">
            {t(
              "Enter the Email of the user you want to add to the group, press Enter to add more users"
            )}
          </span>
        </Grid>
        <Grid item xs={12}>
          <MultiSelect
            control={control}
            name="members"
            data={dataUser}
            label={t("User email")}
            placeholder={t("Enter user email")}
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

TeamPopup.propTypes = {
  dataTeam: PropTypes.array,
}

TeamPopup.defaultProps = {
  dataTeam: [],
}
export default TeamPopup
