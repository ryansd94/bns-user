import { useTranslation } from "react-i18next"
import { useSelector } from "react-redux"
import { baseUrl } from "configs"
import GridData from "components/table/GridData"
import { CellButton } from 'components/cellRender'

const ViewPermissionGrid = (props) => {
    const { filterModels } = props
    const { t } = useTranslation()
    const columnVisibility = { ...useSelector((state) => state.viewPermission.columnVisibility) }

    const columns = [
        {
            checkboxSelection: true,
            resizable: false, width: 40, headerCheckboxSelection: true,
            pinned: 'left'
        },
        {
            field: "name", headerName: t("Permission name"),
            flex: 1,
            pinned: 'left'
        },
        {
            field: "description",
            headerName: t("Description"),
            flex: 1,
        },
        {
            field: "edit",
            headerName: "",
            width: 120,
            suppressAutoSize: true,
            cellRenderer: (params) => {
                return <strong>
                    <CellButton id={params.data.id} url={baseUrl.sys_viewPermission} />
                </strong>
            },
            sortable: false,
        },
    ]

    return (
        <GridData
            url={baseUrl.sys_viewPermission}
            columnVisibility={columnVisibility}
            filterModels={filterModels}
            columns={columns}></GridData>
    )
}

export default ViewPermissionGrid
