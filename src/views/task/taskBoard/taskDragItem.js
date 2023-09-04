import { useState } from "react"
import { Draggable } from "react-beautiful-dnd"
import styled from "styled-components"
import { PopoverControl } from 'components/popover'

const DragItem = styled.div`
  // padding: 10px;
  background: transparent;
  display: flex;
  flex-wrap: nowrap;
  gap: 1rem;
  flex-direction: column;
  width: 100%;
`
const TaskDragItem = ({ id, index, control, renderPopoverControl }) => {
  const [openPopover, setOpenPopover] = useState(null)

  const handlePopoverOpen = (event) => {
    setOpenPopover(event.currentTarget)
  }

  const handlePopoverClose = () => {
    setOpenPopover(null)
  }

  return (
    <Draggable droppableId={id} draggableId={id} index={index}>
      {(provided, snapshot) => {
        return (
          <DragItem
            aria-owns="mouse-over-popover"
            aria-haspopup="true"
            onMouseEnter={handlePopoverOpen}
            onMouseLeave={handlePopoverClose}
            ref={provided.innerRef}
            snapshot={snapshot}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            {control}
            {renderPopoverControl ? <PopoverControl isCLoseOnHover={true} genderBody={renderPopoverControl} onClose={handlePopoverClose} anchorEl={openPopover} /> : ''}
          </DragItem>
        )
      }}
    </Draggable>
  )
}

export default TaskDragItem
