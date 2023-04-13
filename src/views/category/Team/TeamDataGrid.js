import React from "react"
import { useTranslation } from "react-i18next"
import { useSelector } from "react-redux"
import { baseUrl } from "configs"
import GridData from "components/table/GridData"
import { CellButton } from 'components/cellRender'

const TeamDataGrid = React.memo((props) => {
  console.log("render TeamDataGrid")
  const { filterModels } = props
  const { t } = useTranslation()
  const columnVisibility = { ...useSelector((state) => state.team.columnVisibility) }

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
        return <strong>
          <CellButton id={params.data.id} isEditShow={false} url={baseUrl.jm_template} />
        </strong>
      },
      sortable: false,
    },
  ]

  return (
    <>
      <GridData
        url={baseUrl.jm_team}
        columnVisibility={columnVisibility}
        filterModels={filterModels}
        columns={columns}></GridData>
    </>
  )
})

export default TeamDataGrid
