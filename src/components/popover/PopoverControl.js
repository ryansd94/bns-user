import React, { Component, useState, useEffect } from 'react'
import Popover from '@mui/material/Popover'
import PropTypes from "prop-types"
import { makeStyles } from '@material-ui/core/styles'
import ReactDOM from 'react-dom'

const useStyles = makeStyles(theme => ({
  popover: {
    pointerEvents: 'none',
  },
  popoverContent: {
    pointerEvents: 'auto',
  },
}))

const PopoverControl = (props) => {
  const { anchorEl, onClose, genderBody, anchorOrigin, transformOrigin, isHideWhenWithOutFocus = true, className } = props
  const open = Boolean(anchorEl)
  const [position, setPosition] = useState({ top: 0, left: 0 })
  const id = open ? 'mouse-over-popover' : undefined

  const onClick = (e) => {
    e.stopPropagation()
  }

  useEffect(() => {
    if (anchorEl) {
      var isOpen = Boolean(anchorEl)
      if (isOpen) {
        calculatePosition()
        const handleResize = () => {
          calculatePosition()
        }

        window.addEventListener('resize', handleResize)

        return () => {
          window.removeEventListener('resize', handleResize)
        }
      }
    }
  }, [anchorEl])

  const calculatePosition = () => {
    const targetElement = document.getElementById('popover-target')
    const targetRect = targetElement.getBoundingClientRect()
    const targetContainer = anchorEl.getBoundingClientRect()
    const windowHeight = window.innerHeight
    const windowWidth = window.innerWidth
    const popoverHeight = targetRect.height // Chiều cao của popover
    const popoverWidth = 350 // Chiều rộng của popover
    let top = targetContainer.top + 10 + targetContainer.height
    let left = targetContainer.left
    let height = targetRect.height
    //height popover vượt quá màn hình
    if (top + popoverHeight > windowHeight) {
      // top = targetContainer.top - popoverHeight - 10
      height = windowHeight - top
    }

    if (left + popoverWidth > windowWidth) {
      left = targetContainer.right - popoverWidth
    }

    // setPosition({ top, left })
    setPosition({ top: 50, left, height })
  }

  // useEffect(() => {
  //   if (anchorEl) {
  //     const { top, left, height } = anchorEl.getBoundingClientRect()
  //     setPosition({ top: top + 10, left })
  //   }
  // }, [anchorEl])

  // return (
  //   <Popover
  //     id={id}
  //     open={open}
  //     anchorEl={anchorEl}
  //     onClick={onClick}
  //     anchorOrigin={anchorOrigin}
  //     transformOrigin={transformOrigin}
  //     onClose={onClose}
  //     className={`${isHideWhenWithOutFocus ? classes.popover : ''} ${className}`}
  //     classes={isHideWhenWithOutFocus ? {
  //       paper: classes.popoverContent,
  //     } : {}}
  //   >
  //     {genderBody && genderBody()}
  //   </Popover>
  // )

  return (
    open === true ? ReactDOM.createPortal(
      <div
        id="popover-target"
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
  transformOrigin: {
    vertical: 'top',
    horizontal: 'left',
  }
}
export default PopoverControl