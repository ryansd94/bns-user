const defaultSize = "fa-sm"
const IconSave = ({ className }) => {
  return <i className="far fa-save fa-sm"></i>
}
const IconDelete = ({ style, size, onClick, className = '' }) => {
  return <i style={style} onClick={onClick} className={`far fa-trash-alt fa-sm ${className}`}></i>
}
const IconEdit = ({ className }) => {
  return <i className={`far fa-edit fa-sm ${className}`}></i>
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
  return <i style={style} className="fas fa-ellipsis-h fa-sm"></i>
}
const IconAdd = ({ style, className }) => {
  return <i style={style} className="far fa-plus fa-sm"></i>
}
const IconCricle = ({ style, className }) => {
  return <i style={style} className={`fas fa-circle fa-xs ${className}`}></i>
}
const IconUp = ({ style, className }) => {
  return <i style={style} className="far fa-arrow-up fa-sm"></i>
}
const IconDown = ({ style, className }) => {
  return <i style={style} className="far fa-arrow-down fa-sm"></i>
}
const IconExpand = ({ style, className, onClick }) => {
  return <i onClick={onClick} style={style} className={`far fa-angle-down fa-sm ${className}`}></i>
}
const IconRemove = ({ style, className }) => {
  return <i style={style} className={`fa-regular fa-xmark fa-sm ${className}`}></i>
}
const IconUpload = ({ style, className }) => {
  return <i style={style} className="far fa-upload fa-sm"></i>
}
const IconChange = ({ style, className }) => {
  return <i style={style} className="far fa-exchange fa-sm"></i>
}
const IconCopy = ({ style, className, isHoverColor = false }) => {
  const content = <i style={style} className="far fa-copy fa-sm"></i>
  return isHoverColor ? <a className='icon'>{content}</a> : content
}
const IconComment = ({ style, className }) => {
  return <i style={style} className="far fa-comment-alt fa-sm"></i>
}
const IconFullScreen = ({ style, className }) => {
  return <i style={style} className="far fa-expand-alt fa-sm"></i>
}
const IconHour = ({ style, className }) => {
  return <i style={style} className="far fa-clock fa-sm"></i>
}
const IconDescription = ({ style, className, onClick }) => {
  return <i onClick={onClick} style={style} className={`far fa-file-invoice ${className}`}></i>
}
const IconTable = ({ style, className, onClick }) => {
  return <i onClick={onClick} style={style} className={`far fa-table ${className}`}></i>
}
const IconList = ({ style, className, onClick }) => {
  return <i onClick={onClick} style={style} className={`far fa-list ${className}`}></i>
}
const IconRequire = ({ style, className, onClick }) => {
  return <i onClick={onClick} style={style} className={`far fa-exclamation-circle ${className}`}></i>
}
const IconSetting = ({ style, className, onClick }) => {
  return <i onClick={onClick} style={style} className={`far fa-cog ${className}`}></i>
}
const IconSwitchLeft = ({ style, className, onClick }) => {
  return <i onClick={onClick} style={style} className={`far fa-arrow-alt-left ${className}`}></i>
}
const IconSwitchRight = ({ style, className, onClick }) => {
  return <i onClick={onClick} style={style} className={`far fa-arrow-alt-right ${className}`}></i>
}
const IconClose = ({ style, className, onClick }) => {
  return <i onClick={onClick} style={style} className={`far fa-times ${className}`}></i>
}
const IconBell = ({ style, className, onClick }) => {
  return <i onClick={onClick} style={style} className={`fas fa-bell ${className}`}></i>
}
const IconPlus = ({ style, className, onClick }) => {
  return <i onClick={onClick} style={style} className={`far fa-plus-square ${className}`}></i>
}
const IconMinus = ({ style, className, onClick }) => {
  return <i onClick={onClick} style={style} className={`far fa-minus-square ${className}`}></i>
}
const IconLeft = ({ style, className, onClick }) => {
  return <i onClick={onClick} style={style} className={`far fa-chevron-left ${className}`}></i>
}
const IconRight = ({ style, className, onClick }) => {
  return <i onClick={onClick} style={style} className={`far fa-chevron-right ${className}`}></i>
}
const IconInfo = ({ style, className, onClick }) => {
  return <i onClick={onClick} style={style} className={`far fa-info-circle ${className}`}></i>
}
const IconRefresh = ({ style, className, onClick }) => {
  return <i onClick={onClick} style={style} className={`far fa-sync ${className}`}></i>
}
const IconCollapse = ({ style, className, onClick }) => {
  return <i onClick={onClick} style={style} className={`far fa-angle-right ${className}`}></i>
}
const IconX = ({ style, className, onClick }) => {
  return <a className='icon'><i onClick={onClick} style={style} className={`far fa-times-circle ${className}`}></i></a>
}
const IconHide = ({ style, className, onClick }) => {
  return <a className='icon'><i onClick={onClick} style={style} className={`far fa-eye-slash ${className}`}></i></a>
}
const IconUnhide = ({ style, className, onClick }) => {
  return <a className='icon'><i onClick={onClick} style={style} className={`far fa-eye ${className}`}></i></a>
}


export {
  IconSave, IconDelete, IconEdit, IconCancel, IconEmail, IconActive, IconBlock,
  IconUnBlock, IconClean, IconApply, IconBack, IconMore, IconAdd, IconCricle, IconUp,
  IconDown, IconExpand, IconRemove, IconUpload, IconChange, IconCopy, IconComment, IconFullScreen,
  IconHour, IconDescription, IconTable, IconList, IconRequire, IconSetting, IconSwitchLeft, IconSwitchRight, IconClose,
  IconBell, IconPlus, IconMinus, IconLeft, IconRight, IconInfo, IconRefresh, IconCollapse, IconX, IconHide, IconUnhide
}
