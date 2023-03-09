import React, { useEffect, useState } from "react"
import MenuItem from '@mui/material/MenuItem'
import { DropdownMenu } from 'components/dropdown'
import { get } from "services"
import { baseUrl } from "configs"
import TaskTypeMenuItem from './taskTypeMenuItem'

const TaskTypeMenu = (props) => {
    const { taskTypes = [] } = props

    const openTaskView = (item) => {
        window.open(`/task/create/${item.id}`)
    }

    const genderDropdownItem = () => {
        return <div>
            {taskTypes && taskTypes.map((item) => {
                return <MenuItem key={item.id} id={item.id} onClick={() => openTaskView(item)}>
                    <TaskTypeMenuItem {...item} />
                </MenuItem>
            })}
        </div>
    }

    return (
        <div>
            <DropdownMenu isShowEndIcon={false} visible={true} genderDropdownItem={genderDropdownItem} />
        </div>
    )
}

export default TaskTypeMenu