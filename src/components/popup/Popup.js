import React, { useEffect, useState } from "react"
import PropTypes from "prop-types"
import { styled } from "@mui/material/styles"
import Dialog from "@mui/material/Dialog"
import DialogTitle from "@mui/material/DialogTitle"
import DialogContent from "@mui/material/DialogContent"
import DialogActions from "@mui/material/DialogActions"
import IconButton from "@mui/material/IconButton"
import CloseIcon from "@mui/icons-material/Close"
import Paper from "@mui/material/Paper"
import Draggable from "react-draggable"
import ButtonDetail from "components/button/ButtonDetail"
import { useSelector, useDispatch } from "react-redux"
import { close } from "components/popup/popupSlice"
import { setEditData } from "stores/views/master"
import { EButtonDetailType } from "configs"
import _ from 'lodash'

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}))

const BootstrapDialogTitle = (props) => {
  const { children, onClose, ...other } = props

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  )
}

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
}

function PaperComponent(props) {
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  )
}

const Popup = React.memo((props) => {
  const dispatch = useDispatch()
  const { ModalBody, open = null, title = null,
    onSave, widthSize = "sm", reset, typeSave = EButtonDetailType.save,
    isShowFooter = true, handleClose = null } = props

  const onClose = () => {
    if (_.isNil(handleClose)) {
      dispatch(close())
      dispatch(setEditData(null))
    } else {
      handleClose()
    }
  }
  const stateOpen = !_.isNil(open) ? open : useSelector((state) => state.popup.open)
  const stateTitle = !_.isNil(title) ? title : useSelector((state) => state.popup.title)

  useEffect(() => {
    if (!stateOpen) {
      reset && reset()
    }
  }, [stateOpen])

  return (
    <div>
      <BootstrapDialog
        maxWidth={widthSize}
        fullWidth={true}
        aria-labelledby="draggable-dialog-title"
        PaperComponent={PaperComponent}
        open={stateOpen}
        onClose={onClose}
      >
        <BootstrapDialogTitle
          id="draggable-dialog-title"
          onClose={onClose}
        >
          {stateTitle}
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <ModalBody />
        </DialogContent>
        {isShowFooter ? <DialogActions>
          <ButtonDetail onClick={onClose} type={EButtonDetailType.undo} />
          <ButtonDetail isFloatRight={true} onClick={onSave} type={typeSave} />
        </DialogActions> : ''}
      </BootstrapDialog>
    </div>
  )
})

Popup.propTypes = {
  onSave: PropTypes.func.isRequired,
  ModalBody: PropTypes.func.isRequired,
  widthSize: PropTypes.string,
}
Popup.defaultProps = {
  widthSize: "sm",
}
export default Popup
