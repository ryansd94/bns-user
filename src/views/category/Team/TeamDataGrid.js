import React, { useEffect, useState } from "react";
import { getShopIndex } from "helpers";
import PropTypes from "prop-types";
import Table from "components/table/Table";
import GridIconButton from "components/button/GridIconButton";
import { useTranslation } from "react-i18next";
import { getTeam, getTeamByID, deleteTeam } from "services";
import { useSelector, useDispatch } from "react-redux";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { red } from "@mui/material/colors";
import AlertDialog from "components/popup/AlertDialog";
import { openMessage } from "stores/components/snackbar";
import { ERROR_CODE } from "configs";
import {
  setPage,
  setSort,
  setLoadingPopup,
  setEditData,
  setReload,
} from "stores/views/master";
import { open, change_title } from "components/popup/popupSlice";
import { Edit } from "styled-icons/fluentui-system-filled";
import { open as openAlert, onSubmit } from "stores/components/alert-dialog";
import { loading as loadingButton} from "stores/components/button";
const TeamDataGrid = React.memo((props) => {
  console.log("render team GRID");
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const baseUrl = "/jm_team";
  const url = `${baseUrl}`;
  const { data } = props;
  const page = useSelector((state) => state.master.page);
  const loading = useSelector((state) => state.master.loading);
  const sortModel = useSelector((state) => state.master.sortModel);
  const [id, setId] = useState(null);

  const onAcceptDelete = async () => {
    dispatch(loadingButton(true));
    const res = await deleteTeam(id);
    if (res.errorCode == ERROR_CODE.success) {
      dispatch(setReload());
    }
    dispatch(openMessage({ ...res }));
    dispatch(openAlert(false));
    dispatch(loadingButton(false));
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
      field: "parentName",
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
      renderCell: (params) => {
        const onEditClick = (e) => {
          e.stopPropagation(); // don't select this row after clicking
          if (!params) return;
          dispatch(open());
          dispatch(setEditData(params.id));
        };

        const onDeleteClick = (e) => {
          e.stopPropagation(); // don't select this row after clicking
          dispatch(openAlert(true));
          setId(params.id);
        };

        return (
          <strong>
            <GridIconButton onClick={onEditClick} type="Edit"></GridIconButton>
            <GridIconButton
              onClick={onDeleteClick}
              type="Delete"
            ></GridIconButton>
          </strong>
        );
      },
      disableClickEventBubbling: true,
      sortable: false,
      disableColumnMenu: true,
    },
  ];

  return (
    <div style={{ width: "100%", height:"100%" }}>
      <AlertDialog onSubmit={onAcceptDelete} />
      <Table
        rowsCount={data && data.recordsTotal}
        columns={columns}
        rows={data && data.data && data.data.items}
        sortModel={sortModel}
        onPageChange={(newPage) => dispatch(setPage(newPage))}
        onSortModelChange={(model) => dispatch(setSort(model))}
        loading={loading}
      />
    </div>
  );
});

export default TeamDataGrid;
