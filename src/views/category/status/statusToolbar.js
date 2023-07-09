import React from 'react'
import ToolBar from "components/toolbar/ToolBar"
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from "react-redux"
import {
    setColumnVisibility,
} from "stores/views/status"
import { useTranslation } from "react-i18next"
import { EControlType } from "configs"
import { open, change_title } from "components/popup/popupSlice"

const StatusToolbar = (props) => {
    const { onApplyFilter } = props
    const { t } = useTranslation()
    const dispatch = useDispatch()
    const toolbarVisible = { ...useSelector((state) => state.master.toolbarVisible) }
    const columnVisibility = { ...useSelector((state) => state.status.columnVisibility) }

    const columnModel = [{
        field: "name", isShow: true, label: t("Status name"), type: EControlType.textField
    },
    {
        field: "color", isShow: true, label: t("Color"), type: EControlType.textField
    },
    {
        field: "description", isShow: true, label: t("Description"), type: EControlType.textField
    },
    {
        field: "isStatusStart", isShow: true, label: t("Start status"), type: EControlType.checkBox
    },
    {
        field: "isStatusEnd", isShow: true, label: t("End status"), type: EControlType.checkBox
    },
    {
        field: "createdDate", isShow: true, label: t("Date created"), type: EControlType.datetime
    }]

    const handleColumnConfigChange = (event) => {
        columnVisibility[event.target.name] = event.target.checked
        dispatch(setColumnVisibility({ ...columnVisibility }))
    }

    const handleClickOpen = () => {
        dispatch(change_title(t("Add new status")))
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