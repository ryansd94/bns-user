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
import { ERROR_CODE, baseUrl, EWidth } from "configs"
import { loading as loadingButton } from "stores/components/button"
import { message } from "configs"
import { EditorControl } from 'components/editor'
import TextInput from "components/input/TextInput"
import Grid from "@mui/material/Grid"
import { TabControl } from 'components/tab'
import _ from 'lodash'
import { convertObjectToArray } from "helpers/commonFunction"
import ViewPermissionFunction from './viewPermissionPopup/viewPermissionFunction'
import ViewPermissionApply from './viewPermissionPopup/viewPermissionApply'

const ViewPermissionPopup = (props) => {
    const { t } = useTranslation()
    const dispatch = useDispatch()
    const editData = useSelector((state) => state.master.editData)
    const validationSchema = Yup.object().shape({
        name: Yup.string().required(t(message.error.fieldNotEmpty)),
    })

    const defaultValues = {
        name: "",
        description: "",
        id: null,
    }

    useEffect(() => {
        if (editData) {
            onEditClick()
        }
    }, [editData])

    const onEditClick = async () => {
        if (!editData) return
        dispatch(change_title(t("Chỉnh sửa quyền")))
        dispatch(setLoadingPopup(true))
        dispatch(open())
        await getByID(baseUrl.sys_viewPermission, editData).then((res) => {
            //dispatch(setEditData(res.data))
            setValue("id", res.data.id)
            setValue("name", res.data.name)
            setValue("description", res.data.description)
            var obj = res.data.permission.reduce(function (result, item, index) {
                var key = Object.keys(item)[0] //first property: a, b, c
                var actions = item.actions.reduce(function (resultChild, itemChild, indexChild) {
                    var key = Object.keys(itemChild)[0] //first property: a, b, c
                    resultChild[itemChild[key]] = itemChild['value']
                    return resultChild
                }, {})
                result[item[key]] = actions
                return result
            }, {})
            setValue("permission", obj)
            setValue("objects", res.data.objects)
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
        var postData = _.cloneDeep({
            name: data.name,
            permission: data.permission,
            description: data.description,
            userSelectedIds: data.userSelectedIds,
            teamSelectedIds: data.teamSelectedIds
        })
        if (!_.isNil(postData.permission)) {
            var permissions = convertObjectToArray(postData.permission, 'view', 'actions')
            _.map(permissions, (item) => {
                const actionValues = convertObjectToArray(item.actions, 'key', 'value')
                item.actions = actionValues
            })
            postData.permission = permissions
        }
        dispatch(loadingButton(true))
        if (!_.isEmpty(editData)) postData.id = editData
        const res = await save(baseUrl.sys_viewPermission, postData)
        dispatch(loadingButton(false))
        dispatch(openMessage({ ...res }))
        if (res.errorCode == ERROR_CODE.success) {
            dispatch(setReload())
        }
    }

    const renderInfoTabContent = () => {
        return <Grid container gap={2}>
            <Grid item xs={12}>
                <TextInput
                    autoFocus={true}
                    required={true}
                    control={control}
                    label={t("Tên quyền")}
                    name="name"
                />
            </Grid>
            <Grid item xs={12}>
                <EditorControl
                    control={control}
                    isFullScreen={true}
                    label={t("Mô tả")}
                    name="description"
                    isShowAccordion={true} />
            </Grid>
        </Grid>
    }

    const getTabItems = () => {
        const data = [
            {
                label: t('Chi tiết'),
                Content: renderInfoTabContent()
            },
            {
                label: t('Phân quyền'),
                Content: <ViewPermissionFunction control={control} setValue={setValue} getValues={getValues} />
            },
            {
                label: t('Áp dụng'),
                Content: <ViewPermissionApply control={control} setValue={setValue} getValues={getValues} {...props} />
            }
        ]
        return data
    }

    const ModalBody = () => {
        return <TabControl tabItems={getTabItems()} />
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
}

export default ViewPermissionPopup