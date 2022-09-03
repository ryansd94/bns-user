import React from 'react'
import ToolBar from "components/toolbar/ToolBar"
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from "react-redux"
import {
    setColumnVisibility,
} from "stores/views/template"
import { useTranslation } from "react-i18next"
import { EFilterType } from "configs"
const TemplateToolbar = (props) => {
    console.log("render template toolbar")
    const { onApplyFilter } = props
    const { t } = useTranslation()
    const dispatch = useDispatch()
    const toolbarVisible = { ...useSelector((state) => state.master.toolbarVisible) }
    const columnVisibility = { ...useSelector((state) => state.template.columnVisibility) }
    const columnModel = [{
        field: "name", value: true, label: t("Tên mẫu"), type: EFilterType.text
    },
    {
        field: "description", value: true, label: t("Mô tả"), type: EFilterType.text
    },
    {
        field: "createdDate", value: true, label: t("Ngày tạo"), type: EFilterType.datetime
    }]
    const handleColumnConfigChange = (event) => {
        columnVisibility[event.target.name] = event.target.checked
        dispatch(setColumnVisibility({ ...columnVisibility }))
    }
    
    const handleClickOpen = () => {
        window.open(`/template/add`)
    }

    return <div>
        <ToolBar visible={toolbarVisible}
            onApplyFilter={onApplyFilter}
            onColumnConfigChange={handleColumnConfigChange} columnModel={columnModel}
            onAddClick={handleClickOpen} />
        {/* <TemplateAdd /> */}
    </div>

}
TemplateToolbar.propTypes = {
    onAddClick: PropTypes.func,
}
export default TemplateToolbar