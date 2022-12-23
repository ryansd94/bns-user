import React, { useEffect, useState } from "react"
import { EditorControl } from 'components/editor'
import { EControlType, ESize, EButtonDetailType } from 'configs'
import Grid from "@mui/material/Grid"
import { TextInput } from 'components/input'
import SingleSelect from 'components/select/SingleSelect'
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
import {
    setReload,
} from "stores/views/master"
import _ from 'lodash'
import './styles.scss'

const TaskView = (props) => {
    console.log("render TaskView")
    const { isCreate = true, taskId = null } = props
    const dispatch = useDispatch()
    const [template, setTemplate] = useState(null)
    const [userAssign, setUserAssign] = useState([])
    const [templateContent, setTemplateContent] = useState(JSON.parse(template && template.content))
    const { t } = useTranslation()
    const { id, taskEditId } = useParams()
    const [taskData, setTaskData] = useState(null)
    const {
        control,
        handleSubmit,
        setValue
    } = useForm({
        defaultValues: {
            dynamicData: {},
            defaultData: { taskTypeId: id },
        }
    })

    const getStatus = () => {
        if (!template) {
            return []
        }
        const templateStatus = template && _.orderBy(template.templateStatus, 'order', 'asc').map((item) => {
            return item.status
        })
        return templateStatus
    }

    useEffect(() => {
        setTemplateContent(JSON.parse(template && template.content))
        const status = getStatus()
        if (status.length > 0) {
            setValue('defaultData.statusId', status[0].id)
        }
    }, [template])

    useEffect(() => {
        if (isCreate && !_.isNil(id)) {
            fetchDataTemplate()
        }
        fetchDataUserAssign()
    }, [])

    useEffect(() => {
        if (!_.isNil(taskId) || !_.isNil(taskEditId)) {
            setValue('dynamicData', {})
            fetchTaskById(taskId || taskEditId)
        }
    }, [taskId, taskEditId])

    const fetchDataTemplate = async () => {
        await getByID(baseUrl.jm_taskType, id).then((data) => {
            setTemplate(data && data.data && data.data.template)
        })
    }

    const fetchTaskById = async (id) => {
        await getByID(baseUrl.jm_task, id).then((data) => {
            setTaskData({ ...data?.data?.task })
            setTemplate(data && data.data && data.data.taskType?.template)

            // _.map(JSON.parse(taskData.dynamicData), (item) => {
            //     setValue(`dynamicData[${item.id}]`, item.value)
            // })
        })
    }

    useEffect(() => {
        if (!_.isNil(taskData)) {
            setValue('defaultData', taskData)
            setValue('defaultData.usersAssign', taskData.usersAssign)
            setValue(`dynamicData`, { ...taskData.dynamicData })
        }
    }, [taskData])

    const fetchDataUserAssign = async () => {
        await get(`${baseUrl.jm_task}/user-assign`, {
            isGetAll: true
        }).then((data) => {
            setUserAssign(data && data.data && _.map(data.data.items, (item) => {
                return { id: item.id, name: item.fullName }
            }))
        })
    }

    const genderElement = (item, index, control) => {
        const name = _.isNil(item.name) ? `dynamicData.${item.id}` : `defaultData.${item.name}`
        const readOnly = item.defaultReadonly || false
        const isHidenWhenCreate = item.isHidenWhenCreate || false
        if (!_.isNil(id)) {
            if (isHidenWhenCreate) return ''
        }
        let component = <TextInput disabled={readOnly} name={name} control={control} size={ESize.small} label={item.label} />
        if (item.type === EControlType.typography) {
            component = <span>{item.id}</span>
        }
        else if (item.type === EControlType.editor) {
            component = (<EditorControl label={item.label} name={name} control={control} className="editor-container" />)
        }
        else if (item.type === EControlType.select) {
            component = (<SingleSelect fullWidth={true} label={item.label} name={name} control={control} />)
        }
        else if (item.type === EControlType.dateTimePicker) {
            component = (<DatePickerInput disabled={readOnly} formatDate={EFormatDate.ddmmyyyy_hhmm} label={item.label} name={name} control={control} />)
        }
        else if (item.type === EControlType.datePicker) {
            component = (<DatePickerInput disabled={readOnly} label={item.label} name={name} control={control} />)
        }
        else if (item.type === EControlType.group) {
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
        }
        return (
            <Grid key={index} item xs={12}>
                {component}
            </Grid>)
    }

    const onSubmit = async (data) => {
        dispatch(loadingButton(true))
        let postData = data
        if (!_.isNil(taskEditId) || !_.isNil(taskId)) {
            postData.id = taskEditId || taskId
        }
        const res = await save(baseUrl.jm_task, postData)
        dispatch(loadingButton(false))
        dispatch(openMessage({ ...res }))
        if (res.errorCode == ERROR_CODE.success) {
            dispatch(setReload())
        }
    }
    const genderDetailTabContent = () => {
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
                label: 'Chi tiết',
                Content: genderDetailTabContent()
            },
            {
                label: 'text',
                Content: ''
            }
        ]
        return data
    }

    return <div className="containerNew">
        <Box className="task-view-container">
            <Grid container item spacing={2} direction="row">
                <Grid item xs={12}>
                    <TextInput autoFocus={true} focused={true} control={control} placeholder={t('Tiêu đề')} name="defaultData.title" />
                </Grid>
                <Grid className="flex-container" container spacing={2} item xs={12}>
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
                    <Grid item xs>
                    </Grid>
                    <Grid item>
                        <ButtonDetail className="f-right" onClick={handleSubmit(onSubmit)} type={EButtonDetailType.save} />
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <TabControl tabItems={getTabItems()} />
                </Grid>

            </Grid>
        </Box>
    </div>
}

export default TaskView