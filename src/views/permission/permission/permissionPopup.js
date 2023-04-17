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
import { ERROR_CODE, baseUrl, EWidth, EMenuType } from "configs"
import { loading as loadingButton } from "stores/components/button"
import { message, buttonKey, constants } from "configs"
import { EditorControl } from 'components/editor'
import TextInput from "components/input/TextInput"
import Grid from "@mui/material/Grid"
import { TabControl } from 'components/tab'
import _ from 'lodash'
import { CheckBoxControl } from 'components/checkbox'
import { deepFind } from "helpers/commonFunction"

const PermissionPopup = (props) => {
    const { t } = useTranslation()
    const dispatch = useDispatch()
    const editData = useSelector((state) => state.master.editData)
    const menu = useSelector((state) => state.menu.menu)
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
        getValues
    } = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: defaultValues,
    })

    const onSubmit = async (data) => {
        console.log({ ...data })
        // dispatch(loadingButton(true))
        // var postData = data
        // if (!_.isEmpty(editData)) postData.id = editData
        // const res = await save(baseUrl.jm_project, postData)
        // dispatch(loadingButton(false))
        // dispatch(openMessage({ ...res }))
        // if (res.errorCode == ERROR_CODE.success) {
        //     dispatch(setReload())
        // }
    }

    const renderTabInfo = () => {
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

    const changePermissionValue = (value, item) => {
        setValue(`permission.${item.key}.all`, value)
        let buttons = [constants.view]
        const buttonsInclude = _.difference(buttonKey.defaultKeys, item.button?.notInclude)
        buttons.push(...buttonsInclude)
        _.map(buttons, (btn) => {
            setValue(`permission.${item.key}.${btn}`, value)
        })
        if (!_.isEmpty(item.childs)) {
            _.map(item.childs, (child) => {
                changePermissionValue(value, child)
            })
        }
    }

    const onChangeValueAction = (value, item) => {
        var permission = deepFind(menu, function (obj) {
            return obj.key === item.key
        }, 'childs')
        if (!_.isNil(permission)) {
            changePermissionValue(value, permission)
        }
    }

    const onChangeValueButton = (value, btnKey, item) => {
        setValue(`permission.${item.key}.${btnKey}`, value)
        var permission = deepFind(menu, function (obj) {
            return obj.key === item.key
        }, 'childs')
        if (!_.isNil(permission)) {
            if (value === false) {
                setValue(`permission.${item.key}.all`, false)
            } else {
                let isAllCheck = true
                let buttons = [constants.view]
                let buttonNotIncludes = item.button?.notInclude || []
                buttonNotIncludes.push(btnKey)
                const buttonIncludes = _.difference(buttonKey.defaultKeys, buttonNotIncludes)
                buttons.push(...buttonIncludes)
                _.map(buttons, (btn) => {
                    const btnCheckValue = getValues(`permission.${item.key}.${btn}`)
                    if (btnCheckValue !== true) {
                        isAllCheck = false
                        return
                    }
                })

                if (isAllCheck === true) {
                    setValue(`permission.${item.key}.all`, true)
                }
            }
        }
    }

    const renderMenuButton = (item) => {
        let buttons = [constants.view]
        const buttonsInclude = _.difference(buttonKey.defaultKeys, item.button?.notInclude)
        buttons.push(...buttonsInclude)
        return !_.isEmpty(buttons) ? <Grid className="permission-button-content" direction={'row'} container gap={2}>
            {
                _.map(buttons, (key) => {
                    return <Grid key={key} item>
                        <CheckBoxControl
                            control={control}
                            onChange={(value) => onChangeValueButton(value, key, item)}
                            label={t(key)}
                            name={`permission.${item.key}.${key}`}
                        />
                    </Grid>
                })
            }
        </Grid> : ''
    }

    const renderMenuTitle = (item) => {
        return <Grid item container gap={2} direction={'row'}>
            <Grid item>
                <CheckBoxControl
                    control={control}
                    onChange={(value) => onChangeValueAction(value, item)}
                    label={item.title}
                    name={`permission.${item.key}.all`}
                />
            </Grid>
        </Grid>
    }

    const renderMenuChild = (item) => {
        return <Grid direction={'column'} container gap={2}>
            {
                _.map(item.childs, (child) => {
                    return <Grid className="permission-child-item" key={child.key} direction={'column'} container gap={2}>
                        {renderMenuTitle(child)}
                        {child.type === EMenuType.action ? renderMenuButton(child) : ''}
                        {child.childs ? renderMenuChild(child) : ''}
                    </Grid>
                })
            }
        </Grid>
    }

    const renderPermissionTabContent = () => {
        return <Grid container direction={'column'} gap={2}>
            {_.map(menu, (item) => {
                return <Grid key={item.key} direction={'column'} container gap={2}>
                    {renderMenuTitle(item)}
                    {item.type === EMenuType.action ? renderMenuButton(item) : ''}
                    {
                        renderMenuChild(item)
                    }
                </Grid>
            })}
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
                Content: renderPermissionTabContent()
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

export default PermissionPopup
