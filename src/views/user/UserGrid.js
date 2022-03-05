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
import { ERROR_CODE, EUserStatus } from "configs";
import {
  setPage,
  setSort,
  setLoadingPopup,
  setEditData,
  setReload,
} from "stores/views/master";
import { open, change_title } from "components/popup/popupSlice";
import { Edit } from "styled-icons/fluentui-system-filled";
import Tooltip from "@mui/material/Tooltip";
import { open as openAlert, onSubmit } from "stores/components/alert-dialog";
import { loading as loadingButton } from "stores/components/button";
const UserGrid = React.memo((props) => {
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
    { field: "email", headerName: t("Email"), width: 350, flex: 2 },
    {
      field: "fullName",
      headerName: t("Họ tên"),
      width: 450,
      flex: 2,
    },
    {
      field: "status",
      headerName: t("Trạng thái"),
      width: 400,
      flex: 2,
      renderCell: (params) => {
        let statusStr = "";
        let userStatusClassName;
        if (params.value == EUserStatus.ACTIVE) {
          statusStr = t("Kích hoạt");
          userStatusClassName = "text-active";
        } else if (params.value == EUserStatus.WAILTING_CONFIRM_MAIL) {
          statusStr = t("Chờ kích hoạt");
          userStatusClassName = "text-wait-confirm-mail";
        } else if (params.value == EUserStatus.BLOCK) {
          statusStr = t("Đã khóa");
          userStatusClassName = "text-block";
        }
        return <span className={userStatusClassName}>{statusStr}</span>;
      },
    },
    {
      field: "edit",
      headerName: "",
      renderCell: (params) => {
        const _status = params.row.status;
        const myData = [
          { type: "Edit" },
          { type: "Delete" },
          { type: "Email" },
        ];
        const deleteElement = <GridIconButton type="Delete" />;
        const editElement = <GridIconButton type="Edit"></GridIconButton>;
        const emailElement = <GridIconButton type="Email" />;
        const helloElement = React.createElement("span", null, "Hello");
        const children = myData.map((val) => {
          React.createElement("div", { type:"Delete" }, GridIconButton);
        });
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
          // dispatch(onSubmit(onAcceptDelete))
        };
        return React.createElement("div", {}, children);
      },
      disableClickEventBubbling: true,
      sortable: false,
      disableColumnMenu: true,
    },
  ];

  return (
    <div style={{ width: "100%", height: "100%" }}>
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

export default UserGrid;
