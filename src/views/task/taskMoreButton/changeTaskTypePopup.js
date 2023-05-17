
import React, { useEffect, useState } from "react"
import Popup from "components/popup/Popup"
import { useTranslation } from "react-i18next"
import { useSelector, useDispatch } from "react-redux"
import * as Yup from "yup"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { save, get } from "services"
import { baseUrl, EButtonDetailType, message, ERROR_CODE } from "configs"
import SingleAddSelect from "components/select/SingleAddSelect"
import Grid from "@mui/material/Grid"
import _ from 'lodash'
import { loading as loadingButton } from "stores/components/button"
import { openMessage } from "stores/components/snackbar"

const ChangeTaskTypePopup = React.memo((props) => {
    const { taskId, onChangeTaskType, open = null, handleClose, taskTypies = [] } = props
    const { t } = useTranslation()
    const dispatch = useDispatch()
    const validationSchema = Yup.object().shape({
        taskTypeId: Yup.string().nullable(true).required(t(message.error.fieldNotEmpty))
    })
    const [stateOpen, setStateOpen] = useState(false)
    const defaultValues = {
        taskTypeId: null,
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
        if (!stateOpen) {
            reset()
        }
    }, [stateOpen])

    const onSubmit = async (data) => {
        dispatch(loadingButton(true))
        const res = await save(`${baseUrl.jm_task}/change-task-type`, data)
        dispatch(loadingButton(false))
        dispatch(openMessage({ ...res }))
        if (res.errorCode == ERROR_CODE.success) {
            handleClose()
            if (_.isFunction(onChangeTaskType)) {
                onChangeTaskType()
            }
        }
    }

    const ModalBody = () => {
        return (
            <Grid container rowSpacing={2}>
                <Grid item xs={12}>
                    <SingleAddSelect
                        required
                        isAddWhenNoOption={false}
                        data={taskTypies}
                        control={control}
                        name="taskTypeId"
                        label={t("Choose the type of task")}
                    />
                </Grid>
            </Grid>
        )
    }

    return (
        <Popup
            title={t("Change task type")}
            open={stateOpen}
            reset={reset}
            ModalBody={ModalBody}
            handleClose={handleClose}
            typeSave={EButtonDetailType.ok}
            onSave={handleSubmit(onSubmit)}
        />
    )
})

export default ChangeTaskTypePopup