import React from 'react'
import ToolBar from "components/toolbar/ToolBar"
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from "react-redux"
import {
    setColumnVisibility,
} from "stores/views/user"
import { useTranslation } from "react-i18next"
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import { IconDelete } from "components/icon/icon"
import UserPopup from "./UserPopup"
import { open, change_title } from "components/popup/popupSlice"
import { EFilterType } from "configs"
const UserToolbar = (props) => {
    console.log("render user toolbar")
    const { onAddClick, onApplyFilter } = props
    const { t } = useTranslation()
    const dispatch = useDispatch()
    const toolbarVisible = { ...useSelector((state) => state.master.toolbarVisible) }
    const columnVisibility = { ...useSelector((state) => state.user.columnVisibility) }

    const columnModel = [{
        field: "email", isShow: true, label: t("Email"), type: EFilterType.text
    },
    {
        field: "fullName", isShow: true, label: t("Full name"), type: EFilterType.text
    },
    {
        field: "teamName", isShow: true, label: t("Team"), type: EFilterType.text
    },
    {
        field: "status", isShow: true, label: t("Status"), type: EFilterType.select
    },
    {
        field: "createdDate", isShow: true, label: t("Date created"), type: EFilterType.datetime
    }]

    const handleColumnConfigChange = (event) => {
        columnVisibility[event.target.name] = event.target.checked
        dispatch(setColumnVisibility({ ...columnVisibility }))
    }

    const handleClickOpen = () => {
        dispatch(change_title(t("Add new user")))
        dispatch(open())
    }

    return <div>
        <ToolBar visible={toolbarVisible}
            onApplyFilter={onApplyFilter}
            onColumnConfigChange={handleColumnConfigChange} columnModel={columnModel}
            onAddClick={handleClickOpen} />
        <UserPopup />
    </div>

}

UserToolbar.propTypes = {
    onAddClick: PropTypes.func,
}

export default UserToolbar