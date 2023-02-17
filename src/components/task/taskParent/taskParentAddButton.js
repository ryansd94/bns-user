import React, { useState, useEffect } from "react"
import SingleAddSelect from 'components/select/SingleAddSelect'
import _ from 'lodash'
import { get } from "services"
import { baseUrl } from "configs"
import TaskOptionItem from './../taskOptionItem'
import Box from '@mui/material/Box'
import { useTranslation } from "react-i18next"
import { Controller } from "react-hook-form"

const TaskParentAddButton = (props) => {
    const { control, defaultData = [], name, setValue } = props
    const { t } = useTranslation()
    const [data, setData] = useState(defaultData)

    const onInputChangeTaskChange = async (event, value) => {
        if (!_.isEmpty(value)) {
            await get(baseUrl.jm_task, {
                isGetAll: true,
                filters: JSON.stringify([{ "column": "title", "condition": 2, "value": value, "type": "Text" }])
            }).then((data) => {
                const returnData = data && data.data && data.data.items && _.map(data.data.items, (item) => { return { id: item.id, name: item.title, ...item } })
                setData(returnData)
            })
        }
    }

    const renderOption = (props, option) => {
        return <Box {...props} key={option.id}><TaskOptionItem item={option} /></Box>
    }

    const onSelectChange = (value) => {
        const taskParent = _.find(data, (x) => x.id === value)
        setValue(name, taskParent)
    }

    return <Controller
        render={({ field, fieldState: { error } }) =>
            <div>{
                !_.isNil(field?.value) ?  '' : (<SingleAddSelect
                    data={data}
                    freeSolo
                    onSelectChange={onSelectChange}
                    placeholder={t('Nhập Id hoặc tiêu đề')}
                    renderOption={renderOption}
                    isAddWhenNoOption={false}
                    onInputChange={onInputChangeTaskChange}
                    control={control}
                    name={'parentId'}
                />)
            }</div>}
        name={name}
        control={control && control}
    />
}

export default TaskParentAddButton