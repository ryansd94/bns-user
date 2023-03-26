
import React, { useEffect, useState } from "react"
import Popup from "components/popup/Popup"
import { useTranslation } from "react-i18next"
import { useDispatch } from "react-redux"
import * as Yup from "yup"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { EButtonDetailType, message, ERROR_CODE } from "configs"
import SingleAddSelect from "components/select/SingleAddSelect"
import Grid from "@mui/material/Grid"
import _ from 'lodash'
import { LabelControl } from 'components/label'

const CopyTaskPopup = React.memo((props) => {
    const { taskId, onChangeTaskType, open = null, handleClose, task = {}, taskTypies } = props
    const { t } = useTranslation()
    const dispatch = useDispatch()
    const validationSchema = Yup.object().shape({
        taskTypeId: Yup.string().nullable(true).required(t(message.error.fieldNotEmpty))
    })
    const [stateOpen, setStateOpen] = useState(false)
    const defaultValues = {
        taskTypeId: task.taskTypeId,
        id: taskId
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
        if (!_.isNil(open)) {
            setStateOpen(open)
        }
    }, [open])

    useEffect(() => {
        if (!_.isNil(task) && !_.isEmpty(task)) {
            setValue('taskTypeId', task.taskTypeId)
        }
    }, [task])

    useEffect(() => {
        if (!stateOpen) {
            reset()
        }
    }, [stateOpen])

    const onSubmit = async (data) => {
        window.open(`/task/create/${task?.taskTypeId}?copyTaskId=${taskId}`)
    }

    const ModalBody = () => {
        return (
            <Grid container rowSpacing={2}>
                <Grid item xs={12}>
                    <LabelControl label={<span>{t(`Tạo bản sao của `)}<b>{task.title}</b></span>} />
                </Grid>
                <Grid item xs={12}>
                    <SingleAddSelect
                        required
                        isAddWhenNoOption={false}
                        data={taskTypies}
                        control={control}
                        name="taskTypeId"
                        label={t("Chọn loại công việc")}
                    />
                </Grid>
            </Grid>
        )
    }

    return (
        <Popup
            title={t("Sao chép công việc")}
            open={stateOpen}
            reset={reset}
            ModalBody={ModalBody}
            handleClose={handleClose}
            typeSave={EButtonDetailType.ok}
            onSave={handleSubmit(onSubmit)}
        />
    )
})

export default CopyTaskPopup