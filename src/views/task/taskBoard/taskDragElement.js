import { Droppable } from "react-beautiful-dnd"
import React from "react"
import styled from "styled-components"
import Grid from "@mui/material/Grid"
import { TaskDragItem } from './'
import { TaskTitle } from 'components/task'
import StatusItem from 'views/category/status/statusItem'
import { UserItem } from 'components/user'
import _ from 'lodash'
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { LabelDateControl } from 'components/label'
import { formatDateTime } from 'helpers'
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

  const renderRowInfo = (item) => {
    let dueDateItem = ''
    if (!_.isNil(item.dueDate)) {
      let classDueDate = 'task-date-item'
      const dueDate =new Date(item.dueDate)
      const dateNow =new Date()
      if (dueDate.toDateString() === dateNow.toDateString()) {
        classDueDate = 'task-date-today-item'
      }
      else if (dueDate < dateNow) {
        classDueDate = 'task-date-late-item'
      }
      dueDateItem = <Grid item>
        <LabelDateControl className={classDueDate} value={formatDateTime(dueDate)} name={t('Ngày hết hạn')} />
      </Grid>
    }
    return <Grid item container className="align-items-center" xs direction='row'> {
      !_.isEmpty(dueDateItem) ? <Grid gap={1} item container>
        {dueDateItem}
      </Grid> : ''
    }
      <Grid item>
        <TaskNoteItem item={item} title={t('Mô tả')} />
      </Grid>
    </Grid>
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

  return <Grid className="task-board-content" container gap={2} key={item.id} item direction='column'>
    <Grid item className="task-board-header">
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
