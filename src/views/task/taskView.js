import React, { useEffect, useState, useRef } from "react"
import { EditorControl } from "components/editor"
import { EControlType, ESize, EButtonDetailType } from "configs"
import Grid from "@mui/material/Grid"
import { TextInput, NumberInput } from "components/input"
import SingleAddSelect from "components/select/SingleAddSelect"
import AssignSelect from "components/select/assignSelect"
import { AccordionControl } from "components/accordion"
import { DatePickerInput } from "components/datepicker"
import { getByID, get, save } from "services"
import { useParams } from "react-router"
import { baseUrl, ERROR_CODE, EButtonIconType } from "configs"
import { EFormatDate } from "configs/enums"
import { useForm } from "react-hook-form"
import Box from "@mui/material/Box"
import { useTranslation } from "react-i18next"
import StatusSelect from "components/select/statusSelect"
import ButtonDetail from "components/button/ButtonDetail"
import { TabControl } from "components/tab"
import { useDispatch } from "react-redux"
import { openMessage } from "stores/components/snackbar"
import { UserControl } from "components/user"
import { useLocation } from "react-router-dom"
import queryString from "query-string"
import { setReload } from "stores/views/master"
import _ from "lodash"
import "./styles.scss"
import { TagControl } from "components/tag"
import * as Yup from "yup"
import { message } from "configs"
import { TaskChild, TaskParent } from "components/task"
import { MultipleFileUploadField } from "components/upload/uploadFile"
import { TaskMoreButton } from "../task/taskMoreButton"
import { Comment } from "components/comment"
import { deepFindAll } from "helpers/commonFunction"
import { getUserInfo, getCustomResolverTab } from "helpers"
import eventEmitter from "helpers/eventEmitter"
import DiffTracker from "helpers/diffTracker"
import InputAdornment from "@mui/material/InputAdornment"
import ButtonIcon from "components/button/ButtonIcon"
import { CopyToClipboard } from "react-copy-to-clipboard"

const TaskView = (props) => {
  console.log("render TaskView")
  const {
    isCreate = true,
    taskId = null,
    taskTypeId,
    parentId,
    taskTypes,
  } = props
  const { search } = useLocation()
  const { parentId: parentIdFromQuery, copyTaskId } = queryString.parse(search)
  const dispatch = useDispatch()
  const [data, setData] = useState({})
  const [userAssign, setUserAssign] = useState([])
  const [tags, setTags] = useState([])
  const [templateContent, setTemplateContent] = useState("")
  const { t } = useTranslation()
  const buttonSaveId = ""
  const { id, taskEditId } = useParams()
  const copyToClipboardRef = useRef(null)
  const [validateData, setValidateData] = useState([
    {
      tabIndex: 0,
      validation: {
        defaultData: Yup.object().shape({
          title: Yup.string().required(t(message.error.fieldNotEmpty)),
        }),
        dynamicData: Yup.object().shape({}),
      },
    },
  ])
  const user = getUserInfo()

  const customResolver = async (values, context) => {
    const result = await getCustomResolverTab(values, context, validateData)
    if (!_.isEmpty(result.errorTab)) {
      eventEmitter.emit("errorTabs", {
        errors: result.errorTab,
        id: "taskTab",
      })
    }
    return result
  }

  const { control, handleSubmit, setValue, getValues } = useForm({
    resolver: customResolver,
    defaultValues: {
      dynamicData: {},
      defaultData: {
        title: "",
        parentId: parentIdFromQuery || parentId,
        taskTypeId: id || taskTypeId,
        estimatedhour: "0",
        tags: [],
      },
      comments: [],
    },
  })

  const getStatus = () => {
    if (!data.template) {
      return []
    }
    const templateStatus =
      data.template && _.orderBy(data.template.status, "order", "asc")
    return templateStatus
  }

  const setDataValidate = (template) => {
    if (_.isNil(template)) return
    const templateValidate = [...template.column1, ...template.column2]
    const validateDefaultData = deepFindAll(
      templateValidate,
      function (obj) {
        return obj.required === true && obj.default === true
      },
      "items",
    )
    const validateDynamicData = deepFindAll(
      templateValidate,
      function (obj) {
        return obj.required === true && obj.default !== true
      },
      "items",
    )
    let defaultValidate = {
      title: Yup.string().required(t(message.error.fieldNotEmpty)),
    }
    let dynamicValidate = {}
    if (!_.isEmpty(validateDefaultData)) {
      _.map(validateDefaultData, (x) => {
        defaultValidate[x.name] = Yup.string().required(
          t(message.error.fieldNotEmpty),
        )
      })
    }
    if (!_.isEmpty(validateDynamicData)) {
      _.map(validateDynamicData, (x) => {
        const key = _.isNil(x.customColumnId) ? x.id : x.customColumnId
        dynamicValidate[key] = Yup.string().required(
          t(message.error.fieldNotEmpty),
        )
      })
    }

    setValidateData([
      {
        tabIndex: 0,
        validation: {
          defaultData: Yup.object().shape(defaultValidate),
          dynamicData: Yup.object().shape(dynamicValidate),
        },
      },
    ])
  }

  useEffect(() => {
    if (!_.isNil(data.template)) {
      const template = JSON.parse(data.template && data.template.content)
      setTemplateContent(template)
      setDataValidate(template)
      if (isCreate) {
        const status = getStatus()
        if (status.length > 0) {
          setValue("defaultData.statusId", status[0].id)
        }
      }
    }
  }, [data])

  useEffect(() => {
    if (!_.isNil(id) || !_.isNil(taskTypeId)) {
      fetchDataTemplate(id || taskTypeId)
      fetchTags()
      fetchUsersAssign()
    }
  }, [isCreate, id, taskTypeId])

  const fetchUsersAssign = async () => {
    await get(`${baseUrl.jm_task}/user-assign`, {
      isGetAll: true,
      projectId: user?.setting?.projectSetting?.currentId,
    }).then((data) => {
      setUserAssign(
        data &&
          data.data &&
          _.map(data.data.items, (item) => {
            return { id: item.id, name: `${item.firstName} ${item.lastName} ` }
          }),
      )
    })
  }
  const fetchTags = async () => {
    await get(`${baseUrl.jm_tag}`, {
      isGetAll: true,
    }).then((data) => {
      setTags(
        data &&
          data.data &&
          _.map(data.data.items, (item) => {
            return { id: item.id, name: item.name }
          }),
      )
    })
  }

  useEffect(() => {
    if (!_.isNil(taskId) || !_.isNil(taskEditId) || !_.isNil(copyTaskId)) {
      fetchTags()
      fetchUsersAssign()
      loadData()
    }
  }, [taskId, taskEditId, copyTaskId])

  const loadData = () => {
    setValue("dynamicData", {})
    fetchTaskById(taskId || taskEditId || copyTaskId)
  }

  const fetchDataTemplate = async (id) => {
    await getByID(baseUrl.jm_taskType, id).then((data) => {
      setData({ template: data && data.data && data.data.template })
    })
  }

  const fetchTaskById = async (id) => {
    await getByID(baseUrl.jm_task, id).then((data) => {
      setData({
        template: data && data.data && data.data.taskType?.template,
        task: data?.data?.task,
        taskChilds: data.data.childs,
        comments: data?.data?.comments,
      })
    })
  }

  useEffect(() => {
    if (!_.isNil(data.task)) {
      const taskData = data.task
      const taskChilds = taskData.childs
      setValue("comments", data.comments)
      setValue("defaultData", taskData)
      setValue("defaultData.usersAssignId", taskData.usersAssignId)
      setValue("defaultData.statusId", taskData.statusId)
      setValue("defaultData.tags", taskData.tags)
      setValue("defaultData.taskChilds", taskChilds)
      setValue(`dynamicData`, { ...taskData.dynamicData })
    }
  }, [data])

  const genderElement = (item, index, control) => {
    const name = _.isNil(item.name)
      ? _.isNil(item.customColumnId)
        ? `dynamicData.${item.id}`
        : `dynamicData.${item.customColumnId}`
      : `defaultData.${item.name}`
    const readOnly = item.defaultReadonly || false
    const isHidenWhenCreate = item.isHidenWhenCreate || false
    const isEntity = _.isNil(item.name) ? false : true
    const nameValueChange = _.isNil(item.name)
      ? _.isNil(item.customColumnId)
        ? item.id
        : item.customColumnId
      : item.name
    if (!_.isNil(id)) {
      if (isHidenWhenCreate) return ""
    }
    let component = (
      <TextInput
        onChange={({ value, name }) =>
          onValueChange({
            value,
            name: nameValueChange,
            nameGetValue: name,
            isEntity,
            isDynamic: !isEntity,
          })
        }
        required={item.required}
        disabled={readOnly}
        name={name}
        control={control}
        size={ESize.small}
        label={item.label}
      />
    )
    switch (item.type) {
      case EControlType.typography:
        component = <span>{item.id}</span>
        break
      case EControlType.editor:
        component = (
          <EditorControl
            copyToClipboardRef={copyToClipboardRef}
            onChange={({ value, name }) =>
              onValueChange({
                value,
                name: nameValueChange,
                nameGetValue: name,
                isEntity,
                isDynamic: !isEntity,
              })
            }
            required={item.required}
            isFullScreen={true}
            label={item.label}
            name={name}
            control={control}
            className="editor-container"
          />
        )
        break
      case EControlType.select:
        component = (
          <SingleAddSelect
            required={item.required}
            fullWidth={true}
            label={item.label}
            name={name}
            control={control}
          />
        )
        break
      case EControlType.dateTimePicker:
        component = (
          <DatePickerInput
            onChange={({ value, name }) =>
              onValueChange({
                value,
                name: nameValueChange,
                nameGetValue: name,
                isEntity,
                isDynamic: !isEntity,
              })
            }
            required={item.required}
            disabled={readOnly}
            formatDate={EFormatDate.ddmmyyyy_hhmm}
            label={item.label}
            name={name}
            control={control}
          />
        )
        break
      case EControlType.datePicker:
        component = (
          <DatePickerInput
            onChange={({ value, name }) =>
              onValueChange({
                value,
                name: nameValueChange,
                nameGetValue: name,
                isEntity,
                isDynamic: !isEntity,
              })
            }
            required={item.required}
            disabled={readOnly}
            label={item.label}
            name={name}
            control={control}
          />
        )
        break
      case EControlType.number:
        component = (
          <NumberInput
            required={item.required}
            disabled={readOnly}
            label={item.label}
            name={name}
            control={control}
          />
        )
        break
      case EControlType.userItem:
        component = (
          <UserControl
            disabled={readOnly}
            label={item.label}
            name={name}
            control={control}
          />
        )
        break
      case EControlType.group:
        component = (
          <AccordionControl
            isExpand={true}
            title={item.label}
            className="task-group-container"
            name={name}
            details={
              <div>
                {
                  <Grid container item gap={2} xs={12}>
                    {item.items &&
                      item.items.map((x, childIndex) => {
                        return genderElement(x, childIndex, control)
                      })}
                  </Grid>
                }
              </div>
            }
          />
        )
        break
      case EControlType.childTask:
        component = (
          <AccordionControl
            isExpand={true}
            title={item.label}
            name={name}
            className="task-group-container"
            details={
              <TaskChild
                taskId={taskId || taskEditId}
                taskTypeId={id || taskTypeId || data?.task.taskTypeId}
                control={control}
                setValue={setValue}
                getValues={getValues}
                name={name}
                onChange={({ value }) =>
                  onValueChange({
                    value,
                    isEntity: false,
                    type: EControlType.transferList,
                    name: "childIds",
                    originData: getOriginTaskChildIds(),
                  })
                }
              />
            }
          />
        )
        break
      case EControlType.parentTask:
        component = (
          <AccordionControl
            isExpand={true}
            title={item.label}
            name={name}
            className="task-group-container"
            details={
              <TaskParent
                taskId={taskId || taskEditId}
                taskTypeId={id || taskTypeId || data?.task.taskTypeId}
                control={control}
                setValue={setValue}
                getValues={getValues}
                name={name}
                onChange={({ value }) =>
                  onValueChange({
                    value,
                    name: "parentId",
                    nameGetValue: "defaultData.parentId",
                  })
                }
              />
            }
          />
        )
        break
      case EControlType.upload:
        component = (
          <AccordionControl
            isExpand={true}
            required={item.required}
            title={item.label}
            name={name}
            className="task-group-container"
            details={
              <MultipleFileUploadField
                name={name}
                control={control}
                setValue={setValue}
                getValues={getValues}
              />
            }
          />
        )
        break
      case EControlType.comment:
        component = (
          <Comment
            taskId={taskId || taskEditId}
            getValues={getValues}
            label={item.label}
            name={"comments"}
            setValue={setValue}
            control={control}
          />
        )
        break
      default:
        break
    }
    return (
      <Grid key={index} item xs={12}>
        {component}
      </Grid>
    )
  }

  const onSubmit = async (data) => {
    // console.log({ ...data })
    // return
    // dispatch(loadingButton(true))
    eventEmitter.emit("onChangeButtonLoading", {
      loading: true,
      buttonId: buttonSaveId,
    })
    let postData = data
    if (!_.isNil(taskEditId) || !_.isNil(taskId)) {
      //case edit task
      postData = {}
      postData.id = taskEditId || taskId
      postData.changeFields = data.changeFields
    } else {
      //case add task
      postData.defaultData.projectId = user?.setting?.projectSetting?.currentId
      if (!_.isNil(data.defaultData?.taskParent)) {
        postData.defaultData.parentId = data.defaultData.taskParent.id
      }
    }
    const res = await save(baseUrl.jm_task, postData)
    eventEmitter.emit("onChangeButtonLoading", {
      loading: false,
      buttonId: buttonSaveId,
    })
    // dispatch(loadingButton(false))
    dispatch(openMessage({ ...res }))
    if (res.errorCode == ERROR_CODE.success) {
      dispatch(setReload())
    }
  }

  const renderDetailTabContent = () => {
    return (
      <Grid
        className="task-column-content no-wrap"
        item
        container
        gap={2}
        xs={12}
      >
        <Grid
          item
          xs={
            templateContent &&
            (_.isNil(templateContent.column3) ||
              templateContent.column3.length == 0)
              ? 9
              : 6
          }
        >
          {templateContent &&
            templateContent.column1.map((item, index) => {
              return genderElement(item, index, control)
            })}
        </Grid>
        <Grid item xs={3}>
          {templateContent &&
            templateContent.column2.map((item, index) => {
              return genderElement(item, index, control)
            })}
        </Grid>
        {_.isNil(templateContent.column3) ||
        templateContent.column3.length == 0 ? (
          ""
        ) : (
          <Grid item xs={3}>
            {templateContent &&
              templateContent.column3 &&
              templateContent.column3.map((item, index) => {
                return genderElement(item, index, control)
              })}
          </Grid>
        )}
      </Grid>
    )
  }

  const getTabItems = () => {
    const data = [
      {
        label: t("Detail"),
        Content: renderDetailTabContent(),
      },
      {
        label: t("Working time"),
        Content: renderTimeLogTabContent(),
      },
    ]
    return data
  }

  const renderTimeLogTabContent = () => {
    return (
      <Grid container item spacing={2} direction="row">
        <Grid item>
          <DatePickerInput label={t("Date")} name={"date"} control={control} />
        </Grid>
        <Grid item>
          <NumberInput label={t("Time")} name={"hour"} control={control} />
        </Grid>
      </Grid>
    )
  }

  const onCustomSetValue = (values, isDynamic = false) => {
    if (isDynamic === false) {
      setValue("changeFields", { defaultData: values })
    } else {
      setValue("changeFields", { dynamicData: values })
    }
  }

  const onCustomGetChangeFields = (isDynamic = false) => {
    const changeFields = getValues("changeFields")
    return (
      (isDynamic === true
        ? changeFields?.dynamicData
        : changeFields?.defaultData) || []
    )
  }

  const onValueChange = ({
    value,
    name,
    type = EControlType.textField,
    isEntity = true,
    isDelete = false,
    nameGetValue,
    isDynamic = false,
    originData,
  }) => {
    if (_.isNil(taskId) && _.isNil(taskEditId)) return

    DiffTracker.onValueChange({
      editData: taskEditId || taskId,
      value,
      name,
      type,
      getValues,
      setValue,
      eventEmitter,
      buttonId: buttonSaveId,
      isEntity,
      isDelete,
      onCustomSetValue: (values) => onCustomSetValue(values, isDynamic),
      onCustomGetChangeFields: () => onCustomGetChangeFields(isDynamic),
      nameGetValue,
      originData,
    })
  }

  const getOriginTaskChildIds = () => {
    const taskChilds = _.cloneDeep(getValues("defaultData.taskChilds")) || []
    return _.map(taskChilds, (x) => {
      return x.id
    })
  }

  const isEditTask = () => {
    return !_.isNil(taskEditId) || !_.isNil(taskId)
  }

  const onCopyClick = async () => {
    const url = location.href
    const textUrl = `${data?.task?.taskType?.name} ${data?.task?.number}`
    const text = `${data?.task?.title}`
    const link = document.createElement("a")
    link.href = url
    link.textContent = textUrl
    const clipboardText = `<a href="${url}" target="_blank" rel="noopener noreferrer">${textUrl}</a>: ${text}`
    // const hyperlinkFormula = `<a href="${url}" rel="noopener noreferrer" target="_blank">${textUrl}</a>: ${text}`
    navigator.clipboard.writeText(clipboardText)
  }

  const getCopyTask = () => {
    const textUrl = `${data?.task?.taskType?.name} ${data?.task?.number}`
    const text = `${data?.task?.title}`
    const clipboardText = `${textUrl}: ${text}`
    return clipboardText
  }

  const getCopyTaskValue = () => {
    const url = location.href
    const textUrl = `${data?.task?.taskType?.name} ${data?.task?.number}`
    const text = `${data?.task?.title}`
    return { url, textUrl, text }
  }

  const renderTaskContent = () => {
    return (
      <div className="containerNew">
        <Box className="task-view-container">
          <Grid container item spacing={2} flexWrap="nowrap" direction="column">
            <Grid item xs={12} className="flex-basis-auto">
              <TextInput
                onChange={({ value }) =>
                  onValueChange({ value, name: "title" })
                }
                autoFocus={!isEditTask()}
                focused={!isEditTask()}
                control={control}
                placeholder={t("Title")}
                name="defaultData.title"
                inputProps={{
                  startAdornment: isEditTask() ? (
                    <InputAdornment position="start">
                      {data?.task?.number}
                    </InputAdornment>
                  ) : (
                    ""
                  ),
                  endAdornment: isEditTask() ? (
                    <InputAdornment position="end">
                      <CopyToClipboard
                        data-value={getCopyTaskValue()}
                        data-text={getCopyTask()}
                        data-name="task"
                        ref={copyToClipboardRef}
                        text={getCopyTask()}
                      >
                        <ButtonIcon
                          title={t("Copy link task and title")}
                          type={EButtonIconType.copy}
                          isHoverColor={true}
                        />
                      </CopyToClipboard>
                    </InputAdornment>
                  ) : (
                    ""
                  ),
                }}
              />
            </Grid>
            <Grid
              className="flex-container flex-basis-auto"
              flexWrap={"nowrap"}
              container
              gap={2}
              item
              xs={12}
            >
              <Grid item xs>
                <Grid className="flex-container" container gap={2} item xs={12}>
                  <Grid item>
                    <AssignSelect
                      control={control}
                      name={"defaultData.usersAssignId"}
                      data={userAssign}
                      onChange={({ value }) =>
                        onValueChange({
                          value,
                          nameGetValue: "defaultData.usersAssignId",
                          name: "usersAssignIds",
                          isEntity: false,
                          type: EControlType.multiSelect,
                        })
                      }
                    />
                  </Grid>
                  <Grid item>
                    <StatusSelect
                      options={getStatus()}
                      name={"defaultData.statusId"}
                      control={control}
                      onChange={({ value }) =>
                        onValueChange({
                          value,
                          nameGetValue: "defaultData.statusId",
                          name: "statusId",
                        })
                      }
                    />
                  </Grid>
                  <Grid item>
                    <TagControl
                      data={tags}
                      name={"defaultData.tags"}
                      control={control}
                      setValue={setValue}
                      getValues={getValues}
                      onChange={({ value }) =>
                        onValueChange({
                          value,
                          nameGetValue: "defaultData.tags",
                          name: "tags",
                          type: EControlType.listObject,
                          isEntity: false,
                        })
                      }
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item>
                <ButtonDetail
                  id={buttonSaveId}
                  className="f-right"
                  onClick={handleSubmit(onSubmit)}
                  disabled={
                    _.isNil(taskEditId) && _.isNil(taskId) ? false : true
                  }
                  type={EButtonDetailType.save}
                />
              </Grid>
              <Grid item>
                <TaskMoreButton
                  taskTypies={taskTypes}
                  onChangeTaskType={loadData}
                  task={data?.task}
                  taskId={taskId || taskEditId}
                />
              </Grid>
            </Grid>
            <Grid
              item
              container
              direction="column"
              xs={12}
              className="flex-basis-auto of-hidden"
            >
              <TabControl id={"taskTab"} tabItems={getTabItems()} />
            </Grid>
          </Grid>
        </Box>
      </div>
    )
  }

  return renderTaskContent()
}

export default TaskView
