import React, { useEffect, useState } from "react"
import Popup from "components/popup/Popup"
import { useTranslation } from "react-i18next"
import { useSelector } from "react-redux"
import * as Yup from "yup"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { get } from "services"
import { baseUrl, EButtonDetailType, message } from "configs"
import _ from 'lodash'
import TaskView from './taskView'

const TaskChildPopup = React.memo((props) => {
    const { taskParentId, taskTypeId } = props
    const { t } = useTranslation()
    const validationSchema = Yup.object().shape({
        title: Yup.string().required(t(message.error.fieldNotEmpty)),
        taskTypeId: Yup.string().nullable(true).required(t(message.error.fieldNotEmpty))
    })
    const [taskTypies, setTaskType] = useState([])
    const open = useSelector((state) => state.popup.open)

    const defaultValues = {
        title: "",
        taskTypeId: null,
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

    useEffect(() => {
        if (!_.isNil(taskTypeId)) {
            setValue('taskTypeId', taskTypeId)
        }
    }, [taskTypeId])

    useEffect(() => {
        if (!_.isNil(taskParentId)) {
            fetchTaskType()
        }
    }, [])

    const fetchTaskType = async () => {
        await get(baseUrl.jm_taskType, {
            isGetAll: true,
        }).then((data) => {
            setTaskType(data && data.data && data.data.items)
        })
    }

    const onSubmit = async (data) => {
        alert(JSON.stringify(data))
    }

    const ModalBody = () => {
        return (
            <TaskView taskTypeId={taskTypeId} parentId={taskParentId} />
        )
    }

    return (
        open ? <div>
            <Popup
                isShowFooter={false}
                reset={reset}
                ModalBody={ModalBody}
                widthSize={"xl"}
                typeSave={EButtonDetailType.ok}
                onSave={handleSubmit(onSubmit)}
            />
        </div> : ''
    )
})

export default TaskChildPopup