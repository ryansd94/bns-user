export const LOCAL_STORAGE_KEYS = {
  user: "user",
  accessToken: "accessToken",
  refreshToken: "refreshToken",
  courses: "courses",
  i18nextLng: "i18nextLng",
  shopIndex: "shopIndex",
  userName: "userName",
  password: "password"
}

export const VisibleDefault = {
  add: true,
  column: true,
  function: false,
  delete: false
}

export const ERROR_CODE = {
  success: "Success",
  error: "Failed",
  isExistsData: "IsExistsData",
  userNotRegister: "UserNotRegister",
  tokenNotValid: "TokenNotValid"
}

export const MODAL = {
  open: "OPEN",
  close: "CLOSE",
  change_title: "CHANGE_TITLE",
}

export const EUserStatus = {
  ACTIVE: 1,
  IN_ACTIVE: 2,
  WAILTING_CONFIRM_MAIL: 3,
  BLOCK: 4,
}

export const EUserValidate = {
  OK: 1,
  IS_HAS_ACCOUNT: 2,
}

export const EAlertPopupType = {
  DELETE: 1,
  UPDATE_STATUS: 2,
}

export const EButtonType = {
  add: "Add",
  delete: "Delete",
  columnConfig: "ColumnConfig",
  function: "FUNCTION",
  filter: "FILTER",
  addFilter: "Add_Filter",
  clearFilter: "Clear_Filter",
  save: "Save",
  apply: "Apply",
  refresh: "Refresh",
  addTag: "AddTag",
  more: "More",
  comment: "Comment",
  reply: "Reply",
  cancel: "cancel",
  full: "Full",
  split: "Split",
  list: "List",
  board: "Board",
  edit: "Edit",
  setting: "Setting"
}

export const EPlacement = {
  bottom: 'bottom',
  left: 'left',
  leftStart: 'left-start'
}

export const EColumnType = {
  checkbox: "Checkbox",
  text: "Text"
}

export const EColor =
{
  cancel: '#86878796'
}

export const EFormatDate =
{
  ddmmyyyy: "dd/MM/yyyy",
  ddmmyyyy_hhmm: "dd/MM/yyyy HH:mm"
}

export const EButtonIconType = {
  save: "Save",
  apply: "Apply",
  cancel: "Cancel",
  back: "Back",
  more: "More",
  add: "Add",
  delete: "Delete",
  up: "Up",
  down: "Down",
  edit: "Edit",
  upload: "Upload",
  comment: "Comment",
  fullScreen: "FullScreen",
  require: "Require",
  setting: "Setting",
  email: "Email",
  lock: "Lock",
  unLock: "UnLock",
  switchLeft: "SwitchLeft",
  switchRight: "SwitchRight",
  close: "Close",
  refresh: "Refresh",
  copy: "Copy",
  hide: "Hide",
  unhide: "Unhide"
}

export const EButtonDetailType = {
  save: "Save",
  undo: "Undo",
  accept: "Accept",
  ok: "Ok",
}

export const ESize = {
  miniSmall: "miniSmall",
  small: "small",
  medium: "medium",
  large: "large"
}

export const EWidth = {
  xs: "xs",
  sm: "sm",
  md: "md",
  lg: "lg",
  xl: "xl"
}

export const EVariant = {
  outlined: "outlined",
  standard: "standard",
  normal: "normal"
}

export const EControlType = {
  typography: "Typography",
  textField: "TextField",
  editor: "Editor",
  select: "Select",
  group: "Group",
  dateTimePicker: "DateTimePicker",
  datePicker: "DatePicker",
  userItem: "UserItem",
  number: "Number",
  childTask: "ChildTask",
  parentTask: "ParentTask",
  upload: "Upload",
  comment: "Comment",
  transferList: "TransferList",
  listObject: "ListObject",
  listId: "ListId",
  multiSelect: "MultiSelect",
  checkBox: "CheckBox",
  other: "Other"
}

export const baseUrl = {
  jm_template: 'jm_template',
  jm_status: 'jm_status',
  jm_team: 'jm_team',
  jm_user: 'jm_user',
  sys_filter: 'sys_filter',
  jm_taskType: 'jm_tasktype',
  jm_task: 'jm_task',
  jm_taskcolumn: 'jm_taskcolumn',
  jm_customcolumn: 'jm_customcolumn',
  jm_comment: 'jm_comment',
  jm_priority: 'jm_priority',
  jm_project: 'jm_project',
  sys_viewPermission: 'sys_viewPermission',
  jm_notifyUser: 'jm_notifyuser',
  account: 'account',
  jm_tag: 'jm_tag'
}

export const EViewMode = {
  list: 0,
  board: 1
}

export const EAlertType = {
  error: 'error',
  warning: 'warning',
  info: 'info'
}

export const EControlVariant = {
  circular: 'circular',
  rounded: 'rounded',
  text: 'text'
}

export const EMenuType = {
  group: 'Group',
  collapse: 'Collapse',
  action: 'Action'
}

export const EPermissionObject = {
  user: 0,
  team: 1
}

export const EProjectTypeOption = {
  basic: 0,
  phase: 1
}

export const ERowStatus = {
  addNew: 0,
  update: 1,
  noChange: 2,
  delete: 3
}

export const EPosition = {
  top: 0,
  left: 1,
  right: 2,
  bottom: 3
}

export const EGuidanceContentType = {
  icon: 'Icon',
  detail: 'Detail'
}

export const ESortType = {
  asc: 'asc',
  desc: 'desc'
}

export const _TemplateVariant = EVariant.normal
export const _ControlSizeDefault = ESize.small