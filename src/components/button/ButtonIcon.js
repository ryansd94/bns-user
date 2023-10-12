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
  IconSwitchLeft,
  IconClose,
  IconRefresh,
  IconCopy,
  IconHide,
  IconUnhide
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
    style, refs, className = 'button-icon', isCheckPermissionDefault = false, isHoverColor } = props
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
        setTitle(t("Edit"))
        setIsCheckPermission(true)
        break
      case EButtonIconType.delete:
        setTitle(t("Delete"))
        setIsCheckPermission(true)
        break
      case EButtonIconType.lock:
        setTitle(t("Lock"))
        break
      case EButtonIconType.unLock:
        setTitle(t("Un lock"))
        break
      case EButtonIconType.apply:
        setTitle(t("Confirm"))
        break
      case EButtonIconType.cancel:
        setTitle(t("Cancel"))
        break
      case EButtonIconType.back:
        setTitle(t("Back to"))
        break
      case EButtonIconType.add:
        setTitle(t("Add new"))
        break
      case EButtonIconType.up:
        setTitle(t("Up"))
        break
      case EButtonIconType.down:
        setTitle(t("Down"))
        break
      case EButtonIconType.comment:
        setTitle(t("Reply"))
        break
      case EButtonIconType.fullScreen:
        setTitle(t("Full screen"))
        break
      case EButtonIconType.require:
        setTitle(t("Required"))
        break
      case EButtonIconType.setting:
        setTitle(t("Setting"))
        break
      case EButtonIconType.switchLeft:
        setTitle(t("Move left"))
        break
      case EButtonIconType.switchRight:
        setTitle(t("Move right"))
        break
      case EButtonIconType.close:
        setTitle(t("Close"))
        break
      case EButtonIconType.refresh:
        setTitle(t("Reload"))
        break
      case EButtonIconType.hide:
        setTitle(t("Hide"))
        break
      case EButtonIconType.unhide:
        setTitle(t("Unhide"))
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
  let fontSize = '21px'

  if (size === ESize.small) {
    fontSize = '14px'
  }
  const adjustedButtonProps = {
    disabled: disabled,
    component: disabled ? "div" : undefined,
    onClick: disabled ? undefined : onClick,
  }

  // const styleIcon = { width: width, height: height }
  const styleIcon = { fontSize: fontSize }

  if (type == "Edit")
    icon = <IconEdit style={styleIcon} />
  else if (type == "Delete")
    icon = <IconDelete style={styleIcon} />
  else if (type == "Email")
    icon = <IconEmail style={styleIcon} />
  else if (type == "Lock")
    icon = <IconBlock style={styleIcon} />
  else if (type == "UnLock")
    icon = <IconUnBlock style={styleIcon} />
  else if (type == EButtonIconType.apply)
    icon = <IconApply style={styleIcon} />
  else if (type == EButtonIconType.cancel)
    icon = <IconCancel style={styleIcon} />
  else if (type == EButtonIconType.back)
    icon = <IconBack style={styleIcon} />
  else if (type == EButtonIconType.more)
    icon = <IconMore style={styleIcon} />
  else if (type == EButtonIconType.add)
    icon = <IconAdd style={styleIcon} />
  else if (type == EButtonIconType.up)
    icon = <IconUp style={styleIcon} />
  else if (type == EButtonIconType.down)
    icon = <IconDown style={styleIcon} />
  else if (type == EButtonIconType.upload)
    icon = <IconUpload style={styleIcon} />
  else if (type == EButtonIconType.comment)
    icon = <IconComment style={styleIcon} />
  else if (type == EButtonIconType.fullScreen)
    icon = <IconFullScreen style={styleIcon} />
  else if (type == EButtonIconType.require)
    icon = <IconRequire style={styleIcon} />
  else if (type == EButtonIconType.setting)
    icon = <IconSetting style={styleIcon} />
  else if (type == EButtonIconType.switchLeft)
    icon = <IconSwitchLeft style={styleIcon} />
  else if (type == EButtonIconType.switchRight)
    icon = <IconSwitchRight style={styleIcon} />
  else if (type == EButtonIconType.close)
    icon = <IconClose style={styleIcon} />
  else if (type == EButtonIconType.refresh)
    icon = <IconRefresh style={styleIcon} />
  else if (type == EButtonIconType.copy)
    icon = <IconCopy style={styleIcon} isHoverColor={isHoverColor} />
  else if (type == EButtonIconType.hide)
    icon = <IconHide style={styleIcon}/>
  else if (type == EButtonIconType.unhide)
    icon = <IconUnhide style={styleIcon}/>

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
