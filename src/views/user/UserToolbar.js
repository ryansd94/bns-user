import React from 'react';
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
import UserPopup from "./UserPopup";
import { open, change_title } from "components/popup/popupSlice";
import { EFilterType } from "configs";
const UserToolbar = (props) => {

    console.log("render user toolbar");
    const { onAddClick, onApplyFilter } = props;
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const visible = { ...useSelector((state) => state.user.toolbarVisible) };
    const columnVisibility = { ...useSelector((state) => state.user.columnVisibility) };

    const columnModel = [{
        field: "email", value: true, label: t("Email"), type: EFilterType.text
    },
    {
        field: "fullName", value: true, label: t("Họ tên"), type: EFilterType.text
    },
    {
        field: "teamName", value: true, label: t("Nhóm"), type: EFilterType.text
    },
    {
        field: "status", value: true, label: t("Trạng thái"), type: EFilterType.select
    },
    {
        field: "createdDate", value: true, label: t("Ngày tạo"), type: EFilterType.datetime
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
        dispatch(change_title(t("Thêm mới người dùng")));
        dispatch(open());
    };

    return <div>
        <ToolBar dropdownItem={a} visible={visible}
            onApplyFilter={onApplyFilter}
            onColumnConfigChange={handleColumnConfigChange} columnModel={columnModel}
            onAddClick={handleClickOpen} />
        <UserPopup />
    </div>

}
UserToolbar.propTypes = {
    onAddClick: PropTypes.func,
}
export default UserToolbar;