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
import { EFilterType, baseUrl } from "configs"

const TeamToolbar = (props) => {
    // console.log("render TeamToolbar")
    const { onApplyFilter, dataTeam } = props
    const { t } = useTranslation()
    const dispatch = useDispatch()
    const toolbarVisible = { ...useSelector((state) => state.master.toolbarVisible) }
    const columnVisibility = { ...useSelector((state) => state.team.columnVisibility) }
    const columnModel = [{
        field: "name", isShow: true, label: t("Tên nhóm"), type: EFilterType.text
    },
    {
        field: "description", isShow: true, label: t("Mô tả"), type: EFilterType.text
    },
    {
        field: "parentName", isShow: true, label: t("Nhóm cha"), type: EFilterType.text
    },
    // {
    //     field: "status", value: true, label: t("Trạng thái"), type: EFilterType.select
    // },
    {
        field: "createdDate", isShow: true, label: t("Ngày tạo"), type: EFilterType.datetime
    }]

    const handleColumnConfigChange = (event) => {
        columnVisibility[event.target.name] = event.target.checked
        dispatch(setColumnVisibility({ ...columnVisibility }))
    }

    const handleClickOpen = () => {
        dispatch(change_title(t("Thêm mới Nhóm")))
        dispatch(open())
    }

    return <div>
        <ToolBar component={baseUrl.jm_team} visible={toolbarVisible}
            onApplyFilter={onApplyFilter}
            onColumnConfigChange={handleColumnConfigChange} columnModel={columnModel}
            onAddClick={handleClickOpen} />
        <TeamPopup dataTeam={dataTeam} />
    </div>

}

TeamToolbar.propTypes = {
    onAddClick: PropTypes.func,
}

export default TeamToolbar