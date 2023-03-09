import React, { useEffect, useState } from "react"
import GridData from "components/table/GridData"
import ButtonIcon from "components/button/ButtonIcon"
import { useTranslation } from "react-i18next"
import { useSelector, useDispatch } from "react-redux"
import ConfirmDeleteDialog from "components/popup/confirmDeleteDialog"
import { baseUrl } from "configs"
import { open as openAlert } from "stores/components/alert-dialog"
import { formatDate } from "helpers/commonFunction"
import { LinkControl } from 'components/link'


const TemplateGrid = React.memo((props) => {
    console.log("render TemplateGrid")
    const { filterModels } = props
    const dispatch = useDispatch()
    const { t } = useTranslation()
    const columnVisibility = { ...useSelector((state) => state.template.columnVisibility) }
    const [id, setId] = useState(null)
    const loading = useSelector((state) => state.master.loading)

    const [column, setColumn] = useState([
        {
            checkboxSelection: true,
            resizable: false, width: 40, headerCheckboxSelection: true, pinned: 'left'
        },
        {
            field: "name",
            headerName: t("Tên mẫu"),
            pinned: 'left',
            flex: 1,
            cellRenderer: (params) => {
                return <LinkControl
                    href={`/template/${params.data.id}`}
                    title={params.data.name} >
                </LinkControl >
            },
        },
        {
            field: "description", headerName: t("Mô tả"),
            flex: 1
        },
        {
            field: "createdDate",
            suppressAutoSize: true,
            headerName: t("Ngày tạo"),
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
                const onDeleteClick = (e) => {
                    setId(params.data.id)
                    dispatch(openAlert({ open: true }))
                }

                const _status = params.data.status
                const _isMainAccount = params.data.isMainAccount

                const deleteElement = (
                    <ButtonIcon
                        disabled={_isMainAccount}
                        onClick={onDeleteClick}
                        type="Delete"
                    ></ButtonIcon>
                )

                return React.createElement(
                    "div",
                    {},
                    deleteElement,
                )
            },
            sortable: false,
        },
    ])

    return (
        <div style={{ width: "100%" }}>
            <ConfirmDeleteDialog url={baseUrl.jm_template} id={id} />
            <GridData
                filterModels={filterModels}
                url={baseUrl.jm_template}
                columnVisibility={columnVisibility}
                loading={loading}
                columns={column}
            ></GridData>
        </div>
    )
})

export default TemplateGrid
