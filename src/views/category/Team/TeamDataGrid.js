import React from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { baseUrl } from "configs";
import GridData from "components/table/GridData";
import { CellButton, CellGroupItem } from "components/cellRender";

const TeamDataGrid = React.memo((props) => {
  console.log("render TeamDataGrid");
  const { filterModels } = props;
  const { t } = useTranslation();
  const columnVisibility = {
    ...useSelector((state) => state.team.columnVisibility),
  };

  const columns = [
    {
      checkboxSelection: true,
      resizable: false,
      width: 40,
      headerCheckboxSelection: true,
      pinned: "left",
      lockPosition: "left",
    },
    {
      field: "name",
      headerName: t("Team name"),
      flex: 1,
      pinned: "left",
      lockPosition: "left",
      sort: "asc",
      cellRenderer: (params) => {
        return (
          <strong>
            <CellGroupItem item={params.data} name={"name"} />
          </strong>
        );
      },
    },
    {
      field: "description",
      headerName: t("Description"),
      width: 450,
      flex: 2,
    },
    {
      field: "parentName",
      headerName: t("Team parent"),
      width: 400,
      flex: 2,
    },
    {
      field: "edit",
      headerName: "",
      width: 150,
      cellRenderer: (params) => {
        return (
          <strong>
            <CellButton id={params.data.id} url={baseUrl.jm_team} />
          </strong>
        );
      },
      sortable: false,
      lockPosition: "right",
    },
  ];

  return (
    <>
      <GridData
        id="gridTeam"
        url={baseUrl.jm_team}
        columnVisibility={columnVisibility}
        filterModels={filterModels}
        columns={columns}
      ></GridData>
    </>
  );
});

export default TeamDataGrid;
