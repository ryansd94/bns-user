export const LOCAL_STORAGE_KEYS = {
  user: "user",
  accessToken: "accessToken",
  refreshToken: "refreshToken",
  courses: "courses",
  i18nextLng: "i18nextLng",
  shopIndex: "shopIndex",
};
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
  userNotRegister: "UserNotRegister"
};
export const MODAL = {
  open: "OPEN",
  close: "CLOSE",
  change_title: "CHANGE_TITLE",
};
export const EUserStatus = {
  ACTIVE: 1,
  IN_ACTIVE: 2,
  WAILTING_CONFIRM_MAIL: 3,
  BLOCK: 4,
};

export const EUserValidate = {
  OK: 1,
  IS_HAS_ACCOUNT: 2,
};
export const EAlertPopupType = {
  DELETE: 1,
  UPDATE_STATUS: 2,
};

export const EButtonType = {
  add: "Add",
  delete: "Delete",
  columnConfig: "COLUMN_CONFIG",
  function: "FUNCTION",
  filter: "FILTER",
  addFilter: "Add_Filter",
  clearFilter: "Clear_Filter",
  save: "Save",
  apply: "Apply"
};
export const EColumnType = {
  checkbox: "Checkbox",
  text: "Text"
}

export const EFilterType = {
  select: "Select",
  multiSelect: "MultiSelect",
  text: "Text",
  datetime: "Datetime"
}

export const EColor =
{
  cancel: '#86878796'
}

export const EFormatDate =
{
  ddmmyyyy: "dd/MM/yyyy"
}

export const EButtonIconType = {
  save: "Save",
  apply: "Apply",
  cancel: "Cancel",
  back: "Back",
  more: " More",
  add: "Add",
  delete: "Delete",
  up: "Up",
  down: "Down",
  edit: "Edit"
}

export const EButtonDetailType = {
  save: "Save",
  undo: "Undo",
  accpet: "Accpet",
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
  datePicker: "DatePicker"
}

export const baseUrl = {
  jm_template: 'jm_template',
  jm_status: 'jm_status',
  jm_team: 'jm_team',
  jm_user: 'jm_user',
  sys_filter: 'sys_filter',
  jm_taskType: 'jm_tasktype',
}

export const _TemplateVariant = EVariant.normal
export const _ControlSizeDefault = ESize.small