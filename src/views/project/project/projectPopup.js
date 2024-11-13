import React, { useEffect, useState } from "react"
import Popup from "components/popup/Popup"
import { useTranslation } from "react-i18next"
import { useSelector, useDispatch } from "react-redux"
import * as Yup from "yup"
import { useForm } from "react-hook-form"
import { open, change_title, close } from "components/popup/popupSlice"
import { openMessage } from "stores/components/snackbar"
import { setLoadingPopup, setReload } from "stores/views/master"
import { getByID, save2 } from "services"
import { ERROR_CODE, baseUrl, EProjectTypeOption, EControlType } from "configs"
import { loading as loadingButton } from "stores/components/button"
import { message, EWidth } from "configs"
import _ from "lodash"
import ProjectCreateContent from "./projectCreateContent"
import { getCustomResolverTab, setValuesData } from "helpers"
import eventEmitter from "helpers/eventEmitter"
import { get } from "services"
import DiffTracker from "helpers/diffTracker"

const ProjectPopup = React.memo((props) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const editData = useSelector((state) => state.master.editData)
  const [members, setMembers] = useState({})
  const [users, setUsers] = useState([])
  const [teams, setTeams] = useState([])
  const [type, setType] = useState(EProjectTypeOption.basic)
  const id = "popup-project"

  useEffect(() => {
    let mounted = true
    const getUsers = async () => {
      await get(`${baseUrl.sys_viewPermission}/users`, { isGetAll: true }).then(
        (data) => {
          setUsers(data && data.data && data.data.items)
        },
      )
    }
    const getTeams = async () => {
      await get(`${baseUrl.sys_viewPermission}/teams`, { isGetAll: true }).then(
        (data) => {
          setTeams(data && data.data && data.data.items)
        },
      )
    }
    getUsers()
    getTeams()
    return () => {
      mounted = false
    }
  }, [])

  const validationSchemaTab = [
    {
      tabIndex: 0,
      validation: {
        name: Yup.string().required(t(message.error.fieldNotEmpty)),
        code: Yup.string().required(t(message.error.fieldNotEmpty)),
      },
    },
  ]

  const customResolver = async (values, context) => {
    const result = await getCustomResolverTab(
      values,
      context,
      validationSchemaTab,
    )
    if (!_.isEmpty(result.errorTab)) {
      eventEmitter.emit("errorTabs", {
        errors: result.errorTab,
        id: "projectTab",
      })
    }
    return result
  }

  const defaultValues = {
    name: "",
    description: "",
    type: EProjectTypeOption.basic,
    sprints: [],
  }

  useEffect(() => {
    if (editData) {
      onEditClick()
    }
  }, [editData])

  const onEditClick = async () => {
    if (!editData) return
    dispatch(change_title(t("Edit project")))
    dispatch(setLoadingPopup(true))
    await getByID(baseUrl.jm_project, editData).then((res) => {
      setValuesData(setValue, res.data)
      setMembers({
        teamsApplyIds: res.data.teams,
        usersApplyIds: res.data.members,
      })
      setType(res.data.type)
      dispatch(setLoadingPopup(false))
      dispatch(open())
    })
  }

  const { control, handleSubmit, reset, setValue, getValues } = useForm({
    resolver: customResolver,
    defaultValues: defaultValues,
  })

  const onSubmit = async (data) => {
    dispatch(loadingButton(true))
    let saveData = { ...data }
    if (!_.isNil(editData)) {
      saveData = {}
      saveData.id = editData
      saveData.changeFields = data.changeFields
    }
    const res = await save2(baseUrl.jm_project, saveData)
    dispatch(loadingButton(false))
    dispatch(openMessage({ ...res }))
    if (res.errorCode == ERROR_CODE.success) {
      dispatch(setReload())
      dispatch(close())
      // reset()
    }
  }

  const onValueChange = ({
    value,
    name,
    type = EControlType.textField,
    isDelete = false,
    isEntity = true,
  }) => {
    DiffTracker.onValueChange({
      buttonId: id,
      editData,
      value,
      name,
      type,
      isDelete,
      getValues,
      setValue,
      eventEmitter,
      isEntity,
    })
  }

  const renderModalBody = () => {
    return (
      <ProjectCreateContent
        members={members}
        onValueChange={onValueChange}
        type={_.isNil(editData) ? EProjectTypeOption.basic : type}
        control={control}
        getValues={getValues}
        users={users}
        teams={teams}
        setValue={setValue}
      />
    )
  }

  return (
    <div>
      <Popup
        id={id}
        disabledSave={!_.isEmpty(editData) ? true : false}
        widthSize={EWidth.lg}
        reset={reset}
        ModalBody={renderModalBody}
        onSave={handleSubmit(onSubmit)}
      />
    </div>
  )
})

export default ProjectPopup
