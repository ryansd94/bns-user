import React, { useEffect, useState } from "react"
import Popup from "components/popup/Popup"
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
import { getByID, save } from "services"
import { ERROR_CODE, baseUrl } from "configs"
import { loading as loadingButton } from "stores/components/button"
import { message } from "configs"
import _ from 'lodash'
import ProjectCreateContent from './projectCreateContent'

const ProjectPopup = (props) => {
    const { t } = useTranslation()
    const dispatch = useDispatch()
    const editData = useSelector((state) => state.master.editData)
    const validationSchema = Yup.object().shape({
        name: Yup.string().required(t(message.error.fieldNotEmpty)),
        code: Yup.string().required(t(message.error.fieldNotEmpty)),
    })

    const defaultValues = {
        name: "",
        description: "",
        templateId: null,
        id: null,
    }

    useEffect(() => {
        if (editData) {
            onEditClick()
        }
    }, [editData])

    const onEditClick = async () => {
        if (!editData) return
        dispatch(change_title(t("Chỉnh sửa dự án")))
        dispatch(setLoadingPopup(true))
        dispatch(open())
        await getByID(baseUrl.jm_project, editData).then((res) => {
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
        const res = await save(baseUrl.jm_project, postData)
        dispatch(loadingButton(false))
        dispatch(openMessage({ ...res }))
        if (res.errorCode == ERROR_CODE.success) {
            dispatch(setReload())
        }
    }

    const ModalBody = () => {
        return <ProjectCreateContent control={control} />
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
}

export default ProjectPopup
