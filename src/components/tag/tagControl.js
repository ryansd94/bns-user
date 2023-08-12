import React, { useState, useEffect } from 'react'
import Grid from "@mui/material/Grid"
import ButtonFuntion from 'components/button/ButtonFuntion'
import { EButtonType, ERowStatus, EControlType } from 'configs/enums'
import SingleAddSelect from 'components/select/SingleAddSelect'
import { useTranslation } from "react-i18next"
import ClickAwayListener from '@mui/material/ClickAwayListener'
import Box from "@mui/material/Box"
import _ from 'lodash'
import TagItem from './tagItem'
import { Controller } from "react-hook-form"

const TagControl = React.memo(props => {

    const { control, setValue, name, getValues, data, onChange } = props
    const { t } = useTranslation()
    const [isShowTagInput, setIsShowTagInput] = useState(false)
    const onAddTagClick = () => {
        setIsShowTagInput(true)
    }

    const onClickAway = () => {
        setIsShowTagInput(false)
    }

    const onDeleteTagClick = (item) => {
        if (!_.isNil(item)) {
            const id = item.id
            let lstTag = getValues(name)
            if (item.isAddNew !== true) {
                let tags = _.find(lstTag, (x) => x.id === id)
                if (!_.isNil(tags)) {
                    tags.isDelete = true
                }
            } else {
                lstTag = _.filter(lstTag, (x) => x.id !== id)
            }
            onChange && onChange({ value: item, name, type: EControlType.listObject, isDelete: true })
            setValue(name, [...lstTag])
        }
    }

    const renderTagItem = (values) => {
        if (_.isNil(values) || _.isEmpty(values))
            return ''
        let tags = _.filter(values, (x) => x.isDelete !== true)
        if (_.isEmpty(tags))
            return ''
        return _.map(tags, (item) => {
            if (item.isAddNew !== true) {
                item = _.find(data, (x) => x.id === item.id)
            }
            return !_.isNil(item) ? <TagItem onDeleteTagClick={onDeleteTagClick} key={item.id} tagItem={item} /> : ''
        })
    }

    const onSelectChange = ({ value }) => {
        if (!_.isNil(value)) {
            let lstTag = _.cloneDeep(getValues(name))
            let newValue = _.cloneDeep(value)
            if (value.isAddNew === true) {
                lstTag.push(newValue)
            } else {
                newValue = { id: value }
                lstTag.push(newValue)
            }
            onChange && onChange({ value: { ...newValue, rowStatus: ERowStatus.addNew }, name, type: EControlType.listObject })
            setValue(name, [...lstTag])
            setValue('tagId', null)
        }
    }

    return <Controller
        render={({ field, fieldState: { error } }) =>
            <ClickAwayListener onClickAway={onClickAway}>
                <Box>
                    <Grid container className='tag-control-contaier' xs item direction="row" >
                        {renderTagItem(field?.value)}
                        {isShowTagInput ? <Grid item>
                            <SingleAddSelect
                                data={data}
                                width={150}
                                onSelectChange={onSelectChange}
                                freeSolo
                                control={control}
                                name="tagId"
                                placeholder={t("Add tags")}
                            />
                        </Grid> : ''}
                        <Grid item>
                            <ButtonFuntion isTextAndIcon={false} onClick={onAddTagClick} type={EButtonType.addTag} />
                        </Grid>
                    </Grid>
                </Box>
            </ClickAwayListener>
        }
        name={name}
        control={control && control}
    />
})

export default TagControl