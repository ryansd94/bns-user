import React, { useState } from "react";
import GridData from "components/table/GridData";
import { useTranslation } from "react-i18next";
import { post } from "services";
import { useSelector, useDispatch } from "react-redux";
import { openMessage } from "stores/components/snackbar";
import { ERROR_CODE, EUserStatus, baseUrl } from "configs";
import { open as openAlert } from "stores/components/alert-dialog";
import { formatDate } from "helpers/commonFunction";
import { UserProfile, UserStatus } from "./userGridComponents";
import { CellButton } from "components/cellRender";
import { EButtonIconType } from "configs";

const UserGrid = React.memo((props) => {
  console.log("render user grid");
  const {
    filterModels,
    id,
    isGetDataFromServer = true,
    isShowActionButton = true,
    onSelectedRow = null,
    localData = [],
    isShowListButton = true,
    onCustomDeleteClick,
    dataUrl,
    customFilterData,
    hiddenColumns = [],
  } = props;
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const columnVisibility = {
    ...useSelector((state) => state.user.columnVisibility),
  };
  const [userId, setUserId] = useState(null);
  const [status, setStatus] = useState(null);

  const onSendMail = async (email) => {
    const res = await post(`${baseUrl.jm_user}/add-user`, { emails: [email] });
    if (res.errorCode == ERROR_CODE.success) {
    }
    dispatch(openMessage({ ...res }));
  };

  const getColumns = () => {
    let result = [
      {
        checkboxSelection: true,
        resizable: false,
        width: 40,
        headerCheckboxSelection: true,
        pinned: "left",
      },
      {
        field: "email",
        headerName: t("Email"),
        pinned: "left",
        cellRenderer: (params) => {
          return <UserProfile user={params.data}></UserProfile>;
        },
      },
      {
        field: "firstName",
        headerName: t("First name"),
        flex: 1,
        minWidth: 170,
      },
      {
        field: "lastName",
        headerName: t("Last name"),
        flex: 1,
        minWidth: 170,
      },
      {
        field: "teamName",
        headerName: t("Team"),
        width: 170,
      },
      {
        field: "status",
        width: 170,
        headerName: t("Status"),
        cellRenderer: (params) => {
          return <UserStatus status={params.data.status} />;
        },
      },
      {
        field: "createdDate",
        width: 150,
        headerName: t("Date created"),
        cellRenderer: (params) => {
          return formatDate(params.data.createdDate);
        },
      },
    ];

    if (isShowActionButton) {
      result.push({
        field: "edit",
        width: 150,
        headerName: "",
        resizable: false,
        cellRenderer: (params) => {
          const onSendMailClick = (e) => {
            if (!params) return;
            onSendMail(params.data.email);
          };
          const onBlockClick = (sta) => {
            setUserId(params.data.id);
            setStatus(sta);
            dispatch(
              openAlert({
                open: true,
                title:
                  sta == EUserStatus.BLOCK
                    ? t("Are you sure to lock this user?")
                    : t("Are you sure to unlock this user?"),
              }),
            );
          };
          const _status = params.data.status;
          const _isMainAccount = params.data.isMainAccount;

          const listButton = [
            {
              type: EButtonIconType.email,
              onClick: onSendMailClick,
              disabled:
                _status == EUserStatus.WAILTING_CONFIRM_MAIL ? false : true,
            },
          ];

          if (_status == EUserStatus.ACTIVE) {
            listButton.push({
              type: EButtonIconType.lock,
              onClick: () => onBlockClick(EUserStatus.BLOCK),
              disabled: _isMainAccount
                ? _isMainAccount
                : _status == EUserStatus.WAILTING_CONFIRM_MAIL
                ? true
                : false,
            });
          } else {
            listButton.push({
              type: EButtonIconType.unLock,
              onClick: () => onBlockClick(EUserStatus.ACTIVE),
              disabled: _isMainAccount
                ? _isMainAccount
                : _status == EUserStatus.WAILTING_CONFIRM_MAIL
                ? true
                : false,
            });
          }

          return (
            <strong>
              <CellButton
                onCustomDeleteClick={onCustomDeleteClick}
                isDeleteShow={!_isMainAccount}
                listButton={isShowListButton ? listButton : []}
                id={params.data.userId}
                isEditShow={false}
                url={baseUrl.jm_user}
              />
            </strong>
          );
        },
        sortable: false,
      });
    }

    if (!_.isEmpty(hiddenColumns)) {
      result = _.filter(result, (x) => !_.includes(hiddenColumns, x.field));
    }

    return result;
  };

  const [columns, setColumn] = useState(getColumns());

  return (
    <GridData
      customFilterData={customFilterData}
      localData={_.cloneDeep(localData)}
      onSelectedRow={onSelectedRow}
      isGetDataFromServer={isGetDataFromServer}
      id={id}
      url={dataUrl || baseUrl.jm_user}
      columnVisibility={columnVisibility}
      columns={columns}
      filterModels={filterModels}
    ></GridData>
  );
});

export default UserGrid;
