import { Save } from "styled-icons/fluentui-system-regular";
import { Edit } from "styled-icons/fluentui-system-filled";
import { Cancel } from "styled-icons/material";
import CheckIcon from '@mui/icons-material/Check';
import Delete from '@mui/icons-material/Delete';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
const defaultSize = 22;
const IconSave = () => {
  return <Save size={24}></Save>;
};
const IconDelete = ({ size }) => {
  return <Delete size={size ? size : defaultSize}></Delete>;
};
const IconEdit = () => {
  return <Edit size={24}></Edit>;
};
const IconCancel = () => {
  return <Cancel color="#64748B" size={24}></Cancel>;
};
const IconEmail = () => {
  return <EmailIcon size={24}></EmailIcon>;
};
const IconActive = () => {
  return <CheckIcon size={24}></CheckIcon>;
};
const IconBlock = () => {
  return <LockIcon size={24}></LockIcon>;
};
const IconUnBlock = () => {
  return <LockOpenIcon size={24}></LockOpenIcon>;
};
export { IconSave, IconDelete, IconEdit, IconCancel, IconEmail, IconActive, IconBlock, IconUnBlock };
