import React, { useEffect, useState } from "react"
import Popup from "components/popup/Popup"
import Grid from "@mui/material/Grid"
import SingleAddSelect from "components/select/SingleAddSelect"
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
import { ERROR_CODE, baseUrl, EButtonDetailType, message } from "configs"
import { loading as loadingButton } from "stores/components/button"
import { UploadIcon } from 'components/upload'
import { ColorPickerControl } from "components/colorPicker"
import _ from 'lodash'
import TaskTypeMenuItem from './taskTypeMenuItem'
import Box from '@mui/material/Box'
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
        return  (
            <TaskView taskTypeId={taskTypeId} parentId={taskParentId}/>
        )
    }

    return (
        open ? <div>
            <Popup
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