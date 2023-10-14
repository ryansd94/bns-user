import React, {
  useMemo,
  useCallback,
  useState,
  useEffect,
  useRef,
} from "react"
import PropTypes from "prop-types"
import { AgGridReact } from "@ag-grid-community/react"
import "@ag-grid-community/core/dist/styles/ag-grid.css"
import "@ag-grid-community/core/dist/styles/ag-theme-alpine.css"
import { ModuleRegistry } from "@ag-grid-community/core"
import { useDispatch, useSelector } from "react-redux"
import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model"
import {
  setToolbarVisibility,
  setReloadNull,
  setDeleteData,
} from "stores/views/master"
import { Pagination } from "components/pagination"
import { Loading } from "components/loading"
import { get } from "services"
import eventEmitter from "helpers/eventEmitter"
import { deepFind, getAllItemsWithId } from "helpers"
import _ from "lodash"
import "./styles.scss"
import axios from "axios"
import EmptyRow from "./emptyRow"

// Register the required feature modules with the Grid
ModuleRegistry.registerModules([ClientSideRowModelModule])

const GridData = (props) => {
  console.log("render GridData")
  const gridRef = useRef()
  const dispatch = useDispatch()
  const {
    columns = [],
    rowHeight,
    columnVisibility,
    filterModels,
    url,
    onRowClicked,
    frameworkComponents,
    autoGroupColumnDef,
    defaultFilters = [],
    isGetDataFromServer = true,
    id,
    onSelectedRow = null,
    localData = [],
    customParams = {},
    customFilterData,
  } = props
  const [columnsDef, setColumnsDef] = useState([...columns])
  const gridStyle = useMemo(
    () => ({
      width: "100%",
      display: "flex",
      flexDirection: "column",
      flexGrow: 1,
    }),
    [],
  )
  const [currentPage, setCurrentPage] = useState(null)
  const getSortDefault = () => {
    const sorts = _.map(
      _.filter(columns, (x) => !_.isNil(x.sort)),
      (y) => {
        return { field: y.field, sort: y.sort }
      },
    )
    return sorts
  }
  const [sortModel, setSortModel] = useState(getSortDefault())
  const toolbarVisible = {
    ...useSelector((state) => state.master.toolbarVisible),
  }
  const isReload = useSelector((state) => state.master.isReload)
  const [data, setData] = useState(null)
  const [selectedIds, setSelectedIds] = useState([])
  const [pageSize, setPageSize] = useState(10)
  const loading = useSelector((state) => state.master.loading)
  const cancelToken = useRef(null)

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
    loadingOverlayComponent: isGetDataFromServer ? Loading : null,
    noRowsOverlayComponent: EmptyRow,
  }

  useEffect(() => {
    if (gridRef && gridRef.current.api) {
      if (loading) {
        gridRef.current.api.showLoadingOverlay()
      } else gridRef.current.api.hideOverlay()
    }
  }, [loading])

  const onFirstDataRendered = () => {
    if (gridRef && gridRef.current.api) {
      if (loading) {
        gridRef.current.api.showLoadingOverlay()
      } else gridRef.current.api.hideOverlay()

      const allColumnIds = []
      gridRef.current.columnApi.getAllColumns().forEach((column) => {
        if (column.colDef.suppressAutoSize) allColumnIds.push(column.getId())
      })
      gridRef.current.columnApi.autoSizeColumns(allColumnIds, false)
    }
  }

  useEffect(() => {
    columnsDef.map((item) => {
      if (item.field) {
        gridRef.current.columnApi &&
          gridRef.current.columnApi.setColumnVisible(
            item.field,
            columnVisibility[item.field],
          )
      }
    })
  }, [columnVisibility])

  useEffect(() => {
    _.each(columns, (item) => (item.comparator = customComparator))
    setColumnsDef([...columns])
  }, [columns])

  // useEffect(() => {
  //     const sorts = _.map(_.filter(columns, (x) => !_.isNil(x.sort)), (y) => {
  //         return { field: y.field, sort: y.sort }
  //     })
  //     if (!_.isNil(sorts) && !_.isEmpty(sorts)) {
  //         setSortModel(sorts)
  //     }
  // }, [])

  const onPageChange = (param) => {
    setCurrentPage(param - 1)
  }

  function customComparator(data1, data2) {
    return 0 //means no comparing and no sorting
  }

  const onSelectionChanged = (newSelection) => {
    let selectedNodes = newSelection.api.getSelectedNodes()
    let selectedData = selectedNodes.map((node) => node.data)
    const selectedIds = _.map(selectedData, (x) => {
      return x.id
    })
    setSelectedIds(selectedIds)
    if (!_.isNil(onSelectedRow)) {
      onSelectedRow(selectedData)
    } else {
      let isEnableButtonFunction = false
      if (selectedData.length > 0) {
        isEnableButtonFunction = true
      }

      eventEmitter.emit("onChangeVisibleToolbar", {
        isEnableButtonFunction: isEnableButtonFunction,
        id,
        selectedIds,
      })
    }
  }

  const fetchData = async () => {
    if (gridRef && gridRef.current.api) {
      gridRef.current.api.showLoadingOverlay()
    }
    const params = new URLSearchParams(window.location.search)
    const filterParams = params.get("filters") || filterModels
    cancelToken.current = new axios.CancelToken.source()

    let sortField = ""
    let sortType = ""
    if (!_.isNil(sortModel) && !_.isEmpty(sortModel)) {
      sortField = sortModel[0].field
      sortType = sortModel[0].sort
    }

    return await get(
      url,
      {
        start: currentPage
          ? currentPage * (_.isNil(pageSize) ? 10 : pageSize)
          : 0,
        length: _.isNil(pageSize) ? 10 : pageSize,
        fieldSort: sortField,
        sort: sortType,
        filters: filterParams,
        defaultFilters: !_.isEmpty(defaultFilters)
          ? JSON.stringify(defaultFilters)
          : null,
        ...customParams,
      },
      cancelToken,
    ).then((data) => {
      if (gridRef && gridRef.current && gridRef.current.api) {
        gridRef.current.api.hideOverlay()
      }
      if (!_.isNil(customFilterData)) {
        return customFilterData(data)
      }
      return data
    })
  }

  const onPageLengthChange = ({ value }) => {
    setPageSize(_.parseInt(_.isNil(value) ? 1000 : value))
  }

  const getLevelItem = (currentData, item, level) => {
    if (_.isNil(item.parentId)) {
      return level + 1
    } else {
      const parent = deepFind(
        currentData,
        function (obj) {
          return _.isEqual(obj.id, item.parentId)
        },
        "childs",
      )
      if (!_.isNil(parent)) {
        if (!_.isNil(parent.parentId)) {
          level = getLevelItem(currentData, parent, level + 1)
        } else {
          return level + 1
        }
      } else {
        return level + 1
      }
    }
    return level
  }

  const getAllChildsExpand = ({ childs, level, returnData = [] }) => {
    _.each(childs, (child) => {
      child.level = level
      returnData.push(child)
      if (child.isExpand === true) {
        getAllChildsExpand({
          childs: child.childs,
          level: level + 1,
          returnData,
        })
      }
    })
  }

  const onExpandCollapseGroupRow = ({ id, isExpand = true }) => {
    if (!_.isNil(gridOptions) && !_.isNil(gridOptions.api)) {
      let currentData = []
      gridOptions.api.forEachNode((node) => currentData.push(node.data))
      let index = _.findIndex(currentData, (x) => x.id === id)
      if (index !== -1) {
        if (isExpand === true) {
          let childs = currentData[index].childs
          if (!_.isNil(childs) && !_.isEmpty(childs)) {
            let level = getLevelItem(
              currentData,
              currentData[index],
              currentData[index].level || 0,
            )
            let allChilds = []
            getAllChildsExpand({ childs, level, returnData: allChilds })
            currentData.splice(index + 1, 0, ...allChilds)
            if (!_.isNil(gridOptions)) {
              gridOptions.api.setRowData(currentData)
            }
          }
        } else {
          const lstChildsItem = getAllItemsWithId(
            currentData[index].childs,
            id,
          )
          const ids = _.map(lstChildsItem, (item) => {
            return item.id
          })
          currentData = _.filter(currentData, (x) => !_.includes(ids, x.id))
          if (!_.isNil(gridOptions)) {
            gridOptions.api.setRowData(currentData)
          }
        }
        currentData[index].isExpand = isExpand
      }
    }
  }

  useEffect(async () => {
    dispatch(setReloadNull())
    eventEmitter.on("onExpandCollapseGroupRow", onExpandCollapseGroupRow)
    return () => {
      eventEmitter.off("onExpandCollapseGroupRow")
      if (cancelToken?.current) {
        cancelToken.current.cancel()
      }
    }
  }, [])

  useEffect(async () => {
    if (
      sortModel != null ||
      filterModels != null ||
      isReload != null ||
      currentPage != null ||
      !_.isNil(pageSize)
    ) {
      if (isGetDataFromServer) {
        const data = await fetchData()
        setData(data)
        if (!_.isNil(gridRef)) {
          //reload grid
          // gridRef.current.api.applyTransaction({ update: data && data.data && data.data.items })
        }
        return () => {
          if (cancelToken.current) {
            cancelToken.current.cancel(
              "Component unmounted or dependencies changed",
            )
          }
        }
      } else {
        if (gridRef && gridRef.current && gridRef.current.api) {
          gridRef.current.api.hideOverlay()
        }
      }
    }
  }, [sortModel, filterModels, isReload, currentPage, pageSize])

  useEffect(() => {
    if (!isGetDataFromServer) {
      setData({
        data: { items: [...localData] || [] },
        recordsTotal: localData?.length || 0,
      })
    }
  }, [localData])

  const getRowData = () => {
    //get data from server
    if (isGetDataFromServer) {
      return data && data.data && data.data.items
    }
    //get data from client
    const start = currentPage
      ? currentPage * (_.isNil(pageSize) ? 10 : pageSize)
      : 0
    const length = _.isNil(pageSize) ? 10 : pageSize
    const items = (data && data.data && data.data.items) || []
    return _.take(_.drop(items, start), length)
  }

  const getTotalCount = () => {
    //get total row count from server
    if (isGetDataFromServer) {
      return data && data.recordsTotal
    }
    //get total row count from client
    const items = (data && data.data && data.data.items) || []
    return items.length
  }

  const onModelUpdated = (event) => {
    if (!_.isEmpty(localData) && gridRef && gridRef.current.api) {
      const currentData = []
      gridRef.current.api.forEachNode((node) => {
        currentData.push(node.data)
        if (_.includes(selectedIds, node.data?.id)) {
          node.setSelected(true)
        }
      })

      if (!_.isEmpty(currentData) && !_.isEmpty(selectedIds)) {
        const currentDataIds = _.map(currentData, (x) => {
          return x.id
        })
        const currentSelectedIds = _.intersectionBy(
          currentDataIds,
          selectedIds,
        )
        setSelectedIds(currentSelectedIds)
      }
    } else {
      setSelectedIds([])
    }
  }

  const onGridReady = (event) => {
    console.log(event)
  }

  return (
    <div style={{ width: "100%" }} className="grid-wrapper">
      <div style={gridStyle} className="ag-theme-alpine">
        <AgGridReact
          rowHeight={rowHeight && rowHeight}
          ref={gridRef}
          animateRows={true}
          style={{ display: "flex" }}
          defaultColDef={defaultColDef}
          enableRangeSelection={true}
          rowData={getRowData()}
          // domLayout='autoHeight'
          gridOptions={gridOptions}
          columnDefs={columnsDef}
          rowSelection="multiple"
          onGridReady={onGridReady}
          onModelUpdated={onModelUpdated}
          onRowClicked={onRowClicked}
          onFirstDataRendered={onFirstDataRendered}
          autoGroupColumnDef={autoGroupColumnDef}
          enableCellTextSelection={true}
          // overlayLoadingTemplate={'<span class="ag-overlay-loading-center">Please wait while your rows are loading</span>'}
          // overlayNoRowsTemplate={
          //     '<span style="padding: 10px border: 2px solid #444 background: lightgoldenrodyellow">This is a custom \'no rows\' overlay</span>'
          // }
          onSortChanged={onSortChanged}
          suppressRowClickSelection={true}
          suppressCellFocus={true}
          frameworkComponents={frameworkComponents}
          suppressAggFuncInHeader={true}
          onSelectionChanged={onSelectionChanged}
        ></AgGridReact>
        <Pagination
          style={{ width: "100%" }}
          currentPage={currentPage ? currentPage + 1 : 1}
          onPageChange={onPageChange}
          onPageLengthChange={onPageLengthChange}
          pageSize={pageSize}
          totalCount={getTotalCount()}
          className="pagination-bar"
        />
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
