import React, { useEffect, useState } from "react"
import MenuItem from '@mui/material/MenuItem'
import { DropdownMenu } from 'components/dropdown'
import { get } from "services"
import { baseUrl } from "configs"
import TaskTypeMenuItem from './taskTypeMenuItem'

const TaskTypeMenu = (props) => {
    const [taskTypies, setTaskType] = useState([])

    const openTaskView = (item) => {
        window.open(`/task/create/${item.id}`)
    }

    useEffect(() => {
        fetchTaskType()
    }, [])

    const fetchTaskType = async () => {
        await get(baseUrl.jm_taskType, {
            isGetAll: true,
        }).then((data) => {
            setTaskType(data && data.data && data.data.items)
        })
    }

    const genderDropdownItem = () => {
        return <div>
            {taskTypies && taskTypies.map((item) => {
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