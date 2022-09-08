import React, { useEffect, useState, useRef } from "react"
import ButtonIcon from "components/button/ButtonIcon"
import { useTranslation } from "react-i18next"
import { deleteData } from "services"
import { useSelector, useDispatch } from "react-redux"
import ConfirmDeleteDialog from "components/popup/confirmDeleteDialog"
import { openMessage } from "stores/components/snackbar"
import { ColorPickerControl } from "components/colorPicker"
import { ERROR_CODE, baseUrl, EButtonIconType } from "configs"
import {
  setPage,
  setSort,
  setEditData,
  setReload,
} from "stores/views/master"
import { open } from "components/popup/popupSlice"
import { open as openAlert, onSubmit } from "stores/components/alert-dialog"
import GridData from "components/table/GridData"

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
    { field: "name", headerName: t("Tên trạng thái"),  flex: 1, pinned: 'left' },
    {
      field: "color",
      headerName: t("Màu sắc"),
      cellRenderer: (params) => {
        return <ColorPickerControl readOnly={true} defaultValue={params.value} />
      }
    },
    { field: "description", headerName: t("Mô tả"), width: 350 },
    {
      field: "edit",
      headerName: "",
      width: 120,
      resizable: false,
      cellRenderer: (params) => {
        const onEditClick = (e) => {
          e.stopPropagation() // don't select this row after clicking
          if (!params) return
          dispatch(open())
          dispatch(setEditData(params.data.id))
        }

        const onDeleteClick = (e) => {
          e.stopPropagation() // don't select this row after clicking
          dispatch(openAlert({ open: true }))
          setId(params.data.id)
        }

        return (
          <strong>
            <ButtonIcon onClick={onEditClick} type={EButtonIconType.edit}></ButtonIcon>
            <ButtonIcon
              onClick={onDeleteClick}
              type={EButtonIconType.delete}
            ></ButtonIcon>
          </strong>
        )
      },
      sortable: false,
    },
  ])

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <ConfirmDeleteDialog url={baseUrl.jm_status} id={id} />
      <GridData
        columnVisibility={columnVisibility}
        columns={columns}
        filterModels={filterModels}
        url={baseUrl.jm_status}></GridData>
    </div>
  )
})

export default StatusGrid
