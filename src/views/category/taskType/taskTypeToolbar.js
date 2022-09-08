import React from 'react'
import ToolBar from "components/toolbar/ToolBar"
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from "react-redux"
import {
    setColumnVisibility,
} from "stores/views/taskType"
import { useTranslation } from "react-i18next"
import TaskTypePopup from "./taskTypePopup"
import { open, change_title } from "components/popup/popupSlice"
import { EFilterType, baseUrl } from "configs"

const TaskTypeToolbar = (props) => {
    const { onApplyFilter } = props
    const { t } = useTranslation()
    const dispatch = useDispatch()
    const toolbarVisible = { ...useSelector((state) => state.master.toolbarVisible) }
    const columnVisibility = { ...useSelector((state) => state.taskType.columnVisibility) }
    const columnModel = [{
        field: "name", value: true, label: t("Tên loại công việc"), type: EFilterType.text
    },
    {
        field: "templateName", value: true, label: t("Mẫu công việc"), type: EFilterType.text
    },
    {
        field: "description", value: true, label: t("Mô tả"), type: EFilterType.text
    },
    {
        field: "icon", value: true, label: t("Biểu tượng"), type: EFilterType.text, isHideFilter: true
    },
    {
        field: "createdDate", value: true, label: t("Ngày tạo"), type: EFilterType.datetime
    }]
    
    const handleColumnConfigChange = (event) => {
        columnVisibility[event.target.name] = event.target.checked
        dispatch(setColumnVisibility({ ...columnVisibility }))
    }

    const handleClickOpen = () => {
        dispatch(change_title(t("Thêm mới Loại công việc")))
        dispatch(open())
    }

    return <div>
        <ToolBar component={baseUrl.jm_taskType} visible={toolbarVisible}
            onApplyFilter={onApplyFilter}
            onColumnConfigChange={handleColumnConfigChange} columnModel={columnModel}
            onAddClick={handleClickOpen} />
        <TaskTypePopup />
    </div>

}

TaskTypeToolbar.propTypes = {
    onAddClick: PropTypes.func,
}

export default TaskTypeToolbar