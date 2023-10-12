import React from "react"
import Popover from '@mui/material/Popover'
import PropTypes from "prop-types"
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  popover: {
    pointerEvents: 'none',
  },
  popoverContent: {
    pointerEvents: 'auto',
  },
}))

const PopoverControl = (props) => {
  const { anchorEl, id, onClose, genderBody, anchorPosition, anchorOrigin = {
    vertical: 'bottom',
    horizontal: 'left',
  },
    transformOrigin = {
      vertical: 'top',
      horizontal: 'left',
    }, isHideWhenWithOutFocus = true, className, isCloseOnClick = false, paperProps } = props
  const classes = useStyles();
  const open = Boolean(anchorEl)

  const onClick = (e) => {
    e.stopPropagation()
  }

  const onContentClick = (event) => {
    if (isCloseOnClick === true) {
      onClose && onClose(event)
    }
  }

  const renderContent = () => {
    return <Popover
      id={id}
      open={open}
      anchorEl={anchorEl}
      onClick={onClick}
      anchorOrigin={anchorOrigin}
      transformOrigin={transformOrigin}
      PaperProps={paperProps}
      // anchorPosition={anchorPosition}
      onClose={onClose}
      className={`${isHideWhenWithOutFocus ? classes.popover : ''} ${className}`}
      classes={isHideWhenWithOutFocus ? {
        paper: classes.popoverContent,
      } : {}}
    >
      {<div onClick={onContentClick}>{genderBody && genderBody()}</div>}
    </Popover>
  }

  return renderContent()
}

export default PopoverControl