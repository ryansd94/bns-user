
import React, { useMemo, useCallback, useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { AgGridReact } from '@ag-grid-community/react'
import '@ag-grid-community/core/dist/styles/ag-grid.css'
import '@ag-grid-community/core/dist/styles/ag-theme-alpine.css'
import { ModuleRegistry } from '@ag-grid-community/core'
import { useDispatch, useSelector } from "react-redux"
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model'
import {
    setToolbarVisibility,
    setReloadNull
} from "stores/views/master"
import { Pagination } from 'components/pagination'
import { Loading } from 'components/loading'
import { get } from "services"

// Register the required feature modules with the Grid
ModuleRegistry.registerModules([ClientSideRowModelModule])

const GridData = (props) => {
    const gridRef = useRef()
    const dispatch = useDispatch()
    const { columns = [], rowHeight,
        columnVisibility, filterModels, url, onRowClicked } = props
    const [columnsDef, setColumnsDef] = useState([...columns]);
    const gridStyle = useMemo(() => ({ width: '100%', display: "flex", flexDirection: "column" }), [])
    const [currentPage, setCurrentPage] = useState(null)
    const [pageSize, setPageSize] = useState(10)
    const [sortModel, setSortModel] = useState(null)
    const toolbarVisible = { ...useSelector((state) => state.master.toolbarVisible) }
    const isReload = useSelector((state) => state.master.isReload)
    const [data, setData] = useState(null)
    const loading = useSelector((state) => state.master.loading)

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
        setSortModel(sortModel)
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
                if (column.colDef.suppressAutoSize)
                    allColumnIds.push(column.getId())
            })
            gridRef.current.columnApi.autoSizeColumns(allColumnIds, false)
        }
    }

    useEffect(() => {
        columnsDef.map((item) => {
            if (item.field) {
                gridRef.current.columnApi && gridRef.current.columnApi.setColumnVisible(item.field, columnVisibility[item.field])
            }
        })
    }, [columnVisibility])

    useEffect(() => {
        setColumnsDef([...columns])
    }, [columns])

    const onPageChange = (param) => {
        setCurrentPage(param - 1)
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

    const fetchData = useCallback(async () => {
        if (gridRef && gridRef.current.api) {
            gridRef.current.api.showLoadingOverlay()
        }
        const params = new URLSearchParams(window.location.search)
        const filterParams = params.get("filters")
        return await get(url, {
            draw: currentPage || 0,
            start: currentPage ? currentPage * 10 : 0,
            length: pageSize,
            fieldSort:
                sortModel != null && sortModel.length > 0 ? sortModel[0].field : "",
            sort: sortModel != null && sortModel.length > 0 ? sortModel[0].sort : "",
            filters: filterParams

        }).then((data) => {
            if (gridRef && gridRef.current.api) {
                gridRef.current.api.hideOverlay()
            }
            return data
        })
    }, [currentPage, sortModel, isReload])

    const onGridReady = useCallback(async (params) => {
        const value = await fetchData()
        setData(value)
    }, [])

    useEffect(async () => {
        if (currentPage != null) {
            setData(await fetchData())
        }
    }, [currentPage])

    useEffect(async () => {
        dispatch(setReloadNull())
    }, [])

    useEffect(async () => {
        if (sortModel != null || filterModels != null || isReload != null) {
            setData(await fetchData())
        }
    }, [sortModel, filterModels, isReload])

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
                    rowData={data && data.data && data.data.items}
                    domLayout='autoHeight'
                    gridOptions={gridOptions}
                    columnDefs={columnsDef}
                    rowSelection='multiple'
                    onGridReady={onGridReady}
                    onRowClicked={onRowClicked}
                    onFirstDataRendered={onFirstDataRendered}
                    enableCellTextSelection={true}
                    // overlayLoadingTemplate={'<span class="ag-overlay-loading-center">Please wait while your rows are loading</span>'}
                    // overlayNoRowsTemplate={
                    //     '<span style="padding: 10px; border: 2px solid #444; background: lightgoldenrodyellow">This is a custom \'no rows\' overlay</span>'
                    // }
                    onSortChanged={onSortChanged}
                    suppressRowClickSelection={true}
                    suppressCellFocus={true}
                    onSelectionChanged={onSelectionChanged}>
                </AgGridReact>
                <Pagination style={{ width: "100%" }}
                    currentPage={currentPage ? currentPage + 1 : 1}
                    onPageChange={onPageChange}
                    pageSize={pageSize} totalCount={data && data.recordsTotal} className="pagination-bar" />
            </div>
        </div>
    )


}

GridData.propTypes = {
    columns: PropTypes.array,
    gridOptions: PropTypes.object,
    onSelectionChanged: PropTypes.func,
    onPageChange: PropTypes.func,
}
GridData.defaultProps = {
    columns: [],
}

export default GridData