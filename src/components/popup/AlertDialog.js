import * as React from "react"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogTitle from "@mui/material/DialogTitle"
import { open as openAlert } from "stores/components/alert-dialog"
import { useSelector, useDispatch } from "react-redux"
import { useTranslation } from "react-i18next"
import ButtonDetail from "components/button/ButtonDetail"
import IconButton from "@mui/material/IconButton"
import { SpinningCircles } from "react-loading-icons"

const AlertDialog = (props) => {
  const open = useSelector((state) => state.alertDialog.open)
  const title = useSelector((state) => state.alertDialog.title)
  const loading = useSelector((state) => state.button.loading)
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { onSubmit } = props

  const handleClose = () => {
    dispatch(openAlert({ open: false, title: title ? title : t("Bạn có chắc muốn xóa dữ liệu này?") }))
  }

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {title ? title : t("Bạn có chắc muốn xóa dữ liệu này?")}
        </DialogTitle>
        <DialogActions>
          <ButtonDetail onClick={handleClose} type="Undo" />
          <ButtonDetail
            disabled={loading}
            isFloatRight={true}
            onClick={onSubmit}
            type="Accpet"
            autoFocus={true}
            dis
          ></ButtonDetail>
        </DialogActions>
      </Dialog>
    </div>
  )
}
export default AlertDialog
