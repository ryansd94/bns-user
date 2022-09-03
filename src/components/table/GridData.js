
import React, { useMemo, useCallback, useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { AgGridReact } from '@ag-grid-community/react'
import '@ag-grid-community/core/dist/styles/ag-grid.css'
import '@ag-grid-community/core/dist/styles/ag-theme-alpine.css'
import { ModuleRegistry } from '@ag-grid-community/core'
import { useDispatch, useSelector } from "react-redux"
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model'
import {
    setSort,
    setPage,
    setToolbarVisibility
} from "stores/views/master"
import { Pagination } from 'components/pagination'
import { Loading } from 'components/loading'

// Register the required feature modules with the Grid
ModuleRegistry.registerModules([ClientSideRowModelModule])

const GridData = (props) => {
    const gridRef = useRef()
    const dispatch = useDispatch()
    const { rows = [], loading, columns,
        totalCount, rowHeight,
        columnVisibility } = props
    const gridStyle = useMemo(() => ({ width: '100%', display: "flex", flexDirection: "column" }), [])
    const currentPage = useSelector((state) => state.master.page)
    const pageSize = useSelector((state) => state.master.pageSize)
    const toolbarVisible = { ...useSelector((state) => state.master.toolbarVisible) }

    const defaultColDef = useMemo(() => {
        return {
            resizable: true,
            sortable: true,
        }
    }, [])

    const onSortChanged = (a, b) => {
        const columnState = a.columnApi.getColumnState()
        let sortModel = []
        columnState.map((item) => {
            if (item.sort) {
                sortModel = [{ field: item.colId, sort: item.sort }]
                return
            }
        })
        dispatch(setSort(sortModel))
    }

    const gridOptions = {
        loadingOverlayComponent: Loading,
        loadingOverlayComponentParams: {
            loadingMessage: 'One moment please...',
        },
    }

    useEffect(() => {
        if (gridRef && gridRef.current.api) {
            if (loading)
                gridRef.current.api.showLoadingOverlay()
            else
                gridRef.current.api.hideOverlay()
        }
    }, [loading])

    const onFirstDataRendered = () => {
        if (gridRef && gridRef.current.api) {

            if (loading)
                gridRef.current.api.showLoadingOverlay()
            else
                gridRef.current.api.hideOverlay()

            const allColumnIds = []
            gridRef.current.columnApi.getAllColumns().forEach((column) => {
                if (column.colDef.autoSizeColumn)
                    allColumnIds.push(column.getId())
            })
            gridRef.current.columnApi.autoSizeColumns(allColumnIds, false)
        }
    }

    useEffect(() => {
        columns.map((item) => {
            if (item.field) {
                gridRef.current.columnApi && gridRef.current.columnApi.setColumnVisible(item.field, columnVisibility[item.field])
            }
        })
    }, [columnVisibility])

    const onPageChange = (param) => {
        dispatch(setPage(param - 1))
    }

    const onSelectionChanged = (newSelection) => {
        let selectedNodes = newSelection.api.getSelectedNodes()
        let selectedData = selectedNodes.map(node => node.data)
        if (selectedData.length > 0) {
            toolbarVisible.function = true
        }
        else {
            toolbarVisible.function = false
        }
        dispatch(setToolbarVisibility({ ...toolbarVisible }))
    }

    const onGridReady = () => {
        if (gridRef && gridRef.current.api) {
            if (loading)
                gridRef.current.api.showLoadingOverlay()
            else
                gridRef.current.api.hideOverlay()
        }
    }

    return (
        <div style={{ width: "100%" }} className="grid-wrapper">
            <div style={gridStyle} className="ag-theme-alpine">
                <AgGridReact
                    rowHeight={rowHeight && rowHeight}
                    ref={gridRef}
                    animateRows={true}
                    sort
                    style={{ height: "auto" }}
                    defaultColDef={defaultColDef}
                    enableRangeSelection={true}
                    rowData={rows}
                    domLayout='autoHeight'
                    gridOptions={gridOptions}
                    columnDefs={columns}
                    rowSelection='multiple'
                    onFirstDataRendered={onFirstDataRendered}
                    enableCellTextSelection={true}
                    onGridReady={onGridReady}
                    //overlayLoadingTemplate={'<span class="ag-overlay-loading-center">Please wait while your rows are loading</span>'}
                    onSortChanged={onSortChanged}
                    suppressRowClickSelection={true}
                    suppressCellFocus={true}
                    onSelectionChanged={onSelectionChanged}>
                </AgGridReact>
                <Pagination style={{ width: "100%" }}
                    currentPage={currentPage + 1}
                    onPageChange={onPageChange}
                    pageSize={pageSize} totalCount={totalCount} className="pagination-bar" />
            </div>
        </div>
    )


}


GridData.propTypes = {
    rows: PropTypes.array.isRequired,
    columns: PropTypes.array,
    gridOptions: PropTypes.object,
    onSelectionChanged: PropTypes.func,
    onPageChange: PropTypes.func,
    currentPage: PropTypes.number,
    totalCount: PropTypes.number,
    pageSize: PropTypes.number,
}
GridData.defaultProps = {
    rows: [],
    columns: [],
    pageSize: 10,
    totalCount: 0,
    currentPage: 1
}

export default GridData