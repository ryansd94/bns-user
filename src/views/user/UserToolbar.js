import React from "react";
import ToolBar from "components/toolbar/ToolBar";
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from "react-redux";
import {
    setColumnVisibility,
} from "stores/views/user";
import { useTranslation } from "react-i18next";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { IconDelete } from "components/icon/icon";
const UserToolbar = (props) => {

    console.log("render user toolbar");
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
    return <ToolBar dropdownItem={a} visible={visible} onColumnConfigChange={handleColumnConfigChange} columnModel={columnModel} onAddClick={onAddClick} />

}
UserToolbar.propTypes = {
    onAddClick: PropTypes.func,
}
export default UserToolbar;