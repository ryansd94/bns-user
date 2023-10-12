import React from "react"
import MenuItem from '@mui/material/MenuItem'
import { DropdownMenu } from 'components/dropdown'
import { useTranslation } from "react-i18next"
import { getPathItem } from "helpers"
import _ from 'lodash'

const TaskChildAddButton = (props) => {
    const { taskId, taskTypeId } = props
    const { t } = useTranslation()
    const addNewTask = () => {
        window.open(getPathItem(`/task/create/${taskTypeId}?parentId=${taskId}`))
    }

    const renderDropdownItem = () => {
        return <div>
            <MenuItem key={'addNew'} onClick={() => addNewTask()}>
                {t('Add new task')}
            </MenuItem>
            <MenuItem disabled={!_.isNil(taskId) ? false : true} key={'existing'} onClick={() => addNewTask()}>
                {t('Task existing')}
            </MenuItem>
        </div >
    }
    return (
        <div>
            <DropdownMenu spacingLeft={0} isFloatLeft={true} label={t('Add child task')} isShowEndIcon={false} visible={true} renderDropdownItem={renderDropdownItem} />
        </div>
    )
}

export default TaskChildAddButton