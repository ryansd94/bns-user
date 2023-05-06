import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import PropTypes from "prop-types"
import Tooltip from "@mui/material/Tooltip"
import IconButton from "@mui/material/IconButton"
import { makeStyles } from '@mui/styles'
import { EButtonIconType, ESize } from "configs"
import { IconDelete } from "components/icon/icon"
import { createTheme, ThemeProvider } from "@mui/material/styles"
import {
  IconEdit,
  IconEmail,
  IconBlock,
  IconUnBlock,
  IconApply,
  IconCancel,
  IconBack,
  IconMore,
  IconAdd,
  IconUp,
  IconDown,
  IconUpload,
  IconComment,
  IconFullScreen,
  IconRequire,
  IconSetting,
  IconSwitchRight,
  IconSwitchLeft
} from "components/icon/icon"
import { isHasPermissionForButton } from "helpers"
import { EColor } from 'configs/enums'

const useStyles = makeStyles({
  root: {
    "&.Mui-disabled": {
      pointerEvents: "auto"
    }
  },
})

const ButtonIcon = (props) => {
  const classes = useStyles()
  const { t } = useTranslation()
  const { type, onClick, title, disabled, color, size, showTooltip = true,
    style, refs, className = 'button-icon', isCheckPermissionDefault = false } = props
  const [titleDefault, setTitle] = useState("")
  const [isCheckPermission, setIsCheckPermission] = useState(isCheckPermissionDefault)
  const [isShow, setIsShow] = useState(true)
  const theme = createTheme({
    palette: {
      neutral: {
        main: EColor.cancel,
        contrastText: "#fff",
      },
      delete: {
        main: "#e50e0e96",
        contrastText: "#fff",
      },
    },
  })

  useEffect(() => {
    switch (type) {
      case EButtonIconType.edit:
        setTitle(t("Chỉnh sửa"))
        setIsCheckPermission(true)
        break
      case EButtonIconType.delete:
        setTitle(t("Xóa"))
        setIsCheckPermission(true)
        break
      case EButtonIconType.lock:
        setTitle(t("Khóa"))
        break
      case EButtonIconType.unLock:
        setTitle(t("Mở khóa"))
        break
      case EButtonIconType.apply:
        setTitle(t("Xác nhận"))
        break
      case EButtonIconType.cancel:
        setTitle(t("Hủy bỏ"))
        break
      case EButtonIconType.back:
        setTitle(t("Quay về"))
        break
      case EButtonIconType.add:
        setTitle(t("Thêm mới"))
        break
      case EButtonIconType.up:
        setTitle(t("Lên"))
        break
      case EButtonIconType.down:
        setTitle(t("Xuống"))
        break
      case EButtonIconType.comment:
        setTitle(t("Trả lời"))
        break
      case EButtonIconType.fullScreen:
        setTitle(t("Full màn hình"))
        break
      case EButtonIconType.require:
        setTitle(t("Bắt buộc nhập"))
        break
      case EButtonIconType.setting:
        setTitle(t("Thiết lập"))
        break
      case EButtonIconType.switchLeft:
        setTitle(t("Chuyển sang trái"))
        break
      case EButtonIconType.switchRight:
        setTitle(t("Chuyển sang phải"))
        break
      default:
        break
    }
  }, [])

  useEffect(() => {
    if (isCheckPermission === true) {
      setIsShow(isHasPermissionForButton(type))
    }
  }, [isCheckPermission])

  let button
  let icon
  let width = 21
  let height = 21

  const adjustedButtonProps = {
    disabled: disabled,
    component: disabled ? "div" : undefined,
    onClick: disabled ? undefined : onClick,
  }
  if (type == "Edit")
    icon = <IconEdit style={{ width: width, height: height }} />
  else if (type == "Delete")
    icon = <IconDelete style={{ width: width, height: height }} />
  else if (type == "Email")
    icon = <IconEmail style={{ width: width, height: height }} />
  else if (type == "Lock")
    icon = <IconBlock style={{ width: width, height: height }} />
  else if (type == "UnLock")
    icon = <IconUnBlock style={{ width: width, height: height }} />
  else if (type == EButtonIconType.apply)
    icon = <IconApply style={{ width: width, height: height }} />
  else if (type == EButtonIconType.cancel)
    icon = <IconCancel style={{ width: width, height: height }} />
  else if (type == EButtonIconType.back)
    icon = <IconBack style={{ width: width, height: height }} />
  else if (type == EButtonIconType.more)
    icon = <IconMore style={{ width: width, height: height }} />
  else if (type == EButtonIconType.add)
    icon = <IconAdd style={{ width: width, height: height }} />
  else if (type == EButtonIconType.up)
    icon = <IconUp style={{ width: width, height: height }} />
  else if (type == EButtonIconType.down)
    icon = <IconDown style={{ width: width, height: height }} />
  else if (type == EButtonIconType.upload)
    icon = <IconUpload style={{ width: width, height: height }} />
  else if (type == EButtonIconType.comment)
    icon = <IconComment style={{ width: width, height: height }} />
  else if (type == EButtonIconType.fullScreen)
    icon = <IconFullScreen style={{ width: width, height: height }} />
  else if (type == EButtonIconType.require)
    icon = <IconRequire style={{ width: width, height: height }} />
  else if (type == EButtonIconType.setting)
    icon = <IconSetting style={{ width: width, height: height }} />
  else if (type == EButtonIconType.switchLeft)
    icon = <IconSwitchLeft style={{ width: width, height: height }} />
  else if (type == EButtonIconType.switchRight)
    icon = <IconSwitchRight style={{ width: width, height: height }} />

  button = (
    <IconButton
      ref={refs}
      style={style}
      color={color}
      size={size}
      className={`${classes.root} ${className}`}
      {...adjustedButtonProps}
      aria-describedby={'mouse-over-popover'}
    >
      {icon}
    </IconButton>
  )

  return isShow === true ? (showTooltip ? <ThemeProvider theme={theme}>
    <Tooltip title={title ? title : titleDefault}>{button}</Tooltip>
  </ThemeProvider> : <ThemeProvider theme={theme}>{button}</ThemeProvider>) : ''
}
ButtonIcon.propTypes = {
  type: PropTypes.string.isRequired,
  title: PropTypes.string,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  size: PropTypes.string,
  showTooltip: PropTypes.bool
}
ButtonIcon.defaultProps = {
  disabled: false,
  size: ESize.medium,
  showTooltip: true
}
export default ButtonIcon
