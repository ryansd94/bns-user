import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import Switch from '@mui/material/Switch';
const Table = React.memo((props) => {
  const {
    rows,
    columns,
    rowsCount,
    onPageChange,
    loading,
    onSortModelChange,
    sortModel,
    onCellClick,
    columnVisibility,
    onSelectionModelChange
  } = props;
  const currentlySelected = (params) => {
    const value = params.colDef.field;

    if (!(value === "edit" || value === "delete")) {
      return;
    }
    return params;
  };
  const label = { inputProps: { 'aria-label': 'Switch demo' } };
  function SwitchCUstom() {
    return (<Switch {...label} defaultChecked color="warning" />)
  }
  const { t } = useTranslation();
  return (
    <div style={{ width: "100%" }}>
      <DataGrid
        autoHeight={true}
        autoPageSize={false}
        rows={rows}
        disableColumnResize
        rowCount={rowsCount ? rowsCount : 0}
        disableSelectionOnClick={true}
        columns={columns}
        pageSize={10}
        localeText={{
          columnMenuSortAsc: t("Tăng dần"),
          columnMenuSortDesc: t("Giảm dần"),
          columnMenuFilter: t("Tìm kiếm"),
          columnMenuHideColumn: t("Ẩn cột"),
          columnMenuShowColumns: t("Hiển thị cột"),
          columnsPanelHideAllButton: t("Ẩn tất cả"),
          columnsPanelShowAllButton: t("Hiện tất cả"),
          columnsPanelTextFieldPlaceholder: t("Nhập tên cột cần tìm"),
          columnsPanelTextFieldLabel: t("Tìm kiếm cột"),
          noRowsLabel: "Không có dữ liệu",
          columnMenuUnsort: "Không sắp xếp",
          footerRowSelected: (count) =>
            `${count.toLocaleString()} ` + t("dòng được chọn"),
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
        disableColumnSelector
        columnVisibilityModel={columnVisibility}
        onSelectionModelChange={onSelectionModelChange}
        // componentsProps={{
        //   panel: {
        //     sx: {
        //       '& .MuiTypography-root': {
        //         color: 'dodgerblue',
        //         fontSize: 20,
        //       },
        //       '& .MuiDataGrid-filterForm': {
        //         bgcolor: 'lightblue',
        //       },
        //     },
        //   },
        // }}
        // components={{
        //   ColumnMenu: SwitchCUstom,
        // }}
      />
    </div>
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
  columnVisibility: PropTypes.object,
  onSelectionModelChange: PropTypes.func,
};

Table.defaultProps = {
  rows: [],
};

export default Table;
