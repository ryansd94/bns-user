import React, { useEffect, useState, useRef, useCallback } from "react"
import GridData from "components/table/GridData"

import ButtonIcon from "components/button/ButtonIcon"
import { useTranslation } from "react-i18next"
import { deleteUser, get } from "services"
import { useSelector, useDispatch } from "react-redux"
import AlertDialog from "components/popup/AlertDialog"
import { openMessage } from "stores/components/snackbar"
import { ERROR_CODE, EAlertPopupType, baseUrl } from "configs"
import {
    setLoading,
    setReload,
    setPage,
} from "stores/views/master"
import { open as openAlert } from "stores/components/alert-dialog"
import { loading as loadingButton } from "stores/components/button"
import { formatDate } from "helpers/commonFunction"
import {
    setToolbarVisibility,
} from "stores/views/template"
import { LinkControl } from 'components/link'


const TemplateGrid = React.memo((props) => {
    console.log("render TemplateGrid")
    const { filterModels } = props
    const dispatch = useDispatch()
    const { t } = useTranslation()
    const columnVisibility = { ...useSelector((state) => state.template.columnVisibility) }
    const toolbarVisible = { ...useSelector((state) => state.template.toolbarVisible) }
    const [alertType, setAlertType] = useState(0)
    const [id, setId] = useState(null)
    const [status, setStatus] = useState(null)

    const [data, setData] = React.useState({})
    const page = useSelector((state) => state.master.page)
    const pageSize = useSelector((state) => state.master.pageSize)
    const loading = useSelector((state) => state.master.loading)
    const sortModel = useSelector((state) => state.master.sortModel)
    const filterModel = useSelector((state) => state.template.filters)

    const gridRef = useRef()
    const isReload = useSelector((state) => state.master.isReload)
    useEffect(() => {
        fetchData()
    }, [page, sortModel, isReload, filterModels])



    const fetchData = async () => {
        dispatch(setLoading(true))
        await get(baseUrl.jm_template, {
            draw: page,
            start: page == 0 ? 0 : page * pageSize,
            length: pageSize,
            fieldSort:
                sortModel != null && sortModel.length > 0 ? sortModel[0].field : "",
            sort: sortModel != null && sortModel.length > 0 ? sortModel[0].sort : "",
            filters: JSON.stringify(filterModels)
        }).then((data) => {
            dispatch(setLoading(false))
            setData(data)
        })
    }
    const onAcceptDelete = async () => {
        dispatch(loadingButton(true))
        var res = null
        if (alertType == 1)
            res = await deleteUser(id)

        if (res.errorCode == ERROR_CODE.success) {
            dispatch(setReload())
        }
        dispatch(openMessage({ ...res }))
        dispatch(openAlert({ open: false }))
        dispatch(loadingButton(false))
    }

    const onSelectionChange = (newSelection) => {
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


    const [column3, setColumn] = useState([
        {
            checkboxSelection: true,
            resizable: false, width: 40, headerCheckboxSelection: true, pinned: 'left'
        },
        {
            field: "name",
            headerName: t("Tên mẫu"),
            pinned: 'left',
            flex: 1,
            cellRenderer: (params) => {
                return <LinkControl
                    title={params.data.name} >
                </LinkControl >
            },
        },
        {
            field: "description", headerName: t("Mô tả"),
            flex: 1
        },
        {
            field: "createdDate",
            autoSizeColumn: true,
            headerName: t("Ngày tạo"),
            cellRenderer: (params) => {
                return formatDate(params.data.createdDate)
            },
        },
        {
            field: "edit",
            headerName: "",
            autoSizeColumn: true,
            resizable: false,
            cellRenderer: (params) => {
                const onDeleteClick = (e) => {
                    setAlertType(EAlertPopupType.DELETE)
                    setId(params.data.id)
                    dispatch(openAlert({ open: true }))
                }

                const _status = params.data.status
                const _isMainAccount = params.data.isMainAccount

                const deleteElement = (
                    <ButtonIcon
                        disabled={_isMainAccount}
                        onClick={onDeleteClick}
                        type="Delete"
                    ></ButtonIcon>
                )

                return React.createElement(
                    "div",
                    {},
                    deleteElement,
                )
            },
            sortable: false,
        },
    ])

    useEffect(() => {
        column3.map((item) => {
            if (item.field) {
                gridRef.current.columnApi && gridRef.current.columnApi.setColumnVisible(item.field, columnVisibility[item.field])
            }
        })
        setColumn(column3)
    }, [columnVisibility])

    const onPageChange = (param) => {
        dispatch(setPage(param - 1))
    }
    return (
        <div style={{ width: "100%" }}>
            <AlertDialog onSubmit={onAcceptDelete} />
            <GridData
                gridRef={gridRef}
                loading={loading}
                filters={filterModel}
                columns={column3}
                onSelectionChanged={onSelectionChange}
                onPageChange={onPageChange}
                currentPage={page}
                pageSize={pageSize}
                totalCount={data && data.recordsTotal}
                rows={data && data.data && data.data.items}></GridData>
        </div>
    )
})

export default TemplateGrid
