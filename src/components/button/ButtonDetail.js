import React, { useState, useEffect, useStateIfMounted } from "react";
import Button from "@mui/material/Button";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { IconSave, IconCancel } from "components/icon/icon";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { EColor, EButtonDetailType } from "configs";

const ButtonDetail = (props) => {
  const theme = createTheme({
    palette: {
      neutral: {
        main: EColor.cancel,
        contrastText: "#fff",
      },
    },
  });
  const { t } = useTranslation();
  const { type, onClick, autoFocus, disabled } = props;
  const [icon, setIcon] = useState("");
  const [text, setText] = useState("");
  const [color, setColor] = useState(null);
  useEffect(() => {
    switch (type) {
      case EButtonDetailType.save:
        setIcon(<IconSave />);
        setText(t("Lưu"));
        break;
      case EButtonDetailType.undo:
        setIcon(<IconCancel></IconCancel>);
        setText(t("Hủy bỏ"));
        setColor("neutral");
        break;
      case EButtonDetailType.accpet:
        setIcon(<IconSave />);
        setText(t("Xác nhận"));
        break;
      default:
        break;
    }
  }, []);
  let button;
  if (type != "Undo") {
    button = (
      <Button
        onClick={onClick}
        color={color != null ? color : "primary"}
        autoFocus={autoFocus}
        variant="contained"
        disabled={disabled}
      >
        {text}
      </Button>
    );
  } else {
    button = (
      <ThemeProvider theme={theme}>
        <Button
          onClick={onClick}
          color={color != null ? color : "primary"}
          autoFocus={autoFocus}
          // startIcon={icon}
          variant="outlined"
        >
          {text}
        </Button>
      </ThemeProvider>
    );
  }

  return button;
};
ButtonDetail.propTypes = {
  type: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  autoFocus: PropTypes.bool,
  disabled: PropTypes.bool,
};
ButtonDetail.defaultProps = {
  disabled: false,
};
export default ButtonDetail;
