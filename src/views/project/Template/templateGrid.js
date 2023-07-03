import React, { useState } from "react"
import GridData from "components/table/GridData"
import { useTranslation } from "react-i18next"
import { useSelector } from "react-redux"
import { baseUrl } from "configs"
import { formatDate } from "helpers/commonFunction"
import { LinkControl } from 'components/link'
import { CellButton } from 'components/cellRender'
import { getPathItem } from "helpers"

const TemplateGrid = React.memo((props) => {
    console.log("render TemplateGrid")
    const { filterModels } = props
    const { t } = useTranslation()
    const columnVisibility = { ...useSelector((state) => state.template.columnVisibility) }
    const loading = useSelector((state) => state.master.loading)

    const [column, setColumn] = useState([
        {
            checkboxSelection: true,
            resizable: false, width: 40, headerCheckboxSelection: true, pinned: 'left'
        },
        {
            field: "name",
            headerName: t("Template name"),
            pinned: 'left',
            flex: 1,
            cellRenderer: (params) => {
                return <LinkControl
                    href={getPathItem(`/template/${params.data.id}`, false)}
                    title={params.data.name} >
                </LinkControl >
            },
        },
        {
            field: "description", headerName: t("Description"),
            flex: 1
        },
        {
            field: "createdDate",
            suppressAutoSize: true,
            headerName: t("Date created"),
            cellRenderer: (params) => {
                return formatDate(params.data.createdDate)
            },
        },
        {
            field: "edit",
            headerName: "",
            suppressAutoSize: true,
            resizable: false,
            cellRenderer: (params) => {
                return <strong>
                    <CellButton id={params.data.id} isEditShow={false} url={baseUrl.jm_template} />
                </strong>
            },
            sortable: false,
        },
    ])

    return (
        <>
            <GridData
                filterModels={filterModels}
                url={baseUrl.jm_template}
                columnVisibility={columnVisibility}
                loading={loading}
                columns={column}
            ></GridData>
        </>
    )
})

export default TemplateGrid
