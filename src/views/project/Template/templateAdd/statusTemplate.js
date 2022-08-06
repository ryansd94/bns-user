import React, { useEffect, useState } from "react"
import Grid from "@mui/material/Grid"
import { useTranslation } from "react-i18next"
import { ColorPicker } from 'mui-color'
import ButtonIcon from "components/button/ButtonIcon"
import { useForm, useFieldArray, Controller } from "react-hook-form"
import { EButtonIconType, ESize } from "configs"
import { v4 as uuidv4 } from 'uuid'
import TextInput from 'components/input/TextInput'

const StatusTemplate = React.memo((props) => {
    console.log("render StatusTemplate");
    const { t } = useTranslation()
    const { listStatus = [], setValue } = props
    const [statusTemplate, setStatusTemplate] = useState([...listStatus])
    const defaultValues = {
        status: [{ id: uuidv4(), name: 'Mới', color: '#1976d2', isNew: true }]
    }
    const {
        getValues,
        control,
        formState: { errors },
    } = useForm({
        defaultValues: defaultValues,
    })

    const { append, remove } = useFieldArray({
        control,
        name: "status",

    })

    useEffect(() => {
        setValue('status', statusTemplate)
    }, [statusTemplate])

    useEffect(() => {
        const status = getValues('status')
        setStatusTemplate([...status])
    }, [])

    const onColorChange = (value, index, statusItem) => {
        setValue(`status[${index}].color`, `#${value.hex}`)
        var item = statusTemplate.find((ele) => {
            return ele.id === statusItem.id
        })
        item.color = `#${value.hex}`
        setStatusTemplate([...statusTemplate])
    }

    const onStatusDelete = (index, id) => {
        remove(index)
        setStatusTemplate(statusTemplate.filter(item => item.id !== id))
    }

    const addNew = () => {
        const newStatus = { id: uuidv4(), name: 'Trạng thái', color: '#1976d2', isNew: true }
        append(newStatus)
        const status = [...statusTemplate]
        status.push(newStatus)
        setStatusTemplate([...status])
    }

    const genderListStatus = (statusItem, index) => {
        return (
            <Grid key={statusItem.id} item xs={12} container spacing={2} >
                <Grid item xs={5}>
                    <TextInput size={ESize.small} fullWidth={false} name={`status[${index}].name`} control={control} value={statusItem.name} />
                </Grid>
                <Grid item  >
                    <ColorPicker name={`status[${index}].color`} value={statusItem.color} onChange={(e) => onColorChange(e, index, statusItem)} hideTextfield defaultValue="transparent" />
                </Grid>
                <Grid item  >
                    <ButtonIcon
                        onClick={() => onStatusDelete(index, statusItem.id)}
                        type={EButtonIconType.delete}
                    />
                </Grid>
            </Grid>
        )

    }

    return (
        <Grid container direction="column" item rowSpacing={2} >
            <Grid item container xs={12} spacing={2} >
                <Grid className="flex-container" container item xs={5}>
                    <span className="text-note">
                        {t("Trạng thái")}
                    </span>
                    <ButtonIcon showTooltip={false} onClick={addNew} type={EButtonIconType.add} />
                </Grid>
                <Grid className="flex-container" item  >
                    <span className="text-note">
                        {t("Màu sắc")}
                    </span>
                </Grid>
                <Grid item >
                </Grid>
            </Grid>
            {statusTemplate && statusTemplate.map((statusItem, index) => { return genderListStatus(statusItem, index) })}

        </Grid>
    )
})

export default StatusTemplate