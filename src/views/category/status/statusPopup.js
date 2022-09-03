import React, { useEffect, useState, useMemo, useCallback } from "react"

import Popup from "components/popup/Popup"
import Grid from "@mui/material/Grid"
import { ColorPickerControl } from "components/colorPicker"
import TextInput from "components/input/TextInput"
import { useTranslation } from "react-i18next"
import { useSelector, useDispatch } from "react-redux"
import * as Yup from "yup"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { open, change_title, close } from "components/popup/popupSlice"
import { openMessage } from "stores/components/snackbar"
import {
    setPage,
    setSort,
    setLoadingPopup,
    setReload,
    setEditData,
} from "stores/views/master"
import { getByID, save } from "services"
import { ERROR_CODE, baseUrl } from "configs"
import { loading as loadingButton } from "stores/components/button"
import { message } from "configs"
import parse from "html-react-parser"

const StatusPopup = React.memo((props) => {
    const { t } = useTranslation()
    const dispatch = useDispatch()
    const { } = props
    const editData = useSelector((state) => state.master.editData)
    const openPopup = useSelector((state) => state.popup.open)
    const validationSchema = Yup.object().shape({
        name: Yup.string().required(t(message.error.fieldNotEmpty)),
    })

    const defaultValues = {
        name: "",
        description: "",
        color: "",
        id: "",
    }

    useEffect(() => {
        reset()
        onEditClick()
    }, [openPopup])

    const onEditClick = async () => {
        if (!editData) return
        dispatch(change_title(t("Chỉnh sửa Trạng thái")))
        dispatch(setLoadingPopup(true))
        dispatch(open())
        await getByID(baseUrl.jm_status, editData).then((res) => {
            setValue("id", res.data.id || "")
            setValue("name", res.data.name || "")
            setValue("description", res.data.description || "")
            setValue("color", res.data.color)
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
        if (!editData) postData.id = editData
        if (data.parentId) postData.parentId = data.parentId
        if (data.members)
            postData.members = data.members.map((item, index) => item.id)
        const res = await save(baseUrl.jm_status, postData)
        dispatch(loadingButton(false))
        dispatch(openMessage({ ...res }))
        if (res.errorCode == ERROR_CODE.success) {
            dispatch(setEditData(null))
            dispatch(setReload())
            reset()
        }
    }
    const genderIcon = () =>{
        const icon =`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!-- Font Awesome Pro 5.15.4 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) --><path d="M416 208H272V64c0-17.67-14.33-32-32-32h-32c-17.67 0-32 14.33-32 32v144H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h144v144c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32V304h144c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z"/></svg>`
        return <div>{parse(icon)}</div>;
    }
    function ModalBody() {
        return (
            <Grid container rowSpacing={2}>
                <Grid item xs={12}>
                    <TextInput
                        autoFocus={true}
                        required={true}
                        control={control}
                        label={t("Tên trạng thái")}
                        name="name"
                    />
                </Grid>
                <Grid item xs={12}>
                    <ColorPickerControl
                        control={control}
                        label={t("Màu sắc")}
                        name="color"
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
    // function ModalBody2() {
    //     return (
    //         icons[0]
    //     )
    // }
    return (
        <div>
            <Popup
                ModalBody={ModalBody}
                widthSize={"sm"}
                onSave={handleSubmit(onSubmit)}
            />
        </div>
    )
})

export default StatusPopup
