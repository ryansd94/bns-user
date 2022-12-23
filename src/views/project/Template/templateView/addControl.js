import React, { useEffect, useState, useMemo, useCallback } from "react"
import Grid from "@mui/material/Grid"
import { EControlType } from 'configs'
import { RadioGroupControl } from 'components/radio'
import * as Yup from "yup"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { useTranslation } from "react-i18next"
import SingleSelect from 'components/select/SingleSelect'
import ButtonFuntion from 'components/button/ButtonFuntion'
import { EButtonType } from 'configs'
import { TextInput } from 'components/input'
import { message } from "configs"

const TemplateAddControl = React.memo((props) => {
    const { onAction, index, onApply, prefix, item, templateColumnData = [] } = props
    const { t } = useTranslation()
    const validationSchema = Yup.object().shape({
        // title: Yup.string().required(t(message.error.fieldNotEmpty))
    })
    const optionPositionItem = [{ id: '1', label: t('Trên') }, { id: '2', label: t('Dưới') }]
    const optionPositionGroup = [{ id: '1', label: t('Trên') }, { id: '2', label: t('Dưới') }, { id: '3', label: t('Bên trong') }]
    const defaultValues = {
        position: '1',
        type: EControlType.textField,
        title: ''
    }

    const {
        control,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: defaultValues,
    });

    function getControlType() {
        return [
            { id: EControlType.textField, name: t('Văn bản') },
            { id: EControlType.dateTimePicker, name: t('Ngày tháng') },
            { id: EControlType.editor, name: t('Mô tả') }
        ]
    }
    const onSave = (data) => {
        onApply(data, index, prefix, item)
    }

    return <Grid className="flex-container" container direction={"column"} spacing={1} style={{ padding: '1rem', gap: '1rem' }}>
        <Grid item>
            <RadioGroupControl options={item.type === EControlType.group ? optionPositionGroup : optionPositionItem} control={control} name='position' />
        </Grid>
        <Grid item>
            <SingleSelect
                label={t("Tiêu đề")}
                control={control}
                name='title'
                freeSolo={true}
                data={templateColumnData}
            >
            </SingleSelect>
        </Grid>
        <Grid item>
            <SingleSelect
                label={t("Loại")}
                control={control}
                name='type'
                data={getControlType()}
            >
            </SingleSelect>
        </Grid>
        <Grid item>
            <ButtonFuntion style={{ marginRight: "auto" }} onClick={handleSubmit(onSave)} type={EButtonType.apply} />
        </Grid>
    </Grid>
})
export default TemplateAddControl