import React from "react";
import ToolBar from "components/toolbar/ToolBar";
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from "react-redux";
import {
    setColumnVisibility,
} from "stores/views/user";
import {
  setConfig,
} from "stores/views/new";
import { useTranslation } from "react-i18next";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { IconDelete } from "components/icon/icon";
import UserPopup from "./UserPopup";
import { open, change_title } from "components/popup/popupSlice";
const UserToolbar = (props) => {

    console.log("render user toolbar");
    const config = { ...useSelector((state) => state.new.config) };
    const { onAddClick } = props;
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const visible = { ...useSelector((state) => state.user.toolbarVisible) };
    const columnVisibility = { ...useSelector((state) => state.user.columnVisibility) };

    const columnModel = [{
        field: "email", value: true, label: t("Email")
    }, {
        field: "fullName", value: true, label: t("Họ tên")
    }, {
        field: "status", value: true, label: t("Trạng thái")
    }, {
        field: "createdDate", value: true, label: t("Ngày tạo")
    }];
    const handleColumnConfigChange = (event) => {
        columnVisibility[event.target.name] = event.target.checked;
        dispatch(setColumnVisibility({ ...columnVisibility }))
    };
    const a = (
        <MenuItem disableRipple>
            <IconDelete size={18} />
            Edit
        </MenuItem>
    );
    const handleClickOpen = () => {
        //reset();
        dispatch(change_title(t("Thêm mới người dùng")));
        config.loading = false
        dispatch(setConfig({ ...config }));
        //dispatch(setEditData(null));
        dispatch(open());
      };
    
    return <div>
        <ToolBar dropdownItem={a} visible={visible} 
        onColumnConfigChange={handleColumnConfigChange} columnModel={columnModel} 
        onAddClick={handleClickOpen} />
        <UserPopup />
    </div>

}
UserToolbar.propTypes = {
    onAddClick: PropTypes.func,
}
export default UserToolbar;