import React from "react"
import { useTranslation } from "react-i18next"
import { useSelector } from "react-redux"
import { baseUrl } from "configs"
import GridData from "components/table/GridData"
import UploadIconImage from 'components/upload/uploadIcon/uploadIconImage'
import { cellFormatDate } from "helpers/commonFunction"
import { CellButton } from 'components/cellRender'

const ProjectGrid = React.memo((props) => {
    const { filterModels } = props
    const { t } = useTranslation()
    const columnVisibility = { ...useSelector((state) => state.project.columnVisibility) }

    const columns = [
        {
            checkboxSelection: true,
            resizable: false, width: 40, headerCheckboxSelection: true,
            pinned: 'left'
        },
        {
            field: "name", headerName: t("Tên dự án"),
            flex: 1,
            pinned: 'left'
        },
        {
            field: "startDate",
            headerName: t("Ngày bắt đầu"),
            suppressAutoSize: true,
            valueFormatter: cellFormatDate
        },
        {
            field: "endDate",
            headerName: t("Ngày kết thúc"),
            suppressAutoSize: true,
            valueFormatter: cellFormatDate
        },
        // {
        //     field: "icon", headerName: t("Biểu tượng"),
        //     suppressAutoSize: true,
        //     sortable: false,
        //     cellRenderer: (params) => {
        //         return params.data.icon ?
        //             <UploadIconImage color={params.data.color} src={params.data.icon} /> : ''
        //     }
        // },
        {
            field: "description",
            headerName: t("Mô tả"),
            flex: 1,
        },
        {
            field: "edit",
            headerName: "",
            width: 120,
            suppressAutoSize: true,
            cellRenderer: (params) => {
                return <strong>
                    <CellButton id={params.data.id} url={baseUrl.jm_project}/>
                </strong>
            },
            sortable: false,
        },
    ]

    return (
        <>
            <GridData
                url={baseUrl.jm_project}
                columnVisibility={columnVisibility}
                filterModels={filterModels}
                columns={columns}></GridData>
        </>
    )
})

export default ProjectGrid
