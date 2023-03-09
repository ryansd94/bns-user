import { Droppable } from "react-beautiful-dnd"
import React from "react"
import styled from "styled-components"
import Grid from "@mui/material/Grid"
import { TaskDragItem } from './'
import { TaskTitle } from 'components/task'

const ColumnHeader = styled.div`
  text-transform: uppercase;
  margin-bottom: 20px;
`

const DroppableStyles = styled.div`
padding:0;
`

const TaskDragElement = ({ prefix, columnHeader, controls = [], droppableClassName, onRowClicked }) => {

  const onTaskClick = (item) => {
    onRowClicked && onRowClicked({ data: { id: item.id } })
  }

  const genderElement = (item, index) => {
    const component = <TaskTitle isRenderTaskLink={false} item={item} />
    return <Grid onClick={() => onTaskClick(item)} className="task-drag-item" key={index} item>
      <TaskDragItem key={item.id} control={component} id={item.id} index={index} />
    </Grid>
  }

  return <DroppableStyles>
    {columnHeader ? (<ColumnHeader>{columnHeader}</ColumnHeader>) : ''}
    <Droppable droppableId={`${prefix}`}>
      {(provided) => (
        <div className={droppableClassName} {...provided.droppableProps} ref={provided.innerRef}>
          {
            <Grid item xs flexWrap={'nowrap'} container flexDirection={'column'} gap={2}>{
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
}

export default TaskDragElement
