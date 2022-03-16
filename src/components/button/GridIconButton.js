import React, { useState, useEffect, useStateIfMounted } from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import { makeStyles } from '@mui/styles';

import { IconDelete } from "components/icon/icon";
import {
  IconEdit,
  IconEmail,
  IconBlock,
  IconUnBlock,
} from "components/icon/icon";
const useStyles  = makeStyles({
  root: {
    "&.Mui-disabled": {
      pointerEvents: "auto"
    }
  }
});

const GridIconButton = (props) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { type, onClick, title, disabled } = props;
  const [titleDefault, setTitle] = useState("");

  useEffect(() => {
    switch (type) {
      case "Edit":
        setTitle(t("Chỉnh sửa"));
        break;
      case "Delete":
        setTitle(t("Xóa"));
        break;
      case "Lock":
        setTitle(t("Khóa"));
        break;
      case "UnLock":
        setTitle(t("Mở khóa"));
        break;
      default:
        break;
    }
  }, []);
  let button;
  const adjustedButtonProps = {
    disabled: disabled,
    component: disabled ? "div" : undefined,
    onClick: disabled ? undefined : onClick,
  };
  if (type == "Edit")
    button = (
      <Tooltip title={title ? title : titleDefault}>
        <IconButton  className={classes.root} {...adjustedButtonProps}>
          <IconEdit />
        </IconButton>
      </Tooltip>
    );
  else if (type == "Delete")
    button = (
      <Tooltip title={title ? title : titleDefault}>
        <IconButton  className={classes.root} {...adjustedButtonProps}>
          <IconDelete />
        </IconButton>
      </Tooltip>
    );
  else if (type == "Email")
    button = (
      <Tooltip title={title ? title : titleDefault}>
        <IconButton  className={classes.root} {...adjustedButtonProps}>
          <IconEmail />
        </IconButton>
      </Tooltip>
    );
  else if (type == "Lock")
    button = (
      <Tooltip title={title ? title : titleDefault}>
        <IconButton  className={classes.root} {...adjustedButtonProps}>
          <IconBlock />
        </IconButton>
      </Tooltip>
    );
  else if (type == "UnLock")
    button = (
      <Tooltip title={title ? title : titleDefault}>
        <IconButton  className={classes.root} {...adjustedButtonProps}>
          <IconUnBlock />
        </IconButton>
      </Tooltip>
    );
  return button;
};
GridIconButton.propTypes = {
  type: PropTypes.string.isRequired,
  title: PropTypes.string,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
};
GridIconButton.defaultProps = {
  disabled: false,
};
export default GridIconButton;
