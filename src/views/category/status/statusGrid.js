import React, { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { useSelector, useDispatch } from "react-redux"
import { ColorPickerControl } from "components/colorPicker"
import { baseUrl } from "configs"
import GridData from "components/table/GridData"
import { CheckBoxCellRender } from 'components/cellRender'
import { CellButton } from 'components/cellRender'

const StatusGrid = (props) => {
  const lang = useSelector((state) => state.master.lang)
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { filterModels } = props
  const columnVisibility = { ...useSelector((state) => state.status.columnVisibility) }
  const [id, setId] = useState(null)

  const [columns, setColumn] = useState([
    {
      checkboxSelection: true,
      resizable: false, width: 40, headerCheckboxSelection: true, pinned: 'left'
    },
    { field: "name", headerName: t("Status name"), flex: 1, pinned: 'left' },
    {
      field: "color",
      headerName: t("Color"),
      cellRenderer: (params) => {
        return <ColorPickerControl readOnly={true} defaultValue={params.value} />
      }
    },
    {
      field: "isStatusStart",
      headerName: t("Start status"),
      cellRenderer: (params) => {
        return <CheckBoxCellRender disabled={true} checked={params.value} />
      }
    },
    {
      field: "isStatusEnd",
      headerName: t("End status"),
      cellRenderer: (params) => {
        return <CheckBoxCellRender disabled={true} checked={params.value} />
      }
    },
    { field: "description", headerName: t("Description"), flex: 2 },
    {
      field: "edit",
      headerName: "",
      width: 120,
      suppressAutoSize: true,
      resizable: false,
      cellRenderer: (params) => {
        return <strong>
          <CellButton id={params.data.id} url={baseUrl.jm_status}/>
        </strong>
      },
      sortable: false,
    },
  ])

  return (
    <>
      <GridData
        columnVisibility={columnVisibility}
        columns={columns}
        filterModels={filterModels}
        url={baseUrl.jm_status} />
    </>
  )
}

export default StatusGrid
