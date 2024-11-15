import React from "react";
import ToolBar from "components/toolbar/ToolBar";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { setColumnVisibility } from "stores/views/user";
import { useTranslation } from "react-i18next";
import UserPopup from "./UserPopup";
import { open, change_title } from "components/popup/popupSlice";
import { EControlType } from "configs";

const UserToolbar = (props) => {
  console.log("UserToolbar");
  const { onApplyFilter, gridId } = props;
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const toolbarVisible = {
    ...useSelector((state) => state.master.toolbarVisible),
  };
  const columnVisibility = {
    ...useSelector((state) => state.user.columnVisibility),
  };
  const openPopup = useSelector((state) => state.popup.open);

  const columnModel = [
    {
      field: "email",
      isShow: true,
      label: t("Email"),
      type: EControlType.textField,
    },
    {
      field: "firstName",
      isShow: true,
      label: t("First name"),
      type: EControlType.textField,
    },
    {
      field: "lastName",
      isShow: true,
      label: t("Last name"),
      type: EControlType.textField,
    },
    {
      field: "teamName",
      isShow: true,
      label: t("Team"),
      type: EControlType.textField,
    },
    {
      field: "status",
      isShow: true,
      label: t("Status"),
      type: EControlType.select,
    },
    {
      field: "createdDate",
      isShow: true,
      label: t("Date created"),
      type: EControlType.datetime,
    },
  ];

  const handleColumnConfigChange = (event) => {
    columnVisibility[event.target.name] = event.target.checked;
    dispatch(setColumnVisibility({ ...columnVisibility }));
  };

  const handleClickOpen = () => {
    dispatch(change_title(t("Add new user")));
    dispatch(open());
  };

  return (
    <div>
      <ToolBar
        visible={toolbarVisible}
        onApplyFilter={onApplyFilter}
        gridId={gridId}
        onColumnConfigChange={handleColumnConfigChange}
        columnModel={columnModel}
        onAddClick={handleClickOpen}
      />
      <UserPopup />
    </div>
  );
};

UserToolbar.propTypes = {
  onAddClick: PropTypes.func,
};

export default UserToolbar;
