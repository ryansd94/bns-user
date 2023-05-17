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
        field: "name", isShow: true, label: t("Project name"), type: EFilterType.text
    },
    {
        field: "code", isShow: true, label: t("Project code"), type: EFilterType.text
    },
    {
        field: "startDate", isShow: true, label: t("Start date"), type: EFilterType.datetime
    },
    {
        field: "endDate", isShow: true, label: t("End date"), type: EFilterType.datetime
    },
    {
        field: "description", isShow: true, label: t("Description"), type: EFilterType.text
    },
    {
        field: "createdDate", isShow: true, label: t("Ngày tạo"), type: EFilterType.datetime
    }]

    const handleColumnConfigChange = (event) => {
        columnVisibility[event.target.name] = event.target.checked
        dispatch(setColumnVisibility({ ...columnVisibility }))
    }

    const handleClickOpen = () => {
        dispatch(change_title(t("Add new project")))
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