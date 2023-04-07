import React, { useEffect, useState, useMemo } from "react"
import ButtonIcon from "components/button/ButtonIcon"
import { useTranslation } from "react-i18next"
import { useSelector, useDispatch } from "react-redux"
import ConfirmDeleteDialog from "components/popup/confirmDeleteDialog"
import { baseUrl, EButtonIconType } from "configs"
import { open, change_title } from "components/popup/popupSlice"
import { open as openAlert } from "stores/components/alert-dialog"
import GridData from "components/table/GridData"
import StatusItem from 'views/category/status/statusItem'
import { cellFormatDate, cellFormatDateTime } from "helpers/commonFunction"
import { UserItem } from 'components/user'
import { LinkControl } from 'components/link'
import { CellMuliValue } from 'components/table'
import _ from 'lodash'
import LabelIconControl from 'components/label/labelIconControl'
import { DropDownItem } from 'components/dropdown'
import { EButtonType } from 'configs/constants'
import TaskChildPopup from './taskChildPopup'
import { ActionButton } from 'components/cellRender'
import { CellButton } from 'components/cellRender'

const TaskGrid = React.memo((props) => {
    console.log("render TaskGrid")
    const { filterModels, onRowClicked, customColumns } = props
    const dispatch = useDispatch()
    const { t } = useTranslation()
    const columnVisibility = { ...useSelector((state) => state.task.columnVisibility) }
    const [id, setId] = useState(null)
    const [taskTypeId, setTaskTypeId] = useState(null)
    const [columns, setColumn] = useState([
        {
            checkboxSelection: true,
            resizable: false,
            width: 30,
            pinned: 'left',
            headerCheckboxSelection: true
        },
        {
            field: "title",
            headerName: t("Tiêu đề"),
            width: 400,
            pinned: 'left',
            cellRenderer: (params) => {
                const titleTask = <LabelIconControl id={params.data.id} name={params.data.title} color={params.data.taskType.color} icon={params.data.taskType.icon} />
                const href = `/task/edit/${params.data.id}`
                return <div className="select-item">
                    <LinkControl href={href} title={titleTask}></LinkControl>
                </div>
            }
        },
        {
            field: "status.name", headerName: t("Trạng thái"),
            suppressAutoSize: true,
            cellRenderer: (params) => {
                return <StatusItem status={params.data.status} />
            }
        },
        {
            field: "estimatedhour", headerName: t("Thời gian ước tính"),
            suppressAutoSize: true,
        },
        {
            field: "taskType.name", headerName: t("Loại công việc"),
            suppressAutoSize: true,
        },
        {
            field: "tags", headerName: t("Nhãn"),
            width: 200,
            cellRenderer: (params) => {
                return <CellMuliValue values={params.value} />
            }
        },
        {
            field: "startDate",
            headerName: t("Ngày bắt đầu"),
            suppressAutoSize: true,
            valueFormatter: cellFormatDate
        },
        {
            field: "dueDate",
            headerName: t("Ngày hết hạn"),
            suppressAutoSize: true,
            valueFormatter: cellFormatDate
        },
        {
            field: "createdDate",
            headerName: t("Ngày tạo"),
            suppressAutoSize: true,
            valueFormatter: cellFormatDateTime
        },
        {
            field: "createdUser.fullName",
            headerName: t("Người tạo"),
            suppressAutoSize: true,
            cellRenderer: (params) => {
                return <UserItem {...params.data.createdUser} />
            }
        },
        {
            field: "edit",
            width: 110,
            resizable: false,
            cellRenderer: (params) => {
                const onDeleteClick = (e) => {
                    e.stopPropagation() // don't select this row after clicking
                    dispatch(openAlert({ open: true }))
                    setId(params.data.id)
                }
                
                return <strong>
                    <CellButton isEditShow={false} onDeleteClick={onDeleteClick} />
                </strong>
            },
            sortable: false,
        },
        {
            headerName: 'Action Buttons',
            pinned: 'right',
            width: 60,
            cellClass: 'grid-action',
            cellRenderer: 'ActionBtnRenderer',
        },
    ])

    const addChildTask = (data) => {
        setId(data.id)
        setTaskTypeId(data.taskTypeId)
        dispatch(change_title(t("Thêm công việc")))
        dispatch(open())
        // window.open(`/task/create/${data.taskTypeId}?parentId=${data.id}`)
    }

    const genderDropdownItem = (data) => {
        return <DropDownItem onClick={() => addChildTask(data)} title={t('Tạo công việc con')} />
    }

    const ActionBtnRenderer = (params) => {
        return <ActionButton isTextAndIcon={false} type={EButtonType.more} isShowEndIcon={false} visible={true} genderDropdownItem={() => genderDropdownItem(params.data)} />
    }

    const autoGroupColumnDef = useMemo(() => {
        return {
            headerName: 'Title',
            field: 'title',
            minWidth: 250,
            cellRenderer: 'agGroupCellRenderer',
            cellRendererParams: {
                checkbox: true,
            },
        };
    }, []);

    useEffect(() => {
        var newColumns = []
        customColumns && customColumns.map((item) => {
            newColumns.push({
                field: `taskCustomColumnValues.${item.id}`,
                headerName: item.name,
                width: 110,
                sortable: false,
                cellRenderer: (params) => {
                    const customColumnValue = _.find(params.data.taskCustomColumnValues, (s) => s.customColumnId === item.id)
                    return !_.isNil(customColumnValue) ? customColumnValue.value : ''
                }
            })
        })
        setColumn([
            ...columns.slice(0, columns.length - 2),
            ...newColumns,
            ...columns.slice(columns.length - 2)
        ])
    }, [customColumns])

    return (
        <>
            <ConfirmDeleteDialog url={baseUrl.jm_task} id={id} />
            <GridData
                frameworkComponents={{ ActionBtnRenderer: ActionBtnRenderer }}
                onRowClicked={onRowClicked}
                // autoGroupColumnDef={autoGroupColumnDef}
                url={baseUrl.jm_task}
                columnVisibility={columnVisibility}
                filterModels={filterModels}
                columns={columns}></GridData>
            <TaskChildPopup taskParentId={id} taskTypeId={taskTypeId} />
        </>
    )
})

export default TaskGrid
