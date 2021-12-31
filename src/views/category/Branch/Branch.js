import React, { useEffect, useState } from 'react';
import ToolBar from '../../../components/toolbar/ToolBar';
import { DataGrid } from '@mui/x-data-grid';
import Table from '../../../components/table/Table';
import BranchDataGrid from './BranchDataGrid'
export default function Branch() {

    console.log("render BRANCH");
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <ToolBar onAddClick={handleClickOpen} />
            <BranchDataGrid />
        </div>
    );

}