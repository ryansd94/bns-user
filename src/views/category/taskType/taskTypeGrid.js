import React, { useEffect, useState, useRef } from "react"
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
import UploadIconImage from 'components/upload/uploadIcon/uploadIconImage'

const TaskTypeGrid = React.memo((props) => {
    const { filterModels } = props
    const dispatch = useDispatch()
    const { t } = useTranslation()
    const columnVisibility = { ...useSelector((state) => state.taskType.columnVisibility) }
    const [id, setId] = useState(null)

    const columns = [
        {
            checkboxSelection: true,
            resizable: false, width: 40, headerCheckboxSelection: true,
            pinned: 'left'
        },
        {
            field: "name", headerName: t("Tên loại công việc"),
            flex: 1,
            pinned: 'left'
        },
        {
            field: "templateName", headerName: t("Mẫu công việc"),
        },
        {
            field: "icon", headerName: t("Biểu tượng"),
            suppressAutoSize: true,
            sortable: false,
            cellRenderer: (params) => {
                return params.data.icon ?
                    <UploadIconImage color={params.data.color} src={params.data.icon} /> : ''
            }
        },
        {
            field: "description",
            headerName: t("Mô tả"),
            flex: 1,
        },
        {
            field: "edit",
            headerName: "",
            width: 120,
            suppressAutoSize: true,
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
    ]

    return (
        <div style={{ width: "100%", height: "100%" }}>
            <ConfirmDeleteDialog url={baseUrl.jm_taskType} id={id} />
            <GridData
                url={baseUrl.jm_taskType}
                columnVisibility={columnVisibility}
                filterModels={filterModels}
                columns={columns}></GridData>
        </div>
    )
})

export default TaskTypeGrid