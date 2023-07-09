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
import { getByID, save2, get } from "services"
import { ERROR_CODE, baseUrl, EControlType } from "configs"
import { loading as loadingButton } from "stores/components/button"
import { UploadIcon } from 'components/upload'
import { message } from "configs"
import { ColorPickerControl } from "components/colorPicker"
import DiffTracker from "helpers/diffTracker"
import eventEmitter from 'helpers/eventEmitter'
import _ from 'lodash'

const TaskTypePopup = React.memo((props) => {
    const { t } = useTranslation()
    const dispatch = useDispatch()
    const editData = useSelector((state) => state.master.editData)
    const [dataTemplaties, setDataTemplaties] = useState(null)
    const [color, setColor] = useState('')
    const validationSchema = Yup.object().shape({
        name: Yup.string().required(t(message.error.fieldNotEmpty)),
    })
    const popupId = 'popup-task-type'

    const defaultValues = {
        name: "",
        description: "",
        templateId: null,
        id: null,
    }

    const fetchDataTemplate = async () => {
        await get(baseUrl.jm_template, {
            isGetAll: true,
        }).then((data) => {
            setDataTemplaties(data && data.data && data.data.items)
        })
    }

    useEffect(() => {
        fetchDataTemplate()
    }, [])

    useEffect(() => {
        if (editData) {
            onEditClick()
        }
    }, [editData])

    const onEditClick = async () => {
        if (!editData) return
        dispatch(change_title(t("Edit job type")))
        dispatch(setLoadingPopup(true))
        dispatch(open())
        await getByID(baseUrl.jm_taskType, editData).then((res) => {
            //dispatch(setEditData(res.data))
            setValue("id", res.data.id)
            setValue("name", res.data.name)
            setValue("description", res.data.description)
            setValue("icon", res.data.icon)
            setValue("templateId", res.data.templateId)
            setValue('color', res.data.color)
            setColor(res.data.color)
            dispatch(setLoadingPopup(false))
        })
    }

    const {
        control,
        handleSubmit,
        reset,
        setValue,
        getValues
    } = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: defaultValues,
    })

    const onSubmit = async (data) => {
        dispatch(loadingButton(true))
        var postData = data
        if (!_.isEmpty(editData)) postData.id = editData
        const res = await save2(baseUrl.jm_taskType, postData)
        dispatch(loadingButton(false))
        dispatch(openMessage({ ...res }))
        if (res.errorCode == ERROR_CODE.success) {
            dispatch(setReload())
        }
    }

    const onColorChange = (value, name) => {
        setColor(value)
        onValueChange(value, name)
    }

    const onValueChange = (value, name, type = EControlType.textField, isDelete = false) => {
        DiffTracker.onValueChange({ editData, value, name, type, isDelete, getValues, setValue, eventEmitter, buttonId: popupId })
    }

    function ModalBody() {
        return (
            <Grid container gap={2}>
                <Grid item xs={12}>
                    <TextInput
                        autoFocus={true}
                        required={true}
                        control={control}
                        label={t("Task type name")}
                        name="name"
                        onChange={onValueChange}
                    />
                </Grid>
                <Grid item xs={12}>
                    <UploadIcon
                        label={t("Icon")}
                        control={control}
                        name="icon"
                        color={color}
                        onChange={onValueChange}
                    />
                </Grid>
                <Grid item xs={12}>
                    <ColorPickerControl
                        control={control}
                        label={t("Color")}
                        name="color"
                        onChange={onColorChange}
                    />
                </Grid>
                <Grid item xs={12}>
                    <SingleAddSelect
                        data={dataTemplaties}
                        control={control}
                        name="templateId"
                        label={t("Task template")}
                        onSelectChange={onValueChange}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextInput
                        control={control}
                        label={t("Description")}
                        name="description"
                        onChange={onValueChange}
                    />
                </Grid>
            </Grid>
        )
    }
    return (
        <div>
            <Popup
                id={popupId}
                disabledSave={!_.isEmpty(editData) ? true : false}
                reset={reset}
                ModalBody={ModalBody}
                onSave={handleSubmit(onSubmit)}
            />
        </div>
    )
})

export default TaskTypePopup
