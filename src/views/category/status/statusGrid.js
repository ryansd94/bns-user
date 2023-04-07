import React, { useEffect, useState } from "react"
import ButtonIcon from "components/button/ButtonIcon"
import { useTranslation } from "react-i18next"
import { useSelector, useDispatch } from "react-redux"
import ConfirmDeleteDialog from "components/popup/confirmDeleteDialog"
import { ColorPickerControl } from "components/colorPicker"
import { baseUrl, EButtonIconType } from "configs"
import {
  setEditData,
} from "stores/views/master"
import { open } from "components/popup/popupSlice"
import { open as openAlert } from "stores/components/alert-dialog"
import GridData from "components/table/GridData"
import Grid from "@mui/material/Grid"
import { CheckBoxCellRender } from 'components/cellRender'
import { CellButton } from 'components/cellRender'

const StatusGrid = React.memo((props) => {
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
    { field: "name", headerName: t("Tên trạng thái"), flex: 1, pinned: 'left' },
    {
      field: "color",
      headerName: t("Màu sắc"),
      cellRenderer: (params) => {
        return <ColorPickerControl readOnly={true} defaultValue={params.value} />
      }
    },
    {
      field: "isStatusStart",
      headerName: t("Trạng thái bắt đầu"),
      cellRenderer: (params) => {
        return <CheckBoxCellRender disabled={true} checked={params.value} />
      }
    },
    {
      field: "isStatusEnd",
      headerName: t("Trạng thái kết thúc"),
      cellRenderer: (params) => {
        return <CheckBoxCellRender disabled={true} checked={params.value} />
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
        const onEditClick = (e) => {
          e.stopPropagation()
          if (!params) return
          dispatch(open())
          dispatch(setEditData(params.data.id))
        }

        const onDeleteClick = (e) => {
          e.stopPropagation()
          dispatch(openAlert({ open: true }))
          setId(params.data.id)
        }

        return <strong>
          <CellButton onEditClick={onEditClick} onDeleteClick={onDeleteClick} />
        </strong>
      },
      sortable: false,
    },
  ])

  return (
    <>
      <ConfirmDeleteDialog url={baseUrl.jm_status} id={id} />
      <GridData
        columnVisibility={columnVisibility}
        columns={columns}
        filterModels={filterModels}
        url={baseUrl.jm_status} />
    </>
  )
})

export default StatusGrid
