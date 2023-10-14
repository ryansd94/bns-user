import React from "react";
import ToolBar from "components/toolbar/ToolBar";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { setColumnVisibility } from "stores/views/template";
import { useTranslation } from "react-i18next";
import { EControlType } from "configs";
import { getPathItem } from "helpers";

const TemplateToolbar = (props) => {
  console.log("render template toolbar");
  const { onApplyFilter } = props;
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const toolbarVisible = {
    ...useSelector((state) => state.master.toolbarVisible),
  };
  const columnVisibility = {
    ...useSelector((state) => state.template.columnVisibility),
  };
  const columnModel = [
    {
      field: "name",
      isShow: true,
      label: t("Template name"),
      type: EControlType.textField,
    },
    {
      field: "description",
      isShow: true,
      label: t("Description"),
      type: EControlType.textField,
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
    window.open(getPathItem(`/template/add`, false));
  };

  return (
    <div>
      <ToolBar
        visible={toolbarVisible}
        onApplyFilter={onApplyFilter}
        onColumnConfigChange={handleColumnConfigChange}
        columnModel={columnModel}
        onAddClick={handleClickOpen}
      />
      {/* <TemplateAdd /> */}
    </div>
  );
};
TemplateToolbar.propTypes = {
  onAddClick: PropTypes.func,
};
export default TemplateToolbar;
