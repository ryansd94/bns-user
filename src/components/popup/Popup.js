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
import { SpinningCircles } from "react-loading-icons"

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
  const { ModalBody, onSave, widthSize = "sm", reset } = props
  const handleClose = () => {
    dispatch(close())
    dispatch(setEditData(null))
  }
  const open = useSelector((state) => state.popup.open)
  const title = useSelector((state) => state.popup.title)
  const loading = useSelector((state) => state.button.loading)

  useEffect(() => {
    if (!open) {
      reset && reset()
    }
  }, [open])

  return (
    <div>
      <BootstrapDialog
        maxWidth={widthSize}
        fullWidth={true}
        aria-labelledby="customized-dialog-title"
        PaperComponent={PaperComponent}
        open={open}
        onClose={handleClose}
      >
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={handleClose}
        >
          {title}
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <ModalBody />
        </DialogContent>
        <DialogActions>
          <IconButton
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
          <ButtonDetail onClick={handleClose} type="Undo" />
          <ButtonDetail
            disabled={loading} onClick={onSave} type={"Save"} />
        </DialogActions>
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
