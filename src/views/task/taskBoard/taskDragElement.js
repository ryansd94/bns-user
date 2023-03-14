import { Droppable } from "react-beautiful-dnd"
import React from "react"
import styled from "styled-components"
import Grid from "@mui/material/Grid"
import { TaskDragItem } from './'
import { TaskTitle } from 'components/task'
import StatusItem from 'views/category/status/statusItem'
import { UserItem } from 'components/user'
import _ from 'lodash'
import { DatePickerInput } from "components/datepicker"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { LabelDateControl } from 'components/label'
import { formatDateTime } from 'helpers'
import { IconDescription } from 'components/icon/icon'
import { OverflowTip } from 'components/tooltip'
import { TaskNoteItem } from './../taskBoardItem'

const ColumnHeader = styled.div`
  text-transform: uppercase;
  margin-bottom: 20px;
`

const DroppableStyles = styled.div`
padding:0;
`

const TaskDragElement = ({ item, columnHeader, controls = [], droppableClassName, onRowClicked }) => {
  const { t } = useTranslation()
  const {
    control,
    setValue,
    getValues
  } = useForm({
    defaultValues: {
      dynamicData: {},
      comments: []
    }
  })

  const onTaskClick = (item) => {
    onRowClicked && onRowClicked({ data: { id: item.id } })
  }

  const renderRowTitle = (item) => {
    return <Grid item>
      <TaskTitle isRenderTaskLink={false} item={item} />
    </Grid>
  }

  const genderTooltipDescription = (item) => {
    return <TaskNoteItem item={item} />
  }

  const renderRowInfo = (item) => {
    let dueDate = ''
    if (!_.isNil(item.dueDate)) {
      dueDate = <Grid item>
        <LabelDateControl value={formatDateTime(item.dueDate)} name={t('Ngày hết hạn')} />
      </Grid>
    }
    return !_.isEmpty(dueDate) ? <Grid gap={1} item container direction='row'>
      {dueDate}
      <Grid item>
        <OverflowTip disableHoverListener={false} value={t('Mô tả')} genderTooltipContent={() => genderTooltipDescription(item)} />
      </Grid>
    </Grid> : ''
  }

  const renderRowAssign = (item) => {
    return !_.isEmpty(item.usersAssign) ? <Grid item>
      <UserItem {...item.usersAssign[0]} />
    </Grid> : ''
  }

  const genderElement = (item, index) => {
    const component = <Grid item container gap={2} direction='column'>
      {renderRowTitle(item)}
      {renderRowInfo(item)}
      {renderRowAssign(item)}
    </Grid>
    return <Grid onClick={() => onTaskClick(item)} className="task-drag-item" key={index} item>
      <TaskDragItem key={item.id} control={component} id={item.id} index={index} />
    </Grid>
  }

  return <Grid className="task-view-status-content" container gap={2} key={item.id} item direction='column'>
    <Grid item className="task-status-header">
      <StatusItem status={item} />
    </Grid>
    <Grid className="group" item>
      <DroppableStyles>
        {columnHeader ? (<ColumnHeader>{columnHeader}</ColumnHeader>) : ''}
        <Droppable droppableId={`${item.id}`}>
          {(provided) => (
            <div className={droppableClassName} {...provided.droppableProps} ref={provided.innerRef}>
              {
                <Grid item xs gap={2} flexWrap={'nowrap'} container flexDirection={'column'}>{
                  controls && controls.map((item, index) => {
                    return genderElement(item, index)
                  })
                }
                </Grid>
              }
            </div>
          )}
        </Droppable>
      </DroppableStyles>
    </Grid>
  </Grid>
}

export default TaskDragElement
