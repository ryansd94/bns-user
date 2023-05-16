import React, { useEffect, useState, useMemo } from "react"
import { useTranslation } from "react-i18next"
import { useSelector, useDispatch } from "react-redux"
import { baseUrl } from "configs"
import { open, change_title } from "components/popup/popupSlice"
import GridData from "components/table/GridData"
import StatusItem from 'views/category/status/statusItem'
import { cellFormatDate, cellFormatDateTime } from "helpers/commonFunction"
import { UserItem } from 'components/user'
import { LinkControl } from 'components/link'
import { CellMuliValue } from 'components/table'
import _ from 'lodash'
import LabelIconControl from 'components/label/labelIconControl'
import { DropDownItem } from 'components/dropdown'
import { EButtonType } from 'configs/enums'
import TaskChildPopup from './taskChildPopup'
import { ActionButton } from 'components/cellRender'
import { CellButton } from 'components/cellRender'
import { getUserInfo, getPathItem } from "helpers"

const TaskGrid = React.memo((props) => {
    console.log("render TaskGrid")
    const { filterModels, onRowClicked, customColumns } = props
    const dispatch = useDispatch()
    const { t } = useTranslation()
    const columnVisibility = { ...useSelector((state) => state.task.columnVisibility) }
    const [id, setId] = useState(null)
    const user = getUserInfo()
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
                const href = getPathItem(`/task/edit/${params.data.id}`)
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
                return <strong>
                    <CellButton id={params.data.id} url={baseUrl.jm_task} isEditShow={false} />
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
        return <DropDownItem onClick={() => addChildTask(data)} title={t('Create a new task')} />
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

    const getDefaultFilter = () => {
        if (!_.isNil(user.setting?.projectSetting?.currentId)) {
            return [{ column: 'projectId', condition: 0, value: user.setting?.projectSetting?.currentId }]
        }
        return []
    }

    return (
        <>
            <GridData
                defaultFilters={getDefaultFilter()}
                frameworkComponents={{ ActionBtnRenderer: ActionBtnRenderer }}
                onRowClicked={onRowClicked}
                // autoGroupColumnDef={autoGroupColumnDef}
                url={baseUrl.jm_task}
                columnVisibility={columnVisibility}
                filterModels={filterModels}
                columns={columns} />
            <TaskChildPopup taskParentId={id} taskTypeId={taskTypeId} />
        </>
    )
})

export default TaskGrid
