import React, { useEffect, useState } from "react";
import Table from "components/table/Table";
import GridIconButton from "components/button/GridIconButton";
import { useTranslation } from "react-i18next";
import { sendMailUser, updateUserStatus, deleteUser,getUser } from "services";
import { useSelector, useDispatch } from "react-redux";
import AlertDialog from "components/popup/AlertDialog";
import UserStatus from "components/chip/UserStatus";
import { openMessage } from "stores/components/snackbar";
import { ERROR_CODE, EUserStatus, EAlertPopupType } from "configs";
import {
  setData,
  setLoading,
  setReload,
  setLoadingPopup,
} from "stores/views/master";
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
  const page = useSelector((state) => state.master.page);
  const loading = useSelector((state) => state.master.loading);
  const sortModel = useSelector((state) => state.master.sortModel);
  const columnVisibility = { ...useSelector((state) => state.user.columnVisibility) };
  const toolbarVisible = { ...useSelector((state) => state.user.toolbarVisible) };
  const [alertType, setAlertType] = useState(0);
  const [id, setId] = useState(null);
  const [status, setStatus] = useState(null);

  const isReload = useSelector((state) => state.master.isReload);
  const [data, setData] = React.useState({});

  useEffect(() => {
    fetchData();
  }, [page, sortModel, isReload]);


  const fetchData = async () => {
    dispatch(setLoading(true));
    await getUser({
      draw: page,
      start: page == 0 ? 0 : page * 10,
      length: 10,
      fieldSort:
        sortModel != null && sortModel.length > 0 ? sortModel[0].field : "",
      sort: sortModel != null && sortModel.length > 0 ? sortModel[0].sort : "",
    }).then((data) => {
      setData(data);
      dispatch(setLoading(false));
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
      dispatch(setReload());
    }
    dispatch(openMessage({ ...res }));
    dispatch(openAlert({ open: false }));
    dispatch(loadingButton(false));
  };
  const onSendMail = async (email) => {
    const res = await sendMailUser({ emails: [email] });
    if (res.errorCode == ERROR_CODE.success) {
      //dispatch(setReload());
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
    { field: "email", headerName: t("Email"), flex: 1 },
    {
      field: "fullName",
      headerName: t("Họ tên"),
      flex: 1
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
      minWidth: 140,
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
    },
  ];

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <AlertDialog onSubmit={onAcceptDelete} />
      <Table
        columnVisibility={columnVisibility}
        rowsCount={data && data.recordsTotal}
        columns={columns}
        rows={data && data.data && data.data.items}
        sortModel={sortModel}
        onPageChange={(newPage) => dispatch(setPage(newPage))}
        onSortModelChange={(model) => dispatch(setSort(model))}
        loading={loading}
        onSelectionModelChange={onSelectionModelChange}
      />
    </div>
  );
});

export default UserGrid;
