import { useState, useEffect } from 'react'
import PropTypes from "prop-types"
import { makeStyles } from '@material-ui/core/styles'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import ReactDOM from 'react-dom'

const useStyles = makeStyles(theme => ({
  popover: {
    pointerEvents: 'none',
  },
  popoverContent: {
    pointerEvents: 'auto',
  },
}))

const CustomPopoverControl = (props) => {
  const { anchorEl, id = 'popover-target', onClose, genderBody, anchorOrigin, transformOrigin, isHideWhenWithOutFocus = true, className } = props
  const [open, setOpen] = useState(Boolean(anchorEl))
  const [position, setPosition] = useState({ top: 0, left: 0 })

  const onClick = (e) => {
    e.stopPropagation()
  }

  useEffect(() => {
    setOpen(Boolean(anchorEl))
  }, [anchorEl])

  useEffect(() => {
    if (open === true) {
      calculatePosition()
      const handleResize = () => {
        calculatePosition()
      }

      window.addEventListener('resize', handleResize)

      return () => {
        window.removeEventListener('resize', handleResize)
      }
    }
  }, [open])

  const calculatePosition = () => {
    const targetElement = document.getElementById(id)
    const targetRect = targetElement.getBoundingClientRect()
    const targetContainer = anchorEl.getBoundingClientRect()
    const windowHeight = window.innerHeight
    const windowWidth = window.innerWidth
    const popoverHeight = targetRect.height // Chiều cao của popover
    const popoverWidth = targetRect.width // Chiều rộng của popover
    let top = targetContainer.top + 10 + targetContainer.height
    let left = targetContainer.left
    let height = targetRect.height
    //height popover vượt quá màn hình
    if (top + popoverHeight > (windowHeight - 20)) {
      // top = targetContainer.top - popoverHeight - 10
      height = windowHeight - top - 20
    }

    if (left + popoverWidth > windowWidth) {
      left = targetContainer.right - popoverWidth
    }

    setPosition({ top: top, left, height })
  }

  return open === true ? ReactDOM.createPortal(
      <div
        id={id || "popover-target"}
        className={className}
        onClick={onClick}
        style={{
          position: 'absolute',
          top: position.top,
          left: position.left,
          height: position.height,
          zIndex: 1070,
          background: '#fff',
          filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
          display: 'flex'
        }}
      >
        {genderBody && genderBody()}
      </div>,
    document.body
  ) : ''
}
CustomPopoverControl.propTypes = {
  anchorOrigin: PropTypes.object
}
CustomPopoverControl.defaultProps = {
  anchorOrigin: {
    vertical: 'top',
    horizontal: 'left',
  },
  transformOrigin: {
    vertical: 'top',
    horizontal: 'left',
  }
}
export default CustomPopoverControl