import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
const Table = React.memo((props) => {
    const { rows, columns, rowsCount, onPageChange, loading, onSortModelChange, sortModel, onCellClick } = props;
    const currentlySelected = (params) => {
        const value = params.colDef.field;

        if (!(value === "edit" || value === "delete")) {
            return;
        }
        return params;
    }
    const { t } = useTranslation();
    return (
        // <div className="card" style={{ width: '100%'  }}>
        //     <div className="card-body">
                <DataGrid
                    
                    autoHeight={true}
                    autoPageSize={false}
                    rows={rows}
                    disableColumnResize={true}
                    rowCount={rowsCount}
                    disableSelectionOnClick={true}
                    columns={columns}
                    pageSize={10}
                    localeText={{
                        columnMenuSortAsc: t('Tăng dần'),
                        columnMenuSortDesc: t('Giảm dần'),
                        columnMenuFilter: t('Tìm kiếm'),
                        columnMenuHideColumn: t('Ẩn cột'),
                        columnMenuShowColumns: t('Hiển thị cột'),
                        columnsPanelHideAllButton: t('Ẩn tất cả'),
                        columnsPanelShowAllButton: t('Hiện tất cả'),
                        columnsPanelTextFieldPlaceholder: t('Nhập tên cột cần tìm'),
                        columnsPanelTextFieldLabel: t('Tìm kiếm cột'),
                        noRowsLabel: 'Không có dữ liệu',
                        columnMenuUnsort: 'Không sắp xếp',
                        footerRowSelected: (count) => `${count.toLocaleString()} ` + t('dòng được chọn'),
                    }}

                    // onCellClick={param => onCellClick(currentlySelected(param))}
                    sortModel={sortModel}
                    sortingMode="server"
                    paginationMode="server"
                    rowsPerPageOptions={[10]}
                    onPageChange={onPageChange}
                    onSortModelChange={onSortModelChange}
                    checkboxSelection
                    loading={loading}
                /> 
        //         </div>
        // </div>
    );
});

Table.propTypes = {
    rows: PropTypes.array.isRequired,
    columns: PropTypes.array,
    rowsCount: PropTypes.number,
    onPageChange: PropTypes.func,
    onCellClick: PropTypes.func,
    onSortModelChange: PropTypes.func,
    loading: PropTypes.bool,
    sortModel: PropTypes.array,
}

Table.defaultProps = {
    rows: []
};

export default Table;







