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
import { EControlType, baseUrl } from "configs"

const TaskTypeToolbar = (props) => {
    const { onApplyFilter } = props
    const { t } = useTranslation()
    const dispatch = useDispatch()
    const toolbarVisible = { ...useSelector((state) => state.master.toolbarVisible) }
    const columnVisibility = { ...useSelector((state) => state.taskType.columnVisibility) }
    const columnModel = [{
        field: "name", isShow: true, label: t("Task type name"), type: EControlType.textField
    },
    {
        field: "templateName", isShow: true, label: t("Task template"), type: EControlType.textField
    },
    {
        field: "description", isShow: true, label: t("Description"), type: EControlType.textField
    },
    {
        field: "icon", isShow: true, label: t("Icon"), type: EControlType.textField, isHideFilter: true
    },
    {
        field: "createdDate", isShow: true, label: t("Date created"), type: EControlType.datetime
    }]
    
    const handleColumnConfigChange = (event) => {
        columnVisibility[event.target.name] = event.target.checked
        dispatch(setColumnVisibility({ ...columnVisibility }))
    }

    const handleClickOpen = () => {
        dispatch(change_title(t("Add new task type")))
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