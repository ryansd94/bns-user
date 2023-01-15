import React from "react"
import MenuItem from '@mui/material/MenuItem'
import { DropdownMenu } from 'components/dropdown'
import { useTranslation } from "react-i18next"
import _ from 'lodash'

const TaskChildAddButton = (props) => {
    const { taskId, taskTypeId } = props
    const { t } = useTranslation()
    const addNewTask = () => {
        window.open(`/task/create/${taskTypeId}?parentId=${taskId}`)
    }

    const genderDropdownItem = () => {
        return <div>
            <MenuItem disabled={!_.isNil(taskId) ? false : true} key={'addNew'} onClick={() => addNewTask()}>
                {t('Tạo mới công việc')}
            </MenuItem>
            <MenuItem key={'existing'} onClick={() => addNewTask()}>
                {t('Công việc đã có')}
            </MenuItem>
        </div >
    }
    return (
        <div>
            <DropdownMenu spacingLeft={0} isFloatLeft={true} label={t('Thêm công việc con')} isShowEndIcon={false} visible={true} genderDropdownItem={genderDropdownItem} />
        </div>
    )
}

export default TaskChildAddButton