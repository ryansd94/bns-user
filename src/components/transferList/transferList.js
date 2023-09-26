import { useState, useCallback, useEffect } from "react"
import { useTranslation } from "react-i18next"
import Grid from "@mui/material/Grid"
import { CheckBoxControl } from 'components/checkbox'
import { Group } from 'components/layout'
import ButtonIcon from "components/button/ButtonIcon"
import { EButtonIconType, EControlType } from "configs"
import { useForm } from "react-hook-form"

const TransferList = (props) => {
    const { items = [], name,
        renderItem, setValueData,
        leftTitle, rightTitle, onChange, getValueData } = props
    const [lstItemAll, setLstItemAll] = useState(items)
    const [lstItemApply, setLstItemApply] = useState(getValueData(name))
    const [disabledSwitchRight, setDisabledSwitchRight] = useState(true)
    const [disabledSwitchLeft, setDisabledSwitchLeft] = useState(true)
    const { t } = useTranslation()

    const {
        setValue,
        getValues,
        control
    } = useForm({
    })

    useEffect(() => {
        const itemApllyIds = getValueData(name) || []
        const lstItemSelected = _.filter(lstItemAll, (x) => _.includes(itemApllyIds, x.id))
        const lstItemNotSelected = _.filter(lstItemAll, (x) => !_.includes(itemApllyIds, x.id))
        setLstItemApply([...lstItemSelected])
        setLstItemAll([...lstItemNotSelected])
    }, [])

    const onCheckAllItem = ({ value }) => {
        let itemSelected = []
        _.map(lstItemAll, (item) => {
            setValue(item.id, value)
            if (value === true) {
                itemSelected.push(item.id)
            }
        })
        setValue('item-selected', itemSelected)
        setDisabledSwitchRight(_.isEmpty(itemSelected))
    }

    const onCheckAllItemApply = ({ value }) => {
        let itemSelected = []
        _.map(lstItemApply, (item) => {
            setValue(`${item.id}-apply`, value)
            if (value === true) {
                itemSelected.push(item.id)
            }
        })
        setValue('item-apply-selected', itemSelected)
        setDisabledSwitchLeft(_.isEmpty(itemSelected))
    }

    const onChangeSelectedItemNotApply = (value, itemId) => {
        let lstItemSelected = getValues('item-selected') || []
        if (value === false) {
            setValue('all', false)
            lstItemSelected = _.filter(lstItemSelected, (item) => item !== itemId)
            setValue('item-selected', lstItemSelected)
        } else {
            const itemSelected = _.find(lstItemAll, (item) => item.id === itemId)
            if (!_.isNil(itemSelected)) {
                lstItemSelected.push(itemId)
                setValue('item-selected', lstItemSelected)
            }
        }
        setDisabledSwitchRight(_.isEmpty(lstItemSelected))
    }

    const onChangeSelectedItemApply = (value, itemId) => {
        let lstItemSelected = getValues('item-apply-selected') || []
        if (value === false) {
            setValue('all-apply', false)
            lstItemSelected = _.filter(lstItemSelected, (item) => item !== itemId)
            setValue('item-apply-selected', lstItemSelected)
        } else {
            const itemSelected = _.find(lstItemApply, (item) => item.id === itemId)
            if (!_.isNil(itemSelected)) {
                lstItemSelected.push(itemId)
                setValue('item-apply-selected', lstItemSelected)
            }
        }
        setDisabledSwitchLeft(_.isEmpty(lstItemSelected))
    }

    const onSwitchRight = (event) => {
        event.preventDefault()
        const itemSelectedIds = getValues('item-selected')
        if (!_.isEmpty(itemSelectedIds)) {
            const lstItemSelected = _.filter(lstItemAll, (x) => _.includes(itemSelectedIds, x.id))
            const lstItemNotSelected = _.filter(lstItemAll, (x) => !_.includes(itemSelectedIds, x.id))
            lstItemApply.push(...lstItemSelected)
            setLstItemApply([...lstItemApply])
            setLstItemAll([...lstItemNotSelected])
            setValue('item-selected', [])
            _.map(lstItemSelected, (item) => {
                setValue(item.id, false)
            })
            const lstIdApply = _.map(lstItemApply, (x) => { return x.id })
            onChange && onChange({ value: lstIdApply, name, type: EControlType.transferList })
            setValueData && setValueData(name, lstIdApply)
        }
        setDisabledSwitchRight(true)
        setValue('all', false)
    }

    const onSwitchLeft = (event) => {
        event.preventDefault()
        const itemSelectedIds = getValues('item-apply-selected')
        if (!_.isEmpty(itemSelectedIds)) {
            const lstItemSelected = _.filter(lstItemApply, (x) => _.includes(itemSelectedIds, x.id))
            const lstItemNotSelected = _.filter(lstItemApply, (x) => !_.includes(itemSelectedIds, x.id))
            lstItemAll.push(...lstItemSelected)
            setLstItemAll([...lstItemAll])
            setLstItemApply([...lstItemNotSelected])
            setValue('item-apply-selected', [])
            _.map(lstItemSelected, (item) => {
                setValue(`${item.id}-apply`, false)
            })
            const lstIdApply = _.map(lstItemNotSelected, (x) => { return x.id })
            onChange && onChange({ value: lstIdApply, name, type: EControlType.transferList })
            setValueData && setValueData(name, lstIdApply)
        }
        setDisabledSwitchLeft(true)
        setValue('all-apply', false)
    }

    const renderAllItem = () => {
        return <Grid container gap={2} direction='column'>
            <Grid item container direction='row' className="border-bottom padding-bottom">
                <CheckBoxControl disabled={_.isEmpty(lstItemAll) ? true : false} onChange={onCheckAllItem} control={control} name='all' label={t('All')} />
            </Grid>
            {
                _.isEmpty(lstItemAll) ? renderEmptyRow() : _.map(lstItemAll, (item) => {
                    return <Grid key={item.id} gap={1} container direction='row' alignItems='center' className='no-wrap'>
                        <Grid item>
                            <CheckBoxControl onChange={({ value }) => onChangeSelectedItemNotApply(value, item.id)} control={control} name={item.id} />
                        </Grid>
                        {renderItem && renderItem(item)}
                    </Grid>
                })
            }
        </Grid>
    }

    const renderEmptyRow = () => {
        return <Grid className="italic" item>{t('No data displayed')}</Grid>
    }

    const renderItemApply = useCallback(() => {
        return <Grid container gap={2} direction='column'>
            <Grid item container direction='row' className="border-bottom padding-bottom">
                <CheckBoxControl disabled={_.isEmpty(lstItemApply) ? true : false} onChange={onCheckAllItemApply} control={control} name='all-apply' label={t('All')} />
            </Grid>
            {
                _.isEmpty(lstItemApply) ? renderEmptyRow() : _.map(lstItemApply, (item) => {
                    return <Grid key={item.id} gap={1} container direction='row' alignItems='center' className='no-wrap'>
                        <Grid item>
                            <CheckBoxControl onChange={({ value }) => onChangeSelectedItemApply(value, item.id)} control={control} name={`${item.id}-apply`} />
                        </Grid>
                        {renderItem && renderItem(item)}
                    </Grid>
                })
            }
        </Grid>
    }, [lstItemApply])

    return <Grid container direction='row'>
        <Grid item xs className='body-content'>
            <Group content={renderAllItem()} title={leftTitle} />
        </Grid>
        <Grid item className='body-content' gap={2} justifyContent='center' flexDirection={'column'} flexGrow={0}>
            <Grid item>
                <ButtonIcon color={'primary'} onClick={onSwitchRight} disabled={disabledSwitchRight} type={EButtonIconType.switchRight} />
            </Grid>
            <Grid item>
                <ButtonIcon color={'primary'} onClick={onSwitchLeft} disabled={disabledSwitchLeft} type={EButtonIconType.switchLeft} />
            </Grid>
        </Grid>
        <Grid item xs className='body-content'>
            <Group content={renderItemApply()} title={rightTitle} />
        </Grid>
    </Grid>
}

export default TransferList