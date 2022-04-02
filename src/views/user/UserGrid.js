import React, { useEffect, useState } from "react";
import Table from "components/table/Table";
import TableTest from "components/table/TableTest";

import GridIconButton from "components/button/GridIconButton";
import { useTranslation } from "react-i18next";
import { sendMailUser, updateUserStatus, deleteUser, getUser } from "services";
import { useSelector, useDispatch } from "react-redux";
import AlertDialog from "components/popup/AlertDialog";
import UserStatus from "components/chip/UserStatus";
import { openMessage } from "stores/components/snackbar";
import { ERROR_CODE, EUserStatus, EAlertPopupType, EColumnType } from "configs";
import {
  setConfig,
} from "stores/views/new";
import { open as openAlert } from "stores/components/alert-dialog";
import { loading as loadingButton } from "stores/components/button";
import { formatDate } from "helpers/commonFunction"
import {
  setToolbarVisibility,
} from "stores/views/user";
const UserGrid = React.memo((props) => {
  console.log("render user grid");
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const baseUrl = "/jm_team";
  const url = `${baseUrl}`;
  const columnVisibility = { ...useSelector((state) => state.user.columnVisibility) };
  const toolbarVisible = { ...useSelector((state) => state.user.toolbarVisible) };
  const [alertType, setAlertType] = useState(0);
  const [id, setId] = useState(null);
  const [status, setStatus] = useState(null);

  const [data, setData] = React.useState({});

  const config = { ...useSelector((state) => state.new.config) };
  useEffect(() => {
    fetchData();
  }, [config.isReload]);


  const fetchData = async () => {
    config.loading = true;
    dispatch(setConfig({ ...config }));
    await getUser({
      draw: config.page,
      start: config.page == 0 ? 0 : config.page * 10,
      length: 10,
      fieldSort:
        config.sortModel != null && config.sortModel.length > 0 ? config.sortModel[0].field : "",
      sort: config.sortModel != null && config.sortModel.length > 0 ? config.sortModel[0].sort : "",
    }).then((data) => {
      setData(data);
      config.loading = false;
      dispatch(setConfig({ ...config }));
    });
  };
  const onAcceptDelete = async () => {
    dispatch(loadingButton(true));
    var res = null;
    if (alertType == 1)
      res = await deleteUser(id);
    else if (alertType == EAlertPopupType.UPDATE_STATUS)
      res = await updateUserStatus({ id: id, status: status });

    if (res.errorCode == ERROR_CODE.success) {
      config.isReload = !config.isReload;
      dispatch(setConfig({ ...config }));
    }
    dispatch(openMessage({ ...res }));
    dispatch(openAlert({ open: false }));
    dispatch(loadingButton(false));
  };
  const onSendMail = async (email) => {
    const res = await sendMailUser({ emails: [email] });
    if (res.errorCode == ERROR_CODE.success) {
    }
    dispatch(openMessage({ ...res }));
  };
  const onSelectionModelChange = (newSelection) => {
    if (newSelection.length > 0) {
      toolbarVisible.function = true;
    }
    else {
      toolbarVisible.function = false;
    }
    dispatch(setToolbarVisibility({ ...toolbarVisible }));
  }
  
  const columns = [
    { field: "id", hide: true },
    { field: "email", headerName: t("Email"),
    width: 180,},
    {
      field: "fullName",
      headerName: t("Họ tên"),
      width: 180,
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
      field: "createdDate",
      headerName: t("Ngày tạo"),
      flex: 0,
      minWidth: 500,
      renderCell: (params) => {
        return formatDate(params.value);
      },
    },
    {
      field: "edit",
      width: 150,
      headerName: "",
      renderCell: (params) => {
        const onSendMailClick = (e) => {
          if (!params) return;
          onSendMail(params.row.email);
        };
        const onDeleteClick = (e) => {
          setAlertType(EAlertPopupType.DELETE);
          setId(params.id);
          dispatch(openAlert({ open: true }));
        };
        const onBlockClick = (sta) => {
          setAlertType(EAlertPopupType.UPDATE_STATUS);
          setId(params.id);
          setStatus(sta);
          dispatch(
            openAlert({
              open: true,
              title: sta == EUserStatus.BLOCK ? t("Bạn có chắc khóa người dùng này?") : t("Bạn có chắc mở khóa người dùng này?"),
            })
          );
        };
        const _status = params.row.status;
        const _isMainAccount = params.row.isMainAccount;
        const deleteElement = (
          <GridIconButton
            disabled={_isMainAccount}
            onClick={onDeleteClick}
            type="Delete"
          ></GridIconButton>
        );
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

        const blockElement = (
          <GridIconButton
            onClick={() => onBlockClick(EUserStatus.BLOCK)}
            disabled={_isMainAccount}
            type="Lock"
          />
        );
        const unBlockElement = (
          <GridIconButton
            onClick={() => onBlockClick(EUserStatus.ACTIVE)}
            disabled={_isMainAccount}
            type="UnLock"
          />
        );
        return React.createElement(
          "div",
          {},
          deleteElement,
          emailElement,
          _status == EUserStatus.ACTIVE ? blockElement : unBlockElement
        );
      },
      disableClickEventBubbling: true,
      sortable: false,
      disableColumnMenu: true,
    },];
  const columns2 = [
    { field: "id", type: EColumnType.checkbox },
    { field: "email", headerName: t("Email"), flex: 1, width: "200px" },
    {
      field: "fullName",
      headerName: t("Họ tên"),
      flex: 1, width: "300px"
    },
    {
      field: "fullName",
      headerName: t("Họ tên"),
      flex: 1, width: "300px"
    },
    {
      field: "fullName",
      headerName: t("Họ tên"),
      flex: 1, width: "300px"
    },
    {
      field: "fullName",
      headerName: t("Họ tên"),
      flex: 1, width: "300px"
    },
    {
      field: "status",
      headerName: t("Trạng thái"),
      width: "200px",
      minWidth: 200,
      renderCell: (params) => {
        return <UserStatus status={params.status} />;
      },
    },
    {
      field: "createdDate",
      headerName: t("Ngày tạo"),
      width: "200px",
      renderCell: (params) => {
        return formatDate(params.createdDate);
      },
    },
    {
      field: "edit",
      width: "300px",
      renderCell: (params) => {
        const onSendMailClick = (e) => {
          if (!params) return;
          onSendMail(params.email);
        };
        const onDeleteClick = (e) => {
          setAlertType(EAlertPopupType.DELETE);
          setId(params.id);
          dispatch(openAlert({ open: true }));
        };
        const onBlockClick = (sta) => {
          setAlertType(EAlertPopupType.UPDATE_STATUS);
          setId(params.id);
          setStatus(sta);
          dispatch(
            openAlert({
              open: true,
              title: sta == EUserStatus.BLOCK ? t("Bạn có chắc khóa người dùng này?") : t("Bạn có chắc mở khóa người dùng này?"),
            })
          );
        };
        const _status = params.status;
        const _isMainAccount = params.isMainAccount;
        const deleteElement = (
          <GridIconButton
            disabled={_isMainAccount}
            onClick={onDeleteClick}
            type="Delete"
          ></GridIconButton>
        );
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

        const blockElement = (
          <GridIconButton
            onClick={() => onBlockClick(EUserStatus.BLOCK)}
            disabled={_isMainAccount}
            type="Lock"
          />
        );
        const unBlockElement = (
          <GridIconButton
            onClick={() => onBlockClick(EUserStatus.ACTIVE)}
            disabled={_isMainAccount}
            type="UnLock"
          />
        );
        return React.createElement(
          "div",
          {},
          deleteElement,
          emailElement,
          _status == EUserStatus.ACTIVE ? blockElement : unBlockElement
        );
      },
      disableClickEventBubbling: true,
      sort: false,
      disableColumnMenu: true,
    },
  ];
  const onSortModelChange = (model) => {
    config.sortModel = model;
    config.isReload = !config.isReload;
    dispatch(setConfig({ ...config }));
  }
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <AlertDialog onSubmit={onAcceptDelete} />
      <Table
        columnVisibility={columnVisibility}
        rowsCount={data && data.recordsTotal}
        columns={columns}
        rows={data && data.data && data.data.items}
        sortModel={config.sortModel}
        onPageChange={(newPage) => dispatch(setPage(newPage))}
        onSortModelChange={onSortModelChange}
        loading={config.loading}
        onSelectionModelChange={onSelectionModelChange}
      />
      <TableTest columns={columns2}
        rows={data && data.data && data.data.items}></TableTest>
    </div>
  );
});

export default UserGrid;
