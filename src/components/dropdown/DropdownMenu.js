import React from "react"
import ClickAwayListener from "@mui/material/ClickAwayListener"
import ButtonFuntion from "components/button/ButtonFuntion"
import ButtonIcon from "components/button/ButtonIcon"
import { EButtonType, EPlacement } from "configs/enums"
import {
  PopoverControl,
  CustomPopoverControl,
  PopperControl,
} from "components/popover"
import { IconExpand } from "components/icon/icon"
import Box from "@mui/material/Box"
import PropTypes from "prop-types"

const DropdownMenu = (props) => {
  const {
    renderDropdownItem,
    type = EButtonType.add,
    visible = false,
    isShowEndIcon = true,
    label,
    isFloatLeft = false,
    spacingLeft = 1,
    isButtonIcon = false,
    className,
    isCloseOnClick = false,
    classNameIcon,
    isTextAndIcon = true,
    anchorOrigin,
    transformOrigin,
    placement = EPlacement.bottom,
  } = props
  const [open, setOpen] = React.useState(false)
  const anchorRef = React.useRef(null)

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen)
  }
  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return
    }

    setOpen(false)
  }

  const renderEndIcon = () => {
    return <IconExpand />
  }

  const renderButtonFunction = () => {
    return (
      <ButtonFuntion
        isFloatLeft={isFloatLeft}
        label={label}
        isTextAndIcon={isTextAndIcon}
        className={`button-detail`}
        endIcon={isShowEndIcon ? renderEndIcon() : ""}
        visible={visible}
        spacingLeft={spacingLeft}
        refs={anchorRef}
        onClick={handleToggle}
        type={type}
      />
    )
  }

  const renderButtonIcon = () => {
    return (
      <ButtonIcon
        refs={anchorRef}
        type={type}
        className={classNameIcon}
        onClick={handleToggle}
      />
    )
  }

  const onItemClick = (e) => {
    if (isCloseOnClick) {
      handleClose(e)
    }
  }
  return (
    <div className={`${className}`}>
      {isButtonIcon ? renderButtonIcon() : renderButtonFunction()}
      {open ? (
        <ClickAwayListener onClickAway={handleClose}>
          <Box>
            <PopperControl
              placement={placement}
              id="dropdown-menu"
              anchorEl={open ? anchorRef.current : null}
            >
              <div onClick={onItemClick}>{renderDropdownItem()}</div>
            </PopperControl>
          </Box>
        </ClickAwayListener>
      ) : (
        ""
      )}
    </div>
  )
}
DropdownMenu.propTypes = {
  anchorOrigin: PropTypes.object,
}
DropdownMenu.defaultProps = {
  anchorOrigin: {
    vertical: "top",
    horizontal: "left",
  },
  transformOrigin: {
    vertical: "top",
    horizontal: "right",
  },
}

export default DropdownMenu
