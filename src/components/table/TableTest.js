import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import PropTypes from 'prop-types';



const TableTest = React.memo(({ rows, columns, rowsCount, onPageChange, loading }) => {
    return (
        <div className="card" style={{ width: '100%' }}>
            <div className="card-body">
                <DataGrid
                    autoHeight={true}
                    autoPageSize={true}
                    rows={rows}
                    rowCount={rowsCount ? rowsCount:0}
                    columns={columns}
                    pageSize={10}
                    sortingMode="server"
                    paginationMode="server"
                    rowsPerPageOptions={[10]}
                    onPageChange={onPageChange}
                    checkboxSelection
                    loading={loading}
                /> </div>
        </div>
    );
});

export default TableTest;







