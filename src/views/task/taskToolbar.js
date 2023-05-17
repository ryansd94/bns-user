import React, { useEffect, useState } from 'react'
import ToolBar from "components/toolbar/ToolBar"
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from "react-redux"
import {
    setColumnVisibility,
} from "stores/views/task"
import { useTranslation } from "react-i18next"
import { EFilterType, baseUrl } from "configs"
import TaskTypeMenu from './taskTypeMenu'
import { EButtonType } from 'configs/enums'
import ButtonFuntion from 'components/button/ButtonFuntion'
import _ from 'lodash'

const TaskToolbar = (props) => {
    const { onApplyFilter, customColumns, taskTypes, onFullScreen, hidenRight, isViewList, onChangeViewMode } = props
    const { t } = useTranslation()
    const dispatch = useDispatch()
    const toolbarVisible = { ...useSelector((state) => state.task.toolbarVisible) }
    const columnVisibility = { ...useSelector((state) => state.task.columnVisibility) }

    const [columnModels, setColumnModel] = useState([{
        field: "title", isShow: true, label: t("Title"), type: EFilterType.text
    },
    {
        field: "status.Name", isShow: true, label: t("Status"), type: EFilterType.text
    },
    {
        field: "estimatedhour", isShow: true, label: t("Estimated time"), type: EFilterType.text
    },
    {
        field: "tags", isShow: true, label: t("Tags"), type: EFilterType.text
    },
    {
        field: "taskType.name", isShow: true, label: t("Task type"), type: EFilterType.text
    },
    {
        field: "startDate", isShow: true, label: t("Start date"), type: EFilterType.datetime
    },
    {
        field: "dueDate", isShow: true, label: t("Expiration date"), type: EFilterType.datetime
    },
    {
        field: "createdDate", isShow: true, label: t("Date created"), type: EFilterType.datetime
    },
    {
        field: "createdUser.fullName", isShow: true, label: t("User created"), type: EFilterType.text
    }
    ])

    useEffect(() => {
        customColumns && customColumns.map((item) => {
            columnModels.push({
                field: item.id,
                label: item.name,
                isShow: true,
                width: 110,
                type: EFilterType.text,
                isCustom: true
            })
        })
        setColumnModel([...columnModels])
    }, [customColumns])

    const handleColumnConfigChange = (event) => {
        columnVisibility[event.target.name] = event.target.checked
        let columnModel = _.first(_.filter(columnModels, (item) => {
            return item.field === event.target.name
        }))
        if (!_.isNil(columnModel)) {
            columnModel.isShow = event.target.checked
        }
        dispatch(setColumnVisibility(columnVisibility))
    }

    const handleClickOpen = () => {
        //window.open(`/task/taskIiew`)
    }

    const genarateCustomButton = () => {
        return <>
            {
                hidenRight === true ? <ButtonFuntion onClick={() => onFullScreen(false)} isTextAndIcon={false} spacingLeft={1} type={EButtonType.split} />
                    : <ButtonFuntion onClick={() => onFullScreen(true)} isTextAndIcon={false} spacingLeft={1} type={EButtonType.full} />
            }
            {
                isViewList === true ? <ButtonFuntion onClick={() => onChangeViewMode(false)} isTextAndIcon={false} spacingLeft={1} type={EButtonType.board} />
                    : <ButtonFuntion onClick={() => onChangeViewMode(true)} isTextAndIcon={false} spacingLeft={1} type={EButtonType.list} />
            }
            <TaskTypeMenu taskTypes={taskTypes} />
        </>
    }

    return <>
        <ToolBar component={baseUrl.jm_task}
            visible={toolbarVisible}
            onApplyFilter={onApplyFilter}
            genarateCustomButton={genarateCustomButton()}
            onColumnConfigChange={handleColumnConfigChange}
            columnModel={columnModels}
            onAddClick={handleClickOpen} />
    </>

}

TaskToolbar.propTypes = {
    onAddClick: PropTypes.func,
}

export default TaskToolbar