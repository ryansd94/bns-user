import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import { useSelector, useDispatch } from "react-redux"
import { ColorPickerControl } from "components/colorPicker"
import { baseUrl } from "configs"
import {
  setEditData,
} from "stores/views/master"
import { open } from "components/popup/popupSlice"
import { open as openAlert } from "stores/components/alert-dialog"
import GridData from "components/table/GridData"
import { CellButton } from 'components/cellRender'

const PriorityGrid = React.memo((props) => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { filterModels } = props
  const columnVisibility = { ...useSelector((state) => state.priority.columnVisibility) }
  const [id, setId] = useState(null)

  const [columns, setColumn] = useState([
    {
      checkboxSelection: true,
      resizable: false, width: 40, headerCheckboxSelection: true, pinned: 'left'
    },
    { field: "name", headerName: t("Độ ưu tiên"), flex: 1, pinned: 'left' },
    {
      field: "color",
      headerName: t("Màu sắc"),
      cellRenderer: (params) => {
        return <ColorPickerControl readOnly={true} defaultValue={params.value} />
      }
    },
    { field: "description", headerName: t("Mô tả"), flex: 2 },
    {
      field: "edit",
      headerName: "",
      width: 120,
      suppressAutoSize: true,
      resizable: false,
      cellRenderer: (params) => {
        return <strong>
          <CellButton id={params.data.id} url={baseUrl.jm_priority}/>
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
        url={baseUrl.jm_priority} />
    </>
  )
})

export default PriorityGrid
