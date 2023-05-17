import React, { useState, useEffect } from 'react'
import Grid from "@mui/material/Grid"
import ButtonFuntion from 'components/button/ButtonFuntion'
import { EButtonType } from 'configs/enums'
import SingleAddSelect from 'components/select/SingleAddSelect'
import { useTranslation } from "react-i18next"
import ClickAwayListener from '@mui/material/ClickAwayListener'
import Box from "@mui/material/Box"
import _ from 'lodash'
import TagItem from './tagItem'
import { Controller } from "react-hook-form"

const TagControl = React.memo(props => {

    const { control, setValue, name, getValues } = props
    const { t } = useTranslation()
    const [isShowTagInput, setIsShowTagInput] = useState(false)
    const [tagData, setTagData] = useState([])
    const onAddTagClick = () => {
        setIsShowTagInput(true)
    }

    const onClickAway = () => {
        setIsShowTagInput(false)
    }

    const onDeleteTagClick = (item) => {
        if (!_.isNil(item)) {
            let lstTag = getValues(name)
            let tag = _.find(lstTag, (x) => x.id === item.id)
            if (!_.isNil(tag)) {
                tag.isDelete = true
                setValue(name, [...lstTag])
            }
        }
    }

    const renderTagItem = (values) => {
        if (_.isNil(values) || _.isEmpty(values))
            return ''
        let tags = _.filter(values, (x) => x.isDelete !== true)
        if (_.isEmpty(tags))
            return ''
        const aaa = _.map(tags, (x) => {
            return <TagItem onDeleteTagClick={onDeleteTagClick} key={x.id} tagItem={x} />
        })
        return aaa
    }

    const onSelectChange = (value) => {
        if (!_.isNil(value)) {
            let lstTag = getValues(name)
            lstTag.push(value)
            setValue(name, [...lstTag])
        }
    }

    return <Controller
        render={({ field, fieldState: { error } }) =>
            <ClickAwayListener onClickAway={onClickAway}>
                <Box>
                    <Grid container className='tag-control-contaier' xs item  direction="row" >
                        {renderTagItem(field?.value)}
                        {isShowTagInput ? <Grid item>
                            <SingleAddSelect
                                data={tagData}
                                width={150}
                                onSelectChange={onSelectChange}
                                freeSolo
                                control={control}
                                name="templateId"
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