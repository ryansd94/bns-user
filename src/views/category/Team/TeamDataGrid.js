import React, { useEffect, useState } from "react"
import ButtonIcon from "components/button/ButtonIcon"
import { useTranslation } from "react-i18next"
import { useSelector, useDispatch } from "react-redux"
import ConfirmDeleteDialog from "components/popup/confirmDeleteDialog"
import { baseUrl, EButtonIconType } from "configs"
import {
  setEditData,
  setLoading
} from "stores/views/master"
import { get } from "services"
import { open } from "components/popup/popupSlice"
import { open as openAlert, onSubmit } from "stores/components/alert-dialog"
import GridData from "components/table/GridData"

const TeamDataGrid = React.memo((props) => {
  console.log("render TeamDataGrid")
  const { filterModels } = props
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const [data, setData] = React.useState({})
  const loading = useSelector((state) => state.master.loading)
  const columnVisibility = { ...useSelector((state) => state.team.columnVisibility) }
  const page = useSelector((state) => state.master.page)
  const pageSize = useSelector((state) => state.master.pageSize)
  const sortModel = useSelector((state) => state.master.sortModel)
  const isReload = useSelector((state) => state.master.isReload)
  const [id, setId] = useState(null)

  useEffect(() => {
    fetchData()
  }, [page, sortModel, isReload, filterModels])

  const fetchData = async () => {
    dispatch(setLoading(true))
    await get(baseUrl.jm_team, {
      draw: page,
      start: page == 0 ? 0 : page * 10,
      length: pageSize,
      fieldSort:
        sortModel != null && sortModel.length > 0 ? sortModel[0].field : "",
      sort: sortModel != null && sortModel.length > 0 ? sortModel[0].sort : "",
      filters: JSON.stringify(filterModels)
    }).then((data) => {
      setData(data)
      dispatch(setLoading(false))
    })
  }

  const columns = [
    {
      checkboxSelection: true,
      resizable: false, width: 40, headerCheckboxSelection: true, pinned: 'left'
    },
    {
      field: "name", headerName: t("Tên nhóm"),
      flex: 1,
      pinned: 'left',
    },
    {
      field: "description",
      headerName: t("Mô tả"),
      width: 450,
      flex: 2,
    },
    {
      field: "parentName",
      headerName: t("Nhóm cha"),
      width: 400,
      flex: 2,
    },
    {
      field: "edit",
      headerName: "",
      width: 150,
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
  ]

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <ConfirmDeleteDialog url={baseUrl.jm_team} id={id} />
      <GridData
        columnVisibility={columnVisibility}
        loading={loading}
        columns={columns}
        totalCount={data && data.recordsTotal}
        rows={data && data.data && data.data.items}></GridData>
    </div>
  )
})

export default TeamDataGrid
