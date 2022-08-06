import React from 'react'
import ToolBar from "components/toolbar/ToolBar"
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from "react-redux"
import {
    setColumnVisibility,
} from "stores/views/template"
import { useTranslation } from "react-i18next"
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { IconDelete } from "components/icon/icon"
import TemplateAdd from "./templateAdd/templateAdd"
import { open, change_title } from "components/popup/popupSlice"
import { useHistory } from 'react-router-dom'
import { EFilterType } from "configs"
const TemplateToolbar = (props) => {

    console.log("render template toolbar")
    const history = useHistory()
    const { onAddClick, onApplyFilter } = props
    const { t } = useTranslation()
    const dispatch = useDispatch()
    const visible = { ...useSelector((state) => state.template.toolbarVisible) }
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
    const a = (
        <MenuItem disableRipple>
            <IconDelete size={18} />
            Edit
        </MenuItem>
    )
    const handleClickOpen = () => {
        window.open(`/template/add`)
        // dispatch(change_title(t("Thêm mới mẫu công việc")))
        // dispatch(open())
    }

    return <div>
        <ToolBar dropdownItem={a} visible={visible}
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