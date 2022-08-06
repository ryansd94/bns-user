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
  const { anchorEl, onClose, genderBody, anchorOrigin, isCLoseOnHover = false } = props
  const classes = useStyles();
  const open = Boolean(anchorEl)
  const id = open ? 'mouse-over-popover' : undefined

  const onClick = (e) => {
    e.stopPropagation()
  }

  return (
    <Popover
      id={id}
      open={open}
      anchorEl={anchorEl}
      onClick={onClick}
      anchorOrigin={anchorOrigin}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      onClose={onClose}
      className={classes.popover}
      classes={{
        paper: classes.popoverContent,
      }}
    >
      {genderBody && genderBody()}
    </Popover>
  )
}
PopoverControl.propTypes = {
  anchorOrigin: PropTypes.object
}
PopoverControl.defaultProps = {
  anchorOrigin: {
    vertical: 'top',
    horizontal: 'left',
  },
}
export default PopoverControl