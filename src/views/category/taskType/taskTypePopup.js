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
import { ERROR_CODE, baseUrl } from "configs"
import { loading as loadingButton } from "stores/components/button"
import { UploadIcon } from 'components/upload'
import { message } from "configs"
import { ColorPickerControl } from "components/colorPicker"
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
        dispatch(change_title(t("Chỉnh sửa loại công việc")))
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
    } = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: defaultValues,
    })

    const onSubmit = async (data) => {
        dispatch(loadingButton(true))
        var postData = data
        if (!_.isEmpty(editData)) postData.id = editData
        const res = await save(baseUrl.jm_taskType, postData)
        dispatch(loadingButton(false))
        dispatch(openMessage({ ...res }))
        if (res.errorCode == ERROR_CODE.success) {
            dispatch(setReload())
        }
    }

    const onColorChange = (e) => {
        setColor(e.hex)
    }

    function ModalBody() {
        return (
            <Grid container rowSpacing={2}>
                <Grid item xs={12}>
                    <TextInput
                        autoFocus={true}
                        required={true}
                        control={control}
                        label={t("Tên loại công việc")}
                        name="name"
                    />
                </Grid>
                <Grid item xs={12}>
                    <UploadIcon
                        label={t("Biểu tượng")}
                        control={control}
                        name="icon"
                        color={color}
                    />
                </Grid>
                <Grid item xs={12}>
                    <ColorPickerControl
                        control={control}
                        label={t("Màu sắc")}
                        name="color"
                        onChange={onColorChange}
                    />
                </Grid>
                <Grid item xs={12}>
                    <SingleAddSelect
                        data={dataTemplaties}
                        control={control}
                        name="templateId"
                        label={t("Mẫu công việc")}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextInput
                        control={control}
                        label={t("Mô tả")}
                        name="description"
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
                onSave={handleSubmit(onSubmit)}
            />
        </div>
    )
})

export default TaskTypePopup