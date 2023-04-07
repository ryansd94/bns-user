import React from 'react'
import ToolBar from "components/toolbar/ToolBar"
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from "react-redux"
import {
    setColumnVisibility,
} from "stores/views/project"
import { useTranslation } from "react-i18next"
import ProjectPopup from "./projectPopup"
import { open, change_title } from "components/popup/popupSlice"
import { EFilterType, baseUrl } from "configs"

const ProjectToolbar = (props) => {
    const { onApplyFilter } = props
    const { t } = useTranslation()
    const dispatch = useDispatch()
    const toolbarVisible = { ...useSelector((state) => state.master.toolbarVisible) }
    const columnVisibility = { ...useSelector((state) => state.project.columnVisibility) }
    const columnModel = [{
        field: "name", isShow: true, label: t("Tên loại công việc"), type: EFilterType.text
    },
    {
        field: "templateName", isShow: true, label: t("Mẫu công việc"), type: EFilterType.text
    },
    {
        field: "description", isShow: true, label: t("Mô tả"), type: EFilterType.text
    },
    {
        field: "icon", isShow: true, label: t("Biểu tượng"), type: EFilterType.text, isHideFilter: true
    },
    {
        field: "createdDate", isShow: true, label: t("Ngày tạo"), type: EFilterType.datetime
    }]

    const handleColumnConfigChange = (event) => {
        columnVisibility[event.target.name] = event.target.checked
        dispatch(setColumnVisibility({ ...columnVisibility }))
    }

    const handleClickOpen = () => {
        dispatch(change_title(t("Thêm mới dự án")))
        dispatch(open())
    }

    return <div>
        <ToolBar component={baseUrl.jm_taskType}
            visible={toolbarVisible}
            onApplyFilter={onApplyFilter}
            onColumnConfigChange={handleColumnConfigChange} columnModel={columnModel}
            onAddClick={handleClickOpen} />
        <ProjectPopup />
    </div>

}

ProjectToolbar.propTypes = {
    onAddClick: PropTypes.func,
}

export default ProjectToolbar