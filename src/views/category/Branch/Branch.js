import React, { useEffect, useState } from 'react';
import ToolBar from 'components/toolbar/ToolBar';
import { DataGrid } from '@mui/x-data-grid';
import Table from 'components/table/Table';
import BranchDataGrid from './BranchDataGrid'
import { VisibleDefault } from 'configs/constants';
export default function Branch() {

    const [open, setOpen] = useState(false);
    const visible = VisibleDefault;
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <ToolBar visible={visible} onAddClick={handleClickOpen} />
            <BranchDataGrid />
        </div>
    );

}