import { Save } from "styled-icons/fluentui-system-regular";
import { Edit, Delete } from "styled-icons/fluentui-system-filled";
import { Cancel } from "styled-icons/material";
import CheckIcon from '@mui/icons-material/Check';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
const IconSave = () => {
  return <Save size={24}></Save>;
};
const IconDelete = () => {
  return <Delete size={24}></Delete>;
};
const IconEdit = () => {
  return <Edit size={24}></Edit>;
};
const IconCancel = () => {
  return <Cancel color="#64748B" size={24}></Cancel>;
};
const IconEmail = () => {
  return <MailOutlineIcon size={24}></MailOutlineIcon>;
};
const IconActive = () => {
  return <CheckIcon size={24}></CheckIcon>;
};
export { IconSave, IconDelete, IconEdit, IconCancel,IconEmail,IconActive };
