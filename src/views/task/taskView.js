import React, { useEffect, useState } from "react"
import { EditorControl, EditorControlCustom } from 'components/editor'
import { EControlType, ESize, EButtonDetailType, EButtonIconType } from 'configs'
import Grid from "@mui/material/Grid"
import { TextInput, NumberInput } from 'components/input'
import SingleAddSelect from 'components/select/SingleAddSelect'
import AssignSelect from 'components/select/assignSelect'
import { AccordionControl } from 'components/accordion'
import { DatePickerInput } from 'components/datepicker'
import { getByID, get, save } from "services"
import { useParams } from 'react-router'
import { baseUrl, ERROR_CODE } from "configs"
import { EFormatDate } from "configs/constants"
import { useForm } from "react-hook-form"
import Box from "@mui/material/Box"
import { useTranslation } from "react-i18next"
import StatusSelect from 'components/select/statusSelect'
import ButtonDetail from "components/button/ButtonDetail"
import { TabControl } from 'components/tab'
import { useSelector, useDispatch } from "react-redux"
import { loading as loadingButton } from "stores/components/button"
import { openMessage } from "stores/components/snackbar"
import { UserControl } from 'components/user'
import { useLocation, useHistory } from "react-router-dom"
import queryString from "query-string"
import {
    setReload,
} from "stores/views/master"
import _ from 'lodash'
import './styles.scss'
import { TagControl } from "components/tag"
import * as Yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup"
import { message } from "configs"
import { TaskChild, TaskParent } from 'components/task'
import { MultipleFileUploadField } from 'components/upload/uploadFile'
import { TaskMoreButton } from '../task/taskMoreButton'
import { Comment } from 'components/comment'

const TaskView = (props) => {
    console.log("render TaskView")
    const { isCreate = true, taskId = null, taskTypeId, parentId } = props
    const { search } = useLocation()
    const { parentId: parentIdFromQuery, copyTaskId } = queryString.parse(search)
    const dispatch = useDispatch()
    const [data, setData] = useState({})
    const [userAssign, setUserAssign] = useState([])
    const [taskTypies, setTaskType] = useState([])
    const [templateContent, setTemplateContent] = useState('')
    const { t } = useTranslation()
    const { id, taskEditId } = useParams()
    const validationSchema = Yup.object().shape({
        defaultData: Yup.object().shape({
            title: Yup.string().required(t(message.error.fieldNotEmpty)),
        }),
    })
    const [taskTypeId2, settaskTypeId2] = useState(taskTypeId)
    const {
        control,
        handleSubmit,
        setValue,
        getValues
    } = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            dynamicData: {},
            defaultData: { title: '', parentId: parentIdFromQuery || parentId, taskTypeId: id || taskTypeId, estimatedhour: '0', tags: [] },
            comments: []
        }
    })

    const getStatus = () => {
        if (!data.template) {
            return []
        }
        const templateStatus = data.template && _.orderBy(data.template.templateStatus, 'order', 'asc').map((item) => {
            return item.status
        })
        return templateStatus
    }

    useEffect(() => {
        if (!_.isNil(data.template)) {
            setTemplateContent(JSON.parse(data.template && data.template.content))
            if (isCreate) {
                const status = getStatus()
                if (status.length > 0) {
                    setValue('defaultData.statusId', status[0].id)
                }
            }
        }
    }, [data])

    useEffect(() => {
        if (!_.isNil(id)) {
            fetchDataTemplate(id)
        } else if (!_.isNil(taskTypeId2)) {
            fetchDataTemplate(taskTypeId2)
        }
    }, [isCreate, id, taskTypeId2])


    useEffect(() => {
        fetchTaskType()
        fetchDataUserAssign()
        return () => {
            settaskTypeId2(null)
        }
    }, [])

    useEffect(() => {
        if (!_.isNil(taskId) || !_.isNil(taskEditId) || !_.isNil(copyTaskId)) {
            loadData()
        }
    }, [taskId, taskEditId, copyTaskId])

    const loadData = () => {
        setValue('dynamicData', {})
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
                taskChilds: data.data.taskChilds,
                comments: data?.data?.comments
            })
        })
    }
    const fetchTaskType = async () => {
        await get(baseUrl.jm_taskType, {
            isGetAll: true,
        }).then((data) => {
            setTaskType(data && data.data && data.data.items)
        })
    }

    useEffect(() => {
        if (!_.isNil(data.task)) {
            const taskData = data.task
            const taskChilds = data.taskChilds
            setValue('comments', data.comments)
            setValue('defaultData', taskData)
            setValue('defaultData.usersAssign', taskData.usersAssign)
            setValue('defaultData.statusId', taskData.statusId)
            setValue('defaultData.tags', taskData.tags)
            setValue(`dynamicData`, { ...taskData.dynamicData })
        }
    }, [data])

    const fetchDataUserAssign = async () => {
        await get(`${baseUrl.jm_task}/user-assign`, {
            isGetAll: true
        }).then((data) => {
            setUserAssign(data && data.data && _.map(data.data.items, (item) => {
                return { id: item.id, fullName: item.fullName }
            }))
        })
    }

    const genderElement = (item, index, control) => {
        const name = _.isNil(item.name) ? (_.isNil(item.customColumnId) ? `dynamicData.${item.id}` : `dynamicData.${item.customColumnId}`) : `defaultData.${item.name}`
        const readOnly = item.defaultReadonly || false
        const isHidenWhenCreate = item.isHidenWhenCreate || false
        if (!_.isNil(id)) {
            if (isHidenWhenCreate) return ''
        }
        let component = <TextInput disabled={readOnly} name={name} control={control} size={ESize.small} label={item.label} />
        switch (item.type) {
            case EControlType.typography:
                component = <span>{item.id}</span>
                break
            case EControlType.editor:
                component = (<EditorControl label={item.label} name={name} control={control} className="editor-container" />)
                break
            case EControlType.select:
                component = (<SingleAddSelect fullWidth={true} label={item.label} name={name} control={control} />)
                break
            case EControlType.dateTimePicker:
                component = (<DatePickerInput disabled={readOnly} formatDate={EFormatDate.ddmmyyyy_hhmm} label={item.label} name={name} control={control} />)
                break
            case EControlType.datePicker:
                component = (<DatePickerInput disabled={readOnly} label={item.label} name={name} control={control} />)
                break
            case EControlType.number:
                component = (<NumberInput disabled={readOnly} label={item.label} name={name} control={control} />)
                break
            case EControlType.userItem:
                component = (<UserControl disabled={readOnly} label={item.label} name={name} control={control} />)
                break
            case EControlType.group:
                component = <AccordionControl
                    isExpand={true}
                    title={item.label}
                    className="task-group-container"
                    name={name}
                    details={
                        <div>
                            {
                                <Grid container item rowSpacing={2} xs={12}>
                                    {
                                        item.items && item.items.map((x, childIndex) => {
                                            return genderElement(x, childIndex, control)
                                        })
                                    }
                                </Grid>
                            }
                        </div>
                    }
                />
                break
            case EControlType.childTask:
                component = <AccordionControl
                    isExpand={true}
                    title={item.label}
                    name={name}
                    className='task-group-container'
                    details={
                        <TaskChild taskId={taskId || taskEditId} taskTypeId={id || taskTypeId || data?.task.taskTypeId} control={control} setValue={setValue} getValues={getValues} name={name} />
                    }
                />
                break
            case EControlType.parentTask:
                component = <AccordionControl
                    isExpand={true}
                    title={item.label}
                    name={name}
                    className='task-group-container'
                    details={
                        <TaskParent taskId={taskId || taskEditId} taskTypeId={id || taskTypeId || data?.task.taskTypeId} control={control} setValue={setValue} getValues={getValues} name={name} />
                    }
                />
                break
            case EControlType.upload:
                component = <AccordionControl
                    isExpand={true}
                    title={item.label}
                    name={name}
                    className='task-group-container'
                    details={
                        <MultipleFileUploadField
                            name={name}
                            control={control}
                            setValue={setValue}
                            getValues={getValues}
                        />
                    }
                />
                break
            case EControlType.comment:
                component = <Comment taskId={taskId || taskEditId} getValues={getValues} label={item.label} name={'comments'} setValue={setValue} control={control} />
                break
            default:
                break
        }
        return (
            <Grid key={index} item xs={12}>
                {component}
            </Grid>)
    }

    const onSubmit = async (data) => {
        // console.log(JSON.stringify(data))
        // return;
        dispatch(loadingButton(true))
        let postData = data
        if (!_.isNil(taskEditId) || !_.isNil(taskId)) {
            postData.id = taskEditId || taskId
        }
        if (!_.isNil(data.defaultData?.taskParent)) {
            postData.defaultData.parentId = data.defaultData.taskParent.id
        }
        const res = await save(baseUrl.jm_task, postData)
        dispatch(loadingButton(false))
        dispatch(openMessage({ ...res }))
        if (res.errorCode == ERROR_CODE.success) {
            dispatch(setReload())
        }
    }

    const renderDetailTabContent = () => {
        return (<Grid className="task-column-content" item container spacing={2} xs={12}>
            <Grid item xs={(templateContent && (_.isNil(templateContent.column3) || templateContent.column3.length == 0)) ? 9 : 6}>
                {templateContent && templateContent.column1.map((item, index) => {
                    return genderElement(item, index, control)
                })}
            </Grid>
            <Grid item xs={3}>
                {templateContent && templateContent.column2.map((item, index) => {
                    return genderElement(item, index, control)
                })}
            </Grid>
            <Grid item xs={3}>
                {templateContent && templateContent.column3 && templateContent.column3.map((item, index) => {
                    return genderElement(item, index, control)
                })}
            </Grid>
        </Grid>)
    }

    const getTabItems = () => {
        const data = [
            {
                label: t('Chi tiết'),
                Content: renderDetailTabContent()
            },
            {
                label: t('Thời gian làm việc'),
                Content: renderTimeLogTabContent()
            }
        ]
        return data
    }

    const renderTimeLogTabContent = () => {
        return <Grid container item spacing={2} direction="row">
            <Grid item>
                <DatePickerInput label={t('Ngày')} name={'date'} control={control} />
            </Grid>
            <Grid item>
                <NumberInput label={t('Giờ')} name={'hour'} control={control} />
            </Grid>

        </Grid>
    }

    const renderTaskContent = () => {
        return <div className="containerNew">
            <Box className="task-view-container">
                <Grid container item spacing={2} direction="row">
                    <Grid item xs={12}>
                        <TextInput autoFocus={true} focused={true} control={control} placeholder={t('Tiêu đề')} name="defaultData.title" />
                    </Grid>
                    <Grid className="flex-container" flexWrap={'nowrap'} container gap={2} item xs={12}>
                        <Grid item xs>
                            <Grid className="flex-container" container gap={2} item xs={12}>
                                <Grid item>
                                    <AssignSelect
                                        control={control}
                                        name={'defaultData.usersAssign'}
                                        data={userAssign}
                                    />
                                </Grid>
                                <Grid item>
                                    <StatusSelect
                                        options={getStatus()}
                                        name={'defaultData.statusId'}
                                        control={control}
                                    />
                                </Grid>
                                <Grid item>
                                    <TagControl
                                        name={'defaultData.tags'}
                                        control={control}
                                        setValue={setValue}
                                        getValues={getValues}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item>
                            <ButtonDetail className="f-right" onClick={handleSubmit(onSubmit)} type={EButtonDetailType.save} />
                        </Grid>
                        <Grid item>
                            <TaskMoreButton
                                taskTypies={taskTypies}
                                onChangeTaskType={loadData}
                                task={data?.task}
                                taskId={taskId || taskEditId} />
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <TabControl tabItems={getTabItems()} />
                    </Grid>
                </Grid>
            </Box>
        </div>
    }

    return <div>
        {renderTaskContent()}
    </div>
}

export default TaskView