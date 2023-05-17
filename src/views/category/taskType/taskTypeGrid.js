import { useTranslation } from "react-i18next"
import { useSelector } from "react-redux"
import { baseUrl } from "configs"
import GridData from "components/table/GridData"
import UploadIconImage from 'components/upload/uploadIcon/uploadIconImage'
import { CellButton } from 'components/cellRender'

const TaskTypeGrid = (props) => {
    const { filterModels } = props
    const { t } = useTranslation()
    const columnVisibility = { ...useSelector((state) => state.taskType.columnVisibility) }

    const columns = [
        {
            checkboxSelection: true,
            resizable: false, width: 40, headerCheckboxSelection: true,
            pinned: 'left'
        },
        {
            field: "name", headerName: t("Task type name"),
            flex: 1,
            pinned: 'left'
        },
        {
            field: "templateName", headerName: t("Task template"),
        },
        {
            field: "icon", headerName: t("Icon"),
            suppressAutoSize: true,
            sortable: false,
            cellRenderer: (params) => {
                return params.data.icon ?
                    <UploadIconImage color={params.data.color} src={params.data.icon} /> : ''
            }
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
                    <CellButton id={params.data.id} url={baseUrl.jm_taskType} />
                </strong>
            },
            sortable: false,
        },
    ]

    return (
        <GridData
            url={baseUrl.jm_taskType}
            columnVisibility={columnVisibility}
            filterModels={filterModels}
            columns={columns}></GridData>
    )
}

export default TaskTypeGrid
