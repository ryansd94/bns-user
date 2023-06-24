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
import { ERROR_CODE, baseUrl, EProjectTypeOption } from "configs"
import { loading as loadingButton } from "stores/components/button"
import { message, EWidth } from "configs"
import _ from 'lodash'
import ProjectCreateContent from './projectCreateContent'
import { getCustomResolverTab } from "helpers"
import { DatePickerInput } from 'components/datepicker'
import { EditorControl } from 'components/editor'
import TextInput from "components/input/TextInput"
import { UploadIcon } from 'components/upload'
import Grid from "@mui/material/Grid"
import eventEmitter from 'helpers/eventEmitter'

const ProjectPopup = React.memo((props) => {
    console.log('render ProjectPopup')
    const { t } = useTranslation()
    const dispatch = useDispatch()
    const editData = useSelector((state) => state.master.editData)

    const validationSchemaTab = [{
        tabIndex: 0,
        validation: {
            name: Yup.string().required(t(message.error.fieldNotEmpty)),
            code: Yup.string().required(t(message.error.fieldNotEmpty))
        },
    }]

    const customResolver = async (values, context) => {
        const result = await getCustomResolverTab(values, context, validationSchemaTab)
        if (!_.isEmpty(result.errorTab)) {
            eventEmitter.emit('errorTabs', result.errorTab)
        }
        return result
    }

    const defaultValues = {
        name: "",
        description: "",
        type: EProjectTypeOption.basic
    }

    useEffect(() => {
        if (editData) {
            onEditClick()
        }
    }, [editData])

    const onEditClick = async () => {
        if (!editData) return
        dispatch(change_title(t("Edit project")))
        dispatch(setLoadingPopup(true))
        dispatch(open())
        await getByID(baseUrl.jm_project, editData).then((res) => {
            //dispatch(setEditData(res.data))
            setValue("id", res.data.id)
            setValue("name", res.data.name)
            setValue("code", res.data.code)
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
        resolver: customResolver,
        // resolver: yupResolver(validationSchema),
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

    function ModalBody() {
        return <ProjectCreateContent control={control} getValues={getValues} setValue={setValue} />
    }
    return (
        <div>
            <Popup
                widthSize={EWidth.lg}
                reset={reset}
                ModalBody={ModalBody}
                onSave={handleSubmit(onSubmit)}
            />
        </div>
    )
})

export default ProjectPopup
