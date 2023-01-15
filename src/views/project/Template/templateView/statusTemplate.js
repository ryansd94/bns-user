import React, { useEffect, useState } from "react"
import Grid from "@mui/material/Grid"
import { useTranslation } from "react-i18next"
import ButtonIcon from "components/button/ButtonIcon"
import { useFieldArray } from "react-hook-form"
import { EButtonIconType } from "configs"
import { v4 as uuidv4 } from 'uuid'
import StatusSelect from 'components/select/statusSelect'

const StatusTemplate = React.memo((props) => {
    console.log("render StatusTemplate");
    const { t } = useTranslation()
    const { listStatus = [], setValue, id, getValues, control, statusData } = props
    const [statusTemplate, setStatusTemplate] = useState([])

    const { fields, append, remove } = useFieldArray({
        control,
        name: "status",
    })

    useEffect(() => {
        setValue('status', statusTemplate)
    }, [statusTemplate])

    useEffect(() => {
        if (!id) {
            setStatusTemplate(statusData && statusData.length > 0 && [statusData[0]] || [])
        }
    }, [statusData])

    useEffect(() => {
        if (id) {
            setStatusTemplate([...listStatus])
            setValue('status', [...listStatus])
        }
    }, [listStatus])

    const onStatusDelete = (index, id) => {
        //remove(index)
        // setStatusTemplate(statusTemplate.filter(item => item.id !== id))
        var item = statusTemplate.find((ele) => {
            return ele.id === id
        })
        if (item.isNew) {
            remove(index)
            setStatusTemplate(statusTemplate.filter(item => item.id !== id))
        }
        else {
            setValue(`status[${index}].isDelete`, true)
            item.isDelete = true
            setStatusTemplate([...statusTemplate])
        }
    }

    const addNew = () => {
        const newStatus = statusData && statusData.length > 0 && { ...statusData[0] } || {}
        append(newStatus)
        statusTemplate.splice(statusTemplate.length > 0 ? statusTemplate.length + 1 : 0, 0, newStatus)
        // const status = [...statusTemplate]
        //statusTemplate.push(newStatus)
        //setStatusTemplate([...x])
    }

    const onStatusChange = (index, value) => {
        const item = statusData.find((item) => {
            return item.id === value
        })
        setValue(`status[${index}]`, item)
        const updateStatus = statusTemplate.map((obj, i) => {
            if (i === index) {
                return { ...obj, ...item };
            }
            return obj;
        })
        setStatusTemplate([...updateStatus])
    }

    const genderListStatus = (statusItem, index) => {
        if (statusItem.isDelete)
            return ''
        return (
            <Grid key={uuidv4()} item xs={12} container spacing={2} >
                <Grid item xs={5}>
                    {/* <TextInput fullWidth={false} name={`status[${index}].name`} 
                    control={control} defaultValue={statusItem.name} /> */}
                    {/* <SingleSelect fullWidth={true} data={statusData} name={`status[${index}].name`} control={control} /> */}
                    <StatusSelect
                        onChange={(value) => onStatusChange(index, value)}
                        options={[...statusData]}
                        defaultValue={statusItem.id}
                        name={`status[${index}].id`}
                        control={control}
                    />
                </Grid>
                {/* <Grid item  >
                    <ColorPicker control={control} name={`status[${index}].color`} value={statusItem.color} onChange={(e) => onColorChange(e, index, statusItem)} hideTextfield defaultValue="transparent" />
                </Grid> */}
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
                {/* <Grid className="flex-container" item  >
                    <span className="text-note">
                        {t("Màu sắc")}
                    </span>
                </Grid> */}
                <Grid item >
                </Grid>
            </Grid>
            {statusTemplate && statusTemplate.map((statusItem, index) => { return genderListStatus(statusItem, index) })}

        </Grid>
    )
})

export default StatusTemplate