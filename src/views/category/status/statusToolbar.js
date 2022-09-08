import React from 'react'
import ToolBar from "components/toolbar/ToolBar"
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from "react-redux"
import {
    setColumnVisibility,
} from "stores/views/status"
import { useTranslation } from "react-i18next"
import { EFilterType } from "configs"
import { open, change_title } from "components/popup/popupSlice"

const StatusToolbar = (props) => {
    const { onApplyFilter } = props
    const { t } = useTranslation()
    const dispatch = useDispatch()
    const toolbarVisible = { ...useSelector((state) => state.master.toolbarVisible) }
    const columnVisibility = { ...useSelector((state) => state.status.columnVisibility) }

    const columnModel = [{
        field: "name", value: true, label: t("Tên trạng thái"), type: EFilterType.text
    },
    {
        field: "color", value: true, label: t("Màu sắc"), type: EFilterType.text
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
        dispatch(change_title(t("Thêm mới trạng thái")))
        dispatch(open())
    }

    return <div>
        <ToolBar visible={toolbarVisible}
            onApplyFilter={onApplyFilter}
            onColumnConfigChange={handleColumnConfigChange} columnModel={columnModel}
            onAddClick={handleClickOpen} />
    </div>

}
StatusToolbar.propTypes = {
    onAddClick: PropTypes.func,
}
export default StatusToolbar