import DialogTitle from "@mui/material/DialogTitle"
import CloseIcon from "@mui/icons-material/Close"
import IconButton from "@mui/material/IconButton"
import DialogContent from "@mui/material/DialogContent"
import DialogActions from "@mui/material/DialogActions"
import { EButtonDetailType } from "configs"
import ButtonDetail from "components/button/ButtonDetail"
import PropTypes from "prop-types"
import _ from "lodash"

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

const PopupContent = (props) => {
  const {
    ModalBody,
    isShowFooter,
    title,
    onClose,
    handleSave,
    typeSave = EButtonDetailType.save,
    disabled,
    labelSave = "",
    id,
  } = props
  return (
    <>
      <BootstrapDialogTitle id="draggable-dialog-title" onClose={onClose}>
        {title}
      </BootstrapDialogTitle>
      <DialogContent dividers className="flex">
        <ModalBody />
      </DialogContent>
      {isShowFooter ? (
        <DialogActions>
          <ButtonDetail onClick={onClose} type={EButtonDetailType.undo} />
          <ButtonDetail
            id={id}
            disabled={disabled}
            label={labelSave}
            isFloatRight={true}
            onClick={handleSave}
            type={typeSave}
          />
        </DialogActions>
      ) : (
        ""
      )}
    </>
  )
}

export default PopupContent
