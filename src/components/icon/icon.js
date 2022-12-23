import { Save } from "styled-icons/fluentui-system-regular"
import { Edit } from "styled-icons/fluentui-system-filled"
import { Cancel } from "styled-icons/material"
import CheckIcon from '@mui/icons-material/Check'
import Delete from '@mui/icons-material/Delete'
import EmailIcon from '@mui/icons-material/Email'
import LockIcon from '@mui/icons-material/Lock'
import LockOpenIcon from '@mui/icons-material/LockOpen'
const defaultSize = "fa-sm"
const IconSave = ({ className }) => {
  return <i className="far fa-save fa-sm"></i>
}
const IconDelete = ({ size }) => {
  return <i className="far fa-trash-alt fa-sm"></i>
}
const IconEdit = ({ className }) => {
  return <i className="far fa-edit fa-sm"></i>
}
const IconCancel = ({ style, className }) => {
  return <i style={style} className="far fa-ban fa-sm"></i>
}
const IconEmail = ({ style, className }) => {
  return <i className={`far fa-envelope fa-sm ${className || ''}`}></i>
}
const IconActive = ({ style, className }) => {
  return <i className={`far fa-check fa-sm ${className || ''}`}></i>
}
const IconBlock = ({ style, className }) => {
  return <i className={`far fa-lock-alt fa-sm ${className || ''}`}></i>
}
const IconUnBlock = ({ style, className }) => {
  return <i className="far fa-unlock-alt fa-sm"></i>
}
const IconClean = ({ style, className }) => {
  return <i className="far fa-undo fa-sm"></i>
}
const IconApply = ({ style, className }) => {
  return <i style={style} className="far fa-check fa-sm"></i>
}
const IconBack = ({ style, className }) => {
  return <i style={style} className="fas fa-arrow-left fa-sm"></i>
}
const IconMore = ({ style, className }) => {
  return <i style={style} className="fas fa-ellipsis-v fa-sm"></i>
}
const IconAdd = ({ style, className }) => {
  return <i style={style} className="far fa-plus fa-sm"></i>
}
const IconCricle = ({ style, className }) => {
  return <i style={style} className="fas fa-circle fa-sm"></i>
}
const IconUp = ({ style, className }) => {
  return <i style={style} className="far fa-arrow-up fa-sm"></i>
}
const IconDown = ({ style, className }) => {
  return <i style={style} className="far fa-arrow-down fa-sm"></i>
}
const IconExpand = ({ style, className }) => {
  return <i style={style} className="far fa-angle-down fa-sm"></i>
}

export {
  IconSave, IconDelete, IconEdit, IconCancel, IconEmail, IconActive, IconBlock,
  IconUnBlock, IconClean, IconApply, IconBack, IconMore, IconAdd, IconCricle, IconUp, IconDown, IconExpand
}
