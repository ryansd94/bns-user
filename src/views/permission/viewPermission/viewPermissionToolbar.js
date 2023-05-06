import ToolBar from "components/toolbar/ToolBar"
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from "react-redux"
import {
    setColumnVisibility,
} from "stores/views/project"
import { useTranslation } from "react-i18next"
import ViewPermissionPopup from "./viewPermissionPopup"
import { open, change_title } from "components/popup/popupSlice"
import { EFilterType, baseUrl } from "configs"

const ViewPermissionToolbar = (props) => {
    const { onApplyFilter, users, teams } = props
    const { t } = useTranslation()
    const dispatch = useDispatch()
    const toolbarVisible = { ...useSelector((state) => state.master.toolbarVisible) }
    const columnVisibility = { ...useSelector((state) => state.viewPermission.columnVisibility) }
    const columnModel = [{
        field: "name", isShow: true, label: t("Tên quyền"), type: EFilterType.text
    },
    {
        field: "description", isShow: true, label: t("Mô tả"), type: EFilterType.text
    },
    {
        field: "createdDate", isShow: true, label: t("Ngày tạo"), type: EFilterType.datetime
    }]

    const handleColumnConfigChange = (event) => {
        columnVisibility[event.target.name] = event.target.checked
        dispatch(setColumnVisibility({ ...columnVisibility }))
    }

    const handleClickOpen = () => {
        dispatch(change_title(t("Thêm mới quyền")))
        dispatch(open())
    }

    return <div>
        <ToolBar component={baseUrl.jm_taskType}
            visible={toolbarVisible}
            onApplyFilter={onApplyFilter}
            onColumnConfigChange={handleColumnConfigChange} columnModel={columnModel}
            onAddClick={handleClickOpen} />
        <ViewPermissionPopup users={users} teams={teams} />
    </div>

}

ViewPermissionToolbar.propTypes = {
    onAddClick: PropTypes.func,
}

export default ViewPermissionToolbar