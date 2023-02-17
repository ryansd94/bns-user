import React, { useEffect, useState } from 'react'
import ToolBar from "components/toolbar/ToolBar"
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from "react-redux"
import {
    setColumnVisibility,
} from "stores/views/task"
import { useTranslation } from "react-i18next"
import { EFilterType, baseUrl } from "configs"
import TaskTypeMenu from './taskTypeMenu'
import _ from 'lodash'

const TaskToolbar = (props) => {
    const { onApplyFilter, customColumns } = props
    const { t } = useTranslation()
    const dispatch = useDispatch()
    const toolbarVisible = { ...useSelector((state) => state.task.toolbarVisible) }
    const columnVisibility = { ...useSelector((state) => state.task.columnVisibility) }

    const [columnModels, setColumnModel] = useState([{
        field: "title", isShow: true, label: t("Tiêu đề"), type: EFilterType.text
    },
    {
        field: "status.Name", isShow: true, label: t("Trạng thái"), type: EFilterType.text
    },
    {
        field: "estimatedhour", isShow: true, label: t("Thời gian ước tính"), type: EFilterType.text
    },
    {
        field: "tags", isShow: true, label: t("Nhãn"), type: EFilterType.text
    },
    {
        field: "taskType.name", isShow: true, label: t("Loại công việc"), type: EFilterType.text
    },
    {
        field: "startDate", isShow: true, label: t("Ngày bắt đầu"), type: EFilterType.datetime
    },
    {
        field: "dueDate", isShow: true, label: t("Ngày hết hạn"), type: EFilterType.datetime
    },
    {
        field: "createdDate", isShow: true, label: t("Ngày tạo"), type: EFilterType.datetime
    },
    {
        field: "createdUser.fullName", isShow: true, label: t("Người tạo"), type: EFilterType.text
    }
    ])

    useEffect(() => {
        customColumns && customColumns.map((item) => {
            columnModels.push({
                field: item.id,
                label: item.name,
                isShow: true,
                width: 110,
                type: EFilterType.text,
                isCustom : true
            })
        })
        setColumnModel([...columnModels])
    }, [customColumns])

    const handleColumnConfigChange = (event) => {
        columnVisibility[event.target.name] = event.target.checked
        let columnModel = _.first(_.filter(columnModels, (item) => {
            return item.field === event.target.name
        }))
        if (!_.isNil(columnModel)) {
            columnModel.isShow = event.target.checked
        }
        dispatch(setColumnVisibility(columnVisibility))
    }

    const handleClickOpen = () => {
        //window.open(`/task/taskIiew`)
    }

    const genarateCustomButton = () => {
        return <TaskTypeMenu />
    }

    return <div>
        <ToolBar component={baseUrl.jm_task}
            visible={toolbarVisible}
            onApplyFilter={onApplyFilter}
            genarateCustomButton={genarateCustomButton}
            onColumnConfigChange={handleColumnConfigChange}
            columnModel={columnModels}
            onAddClick={handleClickOpen} />
    </div>

}

TaskToolbar.propTypes = {
    onAddClick: PropTypes.func,
}

export default TaskToolbar