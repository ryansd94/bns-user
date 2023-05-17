import React from "react"
import Grid from "@mui/material/Grid"
import { EControlType } from 'configs'
import { RadioGroupControl } from 'components/radio'
import * as Yup from "yup"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { useTranslation } from "react-i18next"
import SingleAddSelect from 'components/select/SingleAddSelect'
import ButtonFuntion from 'components/button/ButtonFuntion'
import { EButtonType } from 'configs'

const AddControl = React.memo((props) => {
    const { index, onApply, prefix, item, templateColumnData = [] } = props
    const { t } = useTranslation()
    const validationSchema = Yup.object().shape({
        // title: Yup.string().required(t(message.error.fieldNotEmpty))
    })
    const optionPositionItem = [{ id: '1', label: t('Above') }, { id: '2', label: t('Under') }]
    const optionPositionGroup = [{ id: '1', label: t('Above') }, { id: '2', label: t('Under') }, { id: '3', label: t('Inside') }]
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
            { id: EControlType.textField, name: t('Input text') },
            { id: EControlType.dateTimePicker, name: t('Date') },
            { id: EControlType.editor, name: t('Description') },
            { id: EControlType.number, name: t('Input number') }
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
            <SingleAddSelect
                label={t("Title")}
                control={control}
                name='title'
                freeSolo={true}
                data={templateColumnData}
            >
            </SingleAddSelect>
        </Grid>
        <Grid item>
            <SingleAddSelect
                label={t("Type")}
                control={control}
                name='type'
                data={getControlType()}
            >
            </SingleAddSelect>
        </Grid>
        <Grid item>
            <ButtonFuntion style={{ marginRight: "auto" }} onClick={handleSubmit(onSave)} type={EButtonType.apply} />
        </Grid>
    </Grid>
})
export default AddControl