import React, { useState, useEffect, useStateIfMounted } from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";

import { IconDelete } from "components/icon/icon";
import { IconEdit,IconEmail } from "components/icon/icon";
const GridIconButton = (props) => {
  const { t } = useTranslation();
  const { type, onClick,title,disabled } = props;
  const [icon, setIcon] = useState("");
  const [titleDefault, setTitle] = useState("");
  useEffect(() => {
    switch (type) {
      case "Edit":
        setTitle(t("Chỉnh sửa"));
        break;
      case "Delete":
        setTitle(t("Xóa"));
        break;
      default:
        break;
    }
  }, []);
  let button;
  if (type == "Edit")
    button = (
      <Tooltip title={title?title:titleDefault}>
        <IconButton disabled={disabled} onClick={onClick} aria-label={type}>
          <IconEdit />
        </IconButton>
      </Tooltip>
    );
  else if (type == "Delete")
    button = (
      <Tooltip title={title?title:titleDefault}>
        <IconButton disabled={disabled} onClick={onClick} aria-label={type}>
          <IconDelete />
        </IconButton>
      </Tooltip>
    );
    else if (type == "Email")
    button = (
      <Tooltip title={title?title:titleDefault}>
        <IconButton disabled={disabled} onClick={onClick} aria-label={type}>
          <IconEmail />
        </IconButton>
      </Tooltip>
    );
  return button;
};
GridIconButton.propTypes = {
  type: PropTypes.string.isRequired,
  title: PropTypes.string,
  onClick: PropTypes.func,
};
export default GridIconButton;
