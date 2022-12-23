import React, { useEffect, useState } from "react"
import ButtonIcon from "components/button/ButtonIcon"
import { useTranslation } from "react-i18next"
import { useSelector, useDispatch } from "react-redux"
import ConfirmDeleteDialog from "components/popup/confirmDeleteDialog"
import { baseUrl, EButtonIconType } from "configs"
import {
    setEditData,
} from "stores/views/master"
import { open } from "components/popup/popupSlice"
import { open as openAlert } from "stores/components/alert-dialog"
import GridData from "components/table/GridData"
import StatusItem from 'views/category/status/statusItem'
import { formatDate } from "helpers/commonFunction"
import { UserItem } from 'components/user'
import UploadIconImage from 'components/upload/uploadIconImage'
import { LinkControl } from 'components/link'
import _ from 'lodash'
import LabelIconControl from 'components/label/labelIconControl'

const TaskGrid = React.memo((props) => {
    console.log("render TaskGrid")
    const { filterModels, onRowClicked, customColumns } = props
    const dispatch = useDispatch()
    const { t } = useTranslation()
    const [columnVisibility, setColumnVisibility] = useState({ ...useSelector((state) => state.task.columnVisibility) })
    const [id, setId] = useState(null)
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
                const titleTask = <LabelIconControl name={params.data.title} color={params.data.taskType.color} icon={params.data.taskType.icon} />
                const href = `/task/edit/${params.data.id}`
                return <div className="select-item">
                    <LinkControl href={href} title={titleTask}></LinkControl>
                </div>
            }
        },
        {
            field: "taskType.name", headerName: t("Loại công việc"),
            suppressAutoSize: true,
        },
        {
            field: "status.name", headerName: t("Trạng thái"),
            suppressAutoSize: true,
            cellRenderer: (params) => {
                return <StatusItem status={params.data.status} />
            }
        },
        {
            field: "createdDate",
            headerName: t("Ngày tạo"),
            suppressAutoSize: true,
            valueFormatter: cellFormatDate
        },
        {
            field: "createUser.name", headerName: t("Người tạo"),
            suppressAutoSize: true,
            cellRenderer: (params) => {
                return <UserItem {...params.data.createUser} />
            }
        },
        {
            field: "edit",
            width: 110,
            resizable: false,
            cellRenderer: (params) => {
                const onEditClick = (e) => {
                    e.stopPropagation() // don't select this row after clicking
                    if (!params) return
                    dispatch(open())
                    dispatch(setEditData(params.data.id))
                }

                const onDeleteClick = (e) => {
                    e.stopPropagation() // don't select this row after clicking
                    dispatch(openAlert({ open: true }))
                    setId(params.data.id)
                }

                return (
                    <strong>
                        <ButtonIcon onClick={onEditClick} type={EButtonIconType.edit}></ButtonIcon>
                        <ButtonIcon
                            onClick={onDeleteClick}
                            type={EButtonIconType.delete}
                        ></ButtonIcon>
                    </strong>
                )
            },
            sortable: false,
        },
    ])


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
            ...columns.slice(0, columns.length - 1),
            ...newColumns,
            ...columns.slice(columns.length - 1)
        ])
    }, [customColumns])


    function cellFormatDate(params) {
        return formatDate(params.value);
    }

    return (
        <div style={{ width: "100%", height: "100%" }}>
            <ConfirmDeleteDialog url={baseUrl.jm_task} id={id} />
            <GridData
                onRowClicked={onRowClicked}
                url={baseUrl.jm_task}
                columnVisibility={columnVisibility}
                filterModels={filterModels}
                columns={columns}></GridData>
        </div>
    )
})

export default TaskGrid
