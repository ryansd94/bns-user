import React, { useEffect, useState } from "react"
import Grid from "@mui/material/Grid"
import { useTranslation } from "react-i18next"
import ButtonIcon from "components/button/ButtonIcon"
import { useFieldArray } from "react-hook-form"
import { EButtonIconType, EButtonType, EControlType } from "configs"
import { v4 as uuidv4 } from 'uuid'
import StatusSelect from 'components/select/statusSelect'
import ButtonFuntion from "components/button/ButtonFuntion"
import _ from "lodash"

const StatusTemplate = React.memo((props) => {
    console.log("render StatusTemplate");
    const { t } = useTranslation()
    const { setValue, id, onValueChange, control, statusData, getValues, name } = props
    const status = _.cloneDeep(getValues(name))
    const getListStatusTemplate = () => {
        return _.map(_.filter(statusData, (x) => x.isAutomaticAdd === true), (y) => { return { id: y.id } })
    }
    const originData = !_.isNil(status) ? _.cloneDeep(status) : (statusData && statusData.length > 0 && getListStatusTemplate())
    const [listStatusTemplate, setListStatusTemplate] = useState(originData)
    const listStatusDataIds = _.map(statusData, (x) => { return x.id })


    const getListStatusTemplateRemaining = () => {
        const currentListStatusIds = _.map(_.filter(listStatusTemplate, (item) => item.isCurrentSelected !== true), (x) => { return x.id })
        const remainingListStatus = _.difference(listStatusDataIds, currentListStatusIds) || []
        return remainingListStatus
    }
    const [listStatusTemplateRemaining, setListStatusTemplateRemaining] = useState(getListStatusTemplateRemaining())
    const { } = useFieldArray({
        control,
        name: name,
    })

    useEffect(() => {
        if (!_.isNil(listStatusTemplate)) {
            if (!_.isNil(id)) {
                onValueChange(listStatusTemplate, name, EControlType.listId, status)
            }
            setValue(name, [...listStatusTemplate])
        }
    }, [listStatusTemplate])

    const onStatusDelete = (deletedItem) => {
        const updateStatus = listStatusTemplate.filter(item => item.id !== deletedItem.id)
        setListStatusTemplate(updateStatus)
        if (!_.includes(listStatusTemplateRemaining, deletedItem.id)) {
            listStatusTemplateRemaining.push(deletedItem.id)
            setListStatusTemplateRemaining(listStatusTemplateRemaining)
        }
    }

    const onStatusRemainingDelete = () => {
        if (!_.isNil(statusRemainingId)) {
            const currentListStatus = listStatusTemplate.filter(item => item !== statusRemainingId)
            setListStatusTemplate([...currentListStatus])
        }
        setListStatusTemplateRemaining([])
    }

    const addNew = () => {
        let currentListStatus = _.cloneDeep(listStatusTemplate || [])
        let xxx = _.find(currentListStatus, (x) => x.isCurrentSelected === true)
        if (!_.isNil(xxx)) {
            delete xxx.isCurrentSelected
        }

        const currentListStatusIds = _.map(currentListStatus, (x) => { return x.id })
        const remainingListStatus = _.difference(listStatusDataIds, currentListStatusIds)
        if (!_.isEmpty(remainingListStatus)) {
            setListStatusTemplateRemaining([...remainingListStatus])
            currentListStatus.push({ id: remainingListStatus[0], isCurrentSelected: true })
            setListStatusTemplate([...currentListStatus])
        }
    }

    const onStatusChange = (index, value, id) => {
        const item = statusData.find((item) => {
            return item.id === value
        })
        setValue(`status[${index}.id]`, value)
        const updateStatus = _.find(listStatusTemplate, (x) => x.id === id)
        if (!_.isNil(updateStatus)) {
            updateStatus.id = value
        }
        setListStatusTemplate([...listStatusTemplate])
    }

    const renderStatusItem = (statusItem, index) => {
        if (statusItem.isDelete)
            return ''
        let options = []
        const disabled = statusItem.isCurrentSelected !== true ? true : false
        if (statusItem.isCurrentSelected !== true) {
            options = statusData
        } else {
            options = _.filter(statusData, (x) => _.includes(listStatusTemplateRemaining, x.id))
        }

        return (
            <Grid key={uuidv4()} item gap={2} container alignItems={'center'}>
                <Grid item xs={3}>
                    <StatusSelect
                        disabled={disabled}
                        onChange={(value) => onStatusChange(index, value, statusItem.id)}
                        options={options}
                        defaultValue={statusItem.id}
                        name={`status[${index}].id`}
                        control={control}
                    />
                </Grid>
                <Grid item>
                    <ButtonIcon
                        onClick={() => onStatusDelete(statusItem)}
                        type={EButtonIconType.delete}
                    />
                </Grid>
            </Grid>
        )

    }

    return (
        <Grid container gap={2} direction="column" item>
            <Grid item container>
                <Grid className="flex-container" container item xs={5}>
                    <ButtonFuntion onClick={addNew} isFloatLeft={true} type={EButtonType.add} label={t('Add status')} />
                </Grid>
            </Grid>
            <Grid container gap={2} direction="column" item>
                {
                    !_.isNil(listStatusTemplate) && listStatusTemplate.map((item, index) => {
                        const statusItem = _.find(statusData, (x) => x.id === item.id)
                        if (_.isNil(statusItem)) return ''
                        return renderStatusItem({ ...statusItem, isCurrentSelected: item.isCurrentSelected }, index)
                    })
                }
            </Grid>
        </Grid>
    )
})

export default StatusTemplate