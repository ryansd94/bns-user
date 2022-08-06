import { Draggable } from "react-beautiful-dnd"
import React, { useState } from "react"
import styled, { css } from "styled-components"
import { PopoverControl } from 'components/popover'


const DragItem = styled.div`
  padding: 10px;
  background: transparent;
  display: grid;
  grid-gap: 20px;
  flex-direction: column;
  width: 100%;
`;


const ListItem = ({ id, index, control, genderPopoverControl }) => {
  const [openPopover, setOpenPopover] = useState(null)

  const handlePopoverOpen = (event) => {
    setOpenPopover(event.currentTarget);
  }

  const handlePopoverClose = () => {
    setOpenPopover(null);
  }

  return (
    <Draggable draggableId={id} index={index}>
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
            {genderPopoverControl ? <PopoverControl isCLoseOnHover={true} genderBody={genderPopoverControl} onClose={handlePopoverClose} anchorEl={openPopover} /> : ''}
          </DragItem>
        );
      }}
    </Draggable>
  );
};

export default ListItem;
