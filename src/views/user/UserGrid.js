import React, { useEffect, useState } from "react";
import { getShopIndex } from "helpers";
import PropTypes from "prop-types";
import Table from "components/table/Table";
import GridIconButton from "components/button/GridIconButton";
import { useTranslation } from "react-i18next";
import { sendMailUser, getTeamByID, deleteUser } from "services";
import { useSelector, useDispatch } from "react-redux";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { red } from "@mui/material/colors";
import AlertDialog from "components/popup/AlertDialog";
import UserStatus from "components/chip/UserStatus";
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
    const res = await deleteUser(id);
    if (res.errorCode == ERROR_CODE.success) {
      dispatch(setReload());
    }
    dispatch(openMessage({ ...res }));
    dispatch(openAlert(false));
    dispatch(loadingButton(false));
  };
  const onSendMail = async (email) => {
    const res = await sendMailUser({ emails: [email] });
    if (res.errorCode == ERROR_CODE.success) {
      //dispatch(setReload());
    }
    dispatch(openMessage({ ...res }));
  };
  const columns = [
    { field: "id", hide: true },
    { field: "email", headerName: t("Email"), flex: 2 },
    {
      field: "fullName",
      headerName: t("Họ tên"),
    },
    {
      field: "status",
      headerName: t("Trạng thái"),
      width: 180,
      renderCell: (params) => {
        return <UserStatus status={params.value} />;
      },
    },
    {
      field: "edit",
      width: 150,
      headerName: "",
      renderCell: (params) => {
        const onSendMailClick = (e) => {
          e.stopPropagation(); // don't select this row after clicking
          if (!params) return;
          onSendMail(params.row.email);
        };
        const onDeleteClick = (e) => {
          e.stopPropagation(); // don't select this row after clicking
          dispatch(openAlert(true));
          setId(params.id);
          dispatch(onSubmit(onAcceptDelete));
        };
        const _status = params.row.status;
        const _isMainAccount = params.row.isMainAccount;
        const myData = [
          { type: "Edit" },
          { type: "Delete" },
          { type: "Email" },
        ];
        const deleteElement = (
          <GridIconButton
            disabled={_isMainAccount}
            onClick={onDeleteClick}
            type="Delete"
          ></GridIconButton>
        );
        // const editElement = <GridIconButton type="Edit"></GridIconButton>;
        const emailElement = (
          <GridIconButton
            onClick={onSendMailClick}
            disabled={
              _status == EUserStatus.WAILTING_CONFIRM_MAIL ? false : true
            }
            title={t("Gửi mail xác nhận")}
            type="Email"
          />
        );

        return React.createElement("div", {}, deleteElement, emailElement);
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
