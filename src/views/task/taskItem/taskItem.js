import { Droppable } from "react-beautiful-dnd"
import React from "react"
import styled from "styled-components"
import StatusItem from "views/category/status/statusItem"
import { TaskTitle } from "components/task"
import { LabelDateControl } from "components/label"
import { formatDateTime } from "helpers"
import { useTranslation } from "react-i18next"
import Grid from "@mui/material/Grid"
import { UserItem } from "components/user"

const TaskItem = (props) => {
    const { item, className, isShowTooltip = true } = props
    const { t } = useTranslation()

    const renderRowTitle = (item) => {
        return (
            <Grid item className={className}>
                <TaskTitle isShowTooltip={isShowTooltip} isRenderTaskLink={false} item={item} />
            </Grid>
        )
    }

    const renderRowInfo = (item) => {
        if (_.isNil(item.dueDate)) return
        let dueDateItem = ""
        let classDueDate = "task-date-item"
        const dueDate = new Date(item.dueDate)
        const dateNow = new Date()
        if (!item.status.isStatusEnd) {
            if (dueDate.toDateString() === dateNow.toDateString()) {
                classDueDate = "task-date-today-item"
            } else if (dueDate < dateNow) {
                classDueDate = "task-date-late-item"
            }
        }
        dueDateItem = (
            <Grid item>
                <LabelDateControl
                    className={classDueDate}
                    value={formatDateTime(dueDate)}
                    name={t("Expiration date")}
                />
            </Grid>
        )
        return (
            <Grid item container className="align-items-center" xs direction="row">
                {" "}
                <Grid gap={1} item container>
                    {dueDateItem}
                </Grid>
            </Grid>
        )
    }

    const renderRowAssign = (item) => {
        return !_.isNil(item.userAssign) ? (
            <Grid item>
                <UserItem {...item.userAssign} />
            </Grid>
        ) : (
            ""
        )
    }

    return <Grid item container gap={2} direction="column">
        {renderRowTitle(item)}
        {renderRowInfo(item)}
        {renderRowAssign(item)}
    </Grid>
}
export default TaskItem