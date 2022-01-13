import React, { useEffect, useState } from "react";
import { getShopIndex } from "helpers";
import PropTypes from "prop-types";
import Table from "components/table/Table";
import { useTranslation } from "react-i18next";
import { getTeam, getTeamByID } from "services";
import { useSelector, useDispatch } from "react-redux";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import { setPage, setSort } from "stores/views/master";

const TeamDataGrid = React.memo((props) => {
  console.log("render AREA GRID");
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { onCellClick } = props;
  const baseUrl = "/jm_team";
  const url = `${baseUrl}`;
  const data = useSelector((state) => state.master.data);
  const page = useSelector((state) => state.master.page);
  const loading = useSelector((state) => state.master.loading);
  const sortModel = useSelector((state) => state.master.sortModel);
  const renderDetailsButton = (params) => {
    return (
      <strong>
        <IconButton aria-label="delete">
          <EditIcon />
        </IconButton>
      </strong>
    );
  };
  const onEditClick = (id) => {
    console.log(id);
  };
  const columns = [
    { field: "id", hide: true },
    { field: "name", headerName: t("Tên nhóm"), width: 350, flex: 2 },
    {
      field: "description",
      headerName: t("Ghi chú"),
      width: 450,
      flex: 2,
    },
    {
      field: "parentId",
      headerName: t("Nhóm cha"),
      width: 400,
      flex: 2,
      valueGetter: (params) => {
        return params && params.row.teamParent && params.row.teamParent.name;
      },
    },
    {
      field: "edit",
      headerName: "",
      width: 150,
      renderCell: renderDetailsButton,
      disableClickEventBubbling: true,
      sortable: false,
      disableColumnMenu: true,
    },
  ];
 
  return (
    <Table
      rowsCount={data && data.recordsTotal}
      columns={columns}
      rows={data && data.data && data.data.items}
      sortModel={sortModel}
      onCellClick={onCellClick}
      onPageChange={(newPage) => dispatch(setPage(newPage))}
      onSortModelChange={(model) => dispatch(setSort(model))}
      loading={loading}
    />
  );
});

TeamDataGrid.propTypes = {
  onCellClick: PropTypes.func,
};

export default TeamDataGrid;
