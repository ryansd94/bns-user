import { Droppable } from "react-beautiful-dnd"
import ListItem from "./ListItem"
import React from "react"
import styled from "styled-components"
import { EditorControl } from 'components/editor'
import { EControlType, ESize } from 'configs'
import Grid from "@mui/material/Grid"
import { TextInput } from 'components/input'
import SingleSelect from 'components/select/SingleSelect'
import { AccordionControl } from 'components/accordion'
import { DatePickerInput } from 'components/datepicker'

const ColumnHeader = styled.div`
  text-transform: uppercase;
  margin-bottom: 20px;
`

const DroppableStyles = styled.div`
padding:0;
`

const DraggableElement = ({ prefix, columnHeader, controls = [], control, droppableClassName, genderPopoverControl }) => {

  const isLastControl = (item) => {
    if (item.type === EControlType.group || item.id.indexOf('@') == -1) {
      const index = controls.findIndex(ele => {
        return ele.id === item.id
      })
      if (index == controls.length - 1) return true
    } else {
      const groupId = item.id.split('@')[1]

      const groupItem = controls.find(ele => {
        return ele.id === groupId
      })

      const index = groupItem.items.findIndex(ele => {
        return ele.id === item.id
      })

      if (index == groupItem.items.length - 1) return true
    }
    return false
  }

  const genderElement = (item, index, control) => {
    let component = <TextInput name={item.id} control={control} size={ESize.small}
      inputProps={
        { readOnly: true, }
      }
      label={item.label} />
    if (item.type === EControlType.typography) {
      component = <span>{item.id}</span>
    }
    else if (item.type === EControlType.editor) {
      component = (<EditorControl label={item.label} readOnly={true} name={item.id} control={control} className="editor-container" />)
    }
    else if (item.type === EControlType.select) {
      component = (<SingleSelect fullWidth={true} label={item.label} name={item.id} control={control} />)
    }
    else if (item.type === EControlType.dateTimePicker) {
      component = (<DatePickerInput label={item.label} disabled={true} name={item.id} control={control} />)
    }
    else if (item.type === EControlType.group) {
      component = <AccordionControl
        isExpand={true}
        title={item.label}
        name={item.name}
        genderPopoverControl={() => genderPopoverControl(item, prefix, index, isLastControl(item))}
        details={
          <div>
            {
              item.items && item.items.map((x, childIndex) => {
                return genderElement(x, childIndex, control)
              })
            }
          </div>
        }
      />
    }
    return (
      <Grid key={index} item xs={12}>
        <ListItem genderPopoverControl={item.type !== EControlType.group ? () => genderPopoverControl(item, prefix, index, isLastControl(item)) : null} control={component} key={item.id} id={item.id} index={index} />
      </Grid>)
  }


  return (<DroppableStyles>
    {columnHeader ? (<ColumnHeader>{columnHeader}</ColumnHeader>) : ''}
    <Droppable droppableId={`${prefix}`}>
      {(provided) => (
        <div className={droppableClassName} {...provided.droppableProps} ref={provided.innerRef}>
          {
            controls && controls.map((item, index) => {
              if (item.type != EControlType.group) {
                return genderElement(item, index, control)
              } else {
                return <Droppable key={item.id} droppableId={`${item.prefix}`}>
                  {(providedChild) => (
                    <div className={droppableClassName} {...providedChild.droppableProps} ref={providedChild.innerRef}>
                      {
                        genderElement(item, index, control)
                      }
                    </div>
                  )}
                </Droppable>
              }
            })
          }
        </div>
      )}
    </Droppable>
  </DroppableStyles>)
}

export default DraggableElement
