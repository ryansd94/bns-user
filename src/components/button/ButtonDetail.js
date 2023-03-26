import React, { useState, useEffect, useStateIfMounted } from "react"
import Button from "@mui/material/Button"
import { useTranslation } from "react-i18next"
import PropTypes from "prop-types"
import { IconSave, IconCancel } from "components/icon/icon"
import { createTheme, ThemeProvider } from "@mui/material/styles"
import { EColor, EButtonDetailType } from "configs"
import IconButton from "@mui/material/IconButton"
import { SpinningCircles } from "react-loading-icons"
import { useSelector, useDispatch } from "react-redux"
import Grid from "@mui/material/Grid"

const ButtonDetail = (props) => {
  const dispatch = useDispatch()
  const theme = createTheme({
    palette: {
      neutral: {
        main: EColor.cancel,
        contrastText: "#fff",
      },
    },
  })
  const { t } = useTranslation()
  const { type, onClick, autoFocus, disabled, className } = props
  const [icon, setIcon] = useState("")
  const [text, setText] = useState("")
  const [color, setColor] = useState(null)
  const [defaultLoading, setDefaultLoading] = useState(false)
  const loading = useSelector((state) => state.button.loading)
  useEffect(() => {
    switch (type) {
      case EButtonDetailType.save:
        setIcon(<IconSave />)
        setText(t("Lưu"))
        setDefaultLoading(true)
        break
      case EButtonDetailType.ok:
        setIcon(<IconSave />)
        setText(t("Ok"))
        break
      case EButtonDetailType.undo:
        setIcon(<IconCancel></IconCancel>)
        setText(t("Hủy bỏ"))
        setColor("neutral")
        break
      case EButtonDetailType.accpet:
        setIcon(<IconSave />)
        setText(t("Xác nhận"))
        setDefaultLoading(true)
        break
      default:
        break
    }
  }, [])
  let button
  if (type != "Undo") {
    const themeButton = (
      <Button
        onClick={onClick}
        color={color != null ? color : "primary"}
        autoFocus={autoFocus}
        variant="contained"
        disabled={(defaultLoading ? loading : false) || disabled}
        className={className}
      >
        {text}
      </Button>
    )
    button = defaultLoading && loading ?
      (
        <div>
          <IconButton
            className="icon-loading-container"
            hidden={!loading}
            style={{ padding: 0 }}
            aria-label="delete"
          >
            <SpinningCircles
              speed={1}
              width={24}
              height={24}
              fill="#1976d2"
              stroke="#1976d2"
            />
          </IconButton>
          {themeButton}
        </div>
      ) : themeButton
  } else {
    button = <ThemeProvider theme={theme}>
      <Button
        onClick={onClick}
        color={color != null ? color : "primary"}
        autoFocus={autoFocus}
        className={`${className} button-detail`}
        disabled={disabled}
        // startIcon={icon}
        variant="outlined"
      >
        {text}
      </Button>
    </ThemeProvider>
  }
  return button
}
ButtonDetail.propTypes = {
  type: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  autoFocus: PropTypes.bool,
  disabled: PropTypes.bool,
}
ButtonDetail.defaultProps = {
  disabled: false,
}
export default ButtonDetail
