import { useState, useEffect } from "react"
import Grid from "@mui/material/Grid"
import { useTranslation } from "react-i18next"
import _ from 'lodash'
import { DatePickerInput } from 'components/datepicker'
import Popup from "components/popup/Popup"
import { useForm } from "react-hook-form"
import TextInput from "components/input/TextInput"
import { message, ERowStatus } from "configs"
import { yupResolver } from "@hookform/resolvers/yup"
import * as Yup from "yup"
import { v4 as uuidv4 } from 'uuid'
import { CheckBoxControl } from "components/checkbox"

const ProjectSprintTabPopup = (props) => {
    const { onSubmit, data = {}, handleClose } = props
    const [open, setOpen] = useState(data?.open)
    const { t } = useTranslation()

    const validationSchema = Yup.object().shape({
        name: Yup.string().required(t(message.error.fieldNotEmpty)),
    })

    const {
        control,
        handleSubmit,
        reset,
        setValue
    } = useForm({
        resolver: yupResolver(validationSchema),
        defaultValues: {
            name: '',
            startDate: null,
            endDate: null,
            active: true
        }
    })

    useEffect(() => {
        setOpen(data.open)
        if (data.open === true) {
            setValue('name', data.name)
            setValue('startDate', data.startDate)
            setValue('endDate', data.endDate)
        }
    }, [data])

    const onApplyClick = (item) => {
        item.parentId = data?.parentId
        if (_.isNil(data?.id)) {
            item.id = uuidv4()
            item.rowStatus = ERowStatus.addNew
        } else {
            item.rowStatus = ERowStatus.update
            item.id = data.id
        }
        onSubmit(item)
        if (_.isNil(data?.id)) {
            reset()
        } else {
            handleClose()
            setOpen(false)
        }
    }

    const renderPopupAddContent = () => {
        return <Grid container gap={2} direction='column'>
            <Grid item>
                <TextInput
                    autoFocus={true}
                    required={true}
                    control={control}
                    label={t("Sprint name")}
                    name="name"
                />
            </Grid>
            <Grid item container direction={'row'} gap={2}>
                <Grid item xs>
                    <DatePickerInput
                        label={t("Start date")}
                        control={control}
                        name={`startDate`} />
                </Grid>
                <Grid item xs>
                    <DatePickerInput
                        label={t("End date")}
                        control={control}
                        name={`endDate`} />
                </Grid>
            </Grid>
            <Grid item xs>
                <CheckBoxControl
                    label={t("Active")}
                    control={control}
                    name={`active`} />
            </Grid>
        </Grid>
    }

    return <>
        <Popup
            removeOnChangeDisabled={false}
            title={!_.isNil(data.id) ? t('Edit sprint') : t('Add new sprint')}
            typeSave=''
            labelSave={!_.isNil(data.id) ? t('Apply') : t('Add')}
            handleClose={handleClose}
            isEditData={false}
            open={open}
            reset={reset}
            ModalBody={renderPopupAddContent}
            widthSize={"sm"}
            onSave={handleSubmit(onApplyClick)}
        />
    </>
}

export default ProjectSprintTabPopup