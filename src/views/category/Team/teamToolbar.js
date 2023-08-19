import React from 'react'
import ToolBar from "components/toolbar/ToolBar"
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from "react-redux"
import {
    setColumnVisibility,
} from "stores/views/team"
import { useTranslation } from "react-i18next"
import TeamPopup from "./TeamPopup"
import { open, change_title } from "components/popup/popupSlice"
import { EControlType, baseUrl } from "configs"

const TeamToolbar = (props) => {
    // console.log("render TeamToolbar")
    const { onApplyFilter, dataTeam, dataUsers } = props
    const { t } = useTranslation()
    const dispatch = useDispatch()
    const toolbarVisible = { ...useSelector((state) => state.master.toolbarVisible) }
    const columnVisibility = { ...useSelector((state) => state.team.columnVisibility) }
    const columnModel = [{
        field: "name", isShow: true, label: t("Team name"), type: EControlType.textField
    },
    {
        field: "description", isShow: true, label: t("Description"), type: EControlType.textField
    },
    {
        field: "parent.Name", isShow: true, label: t("Team parent"), type: EControlType.textField
    },
    // {
    //     field: "status", value: true, label: t("Trạng thái"), type: EControlType.select
    // },
    {
        field: "createdDate", isShow: true, label: t("Date created"), type: EControlType.datetime
    }]

    const handleColumnConfigChange = (event) => {
        columnVisibility[event.target.name] = event.target.checked
        dispatch(setColumnVisibility({ ...columnVisibility }))
    }

    const handleClickOpen = () => {
        dispatch(change_title(t("Add new team")))
        dispatch(open())
    }

    return <div>
        <ToolBar component={baseUrl.jm_team} visible={toolbarVisible}
            onApplyFilter={onApplyFilter}
            onColumnConfigChange={handleColumnConfigChange} columnModel={columnModel}
            onAddClick={handleClickOpen} />
        <TeamPopup dataTeam={dataTeam} dataUsers={dataUsers} />
    </div>

}

TeamToolbar.propTypes = {
    onAddClick: PropTypes.func,
}

export default TeamToolbar