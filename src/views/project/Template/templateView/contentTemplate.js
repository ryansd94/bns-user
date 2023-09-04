import React, { useEffect, useCallback, useState } from "react"
import styled from "styled-components"
import { DragDropContext } from "react-beautiful-dnd"
import DraggableElement from "components/drapAndDrop/DraggableElement"
import TextInput from "components/input/TextInput"
import { EControlType, EButtonIconType } from 'configs'
import Grid from "@mui/material/Grid"
import { useTranslation } from "react-i18next"
import TooltipControl from './tooltipControl'
import { useTheme } from '@mui/material/styles'
import { v4 as uuidv4 } from 'uuid'
import AssignSelect from 'components/select/assignSelect'
import StatusSelect from 'components/select/statusSelect'
import _ from "lodash"
import { deepFind } from "helpers/commonFunction"
import { Controller } from "react-hook-form"
import { getListContent } from "./defaultContent"

const DragDropContextContainer = styled.div`
display:flex;
width:100%
`

const findItemInGroupList = (list, id) => {
  const result = Array.from(list)
  const groupId = id.split('@')[1]

  const groupItem = result.find(ele => {
    return ele.id === groupId
  })

  const itemIndex = groupItem.items.findIndex(ele => {
    return ele.id === id
  })

  return [groupItem, itemIndex]
}

const removeFromList = (list, id) => {
  if (id.indexOf('@') != -1) {
    const [groupItem, itemIndex] = findItemInGroupList(list, id)
    const [removed] = groupItem.items.splice(itemIndex, 1)
    return [removed, list]
  }
  else {
    const index = list.findIndex(ele => {
      return ele.id === id
    })
    const [removed] = list.splice(index, 1)
    return [removed, list]
  }
}

const addToList = (list, index, id, element) => {
  let destinationDroppableId = id
  let isSourceGroup = false
  let isDestinationGroup = false
  const result = Array.from(list)
  if (destinationDroppableId.indexOf('@') != -1) {
    isDestinationGroup = true
    destinationDroppableId = destinationDroppableId.split('@')[0]
    let item = result.find(ele => {
      return ele.id === destinationDroppableId
    })
    item.items && item.items.splice(index, 0, element)
    return result
  } else {
    result.splice(index, 0, element)
    return result
  }
}

const ContentTemplate = (props) => {
  console.log("render ContentTemplate")
  const { setValue, dataTemplate = null, templateColumnData = [],
    control, name, onValueChange, id } = props
  const theme = useTheme()
  const { t } = useTranslation()
  const [elementContent, setElementContent] = useState(getListContent(t))
  const statusData = [{ id: 0, name: t('Start') }, { id: 1, name: t('End') }]

  useEffect(() => {
    if (dataTemplate && dataTemplate.content) {
      const content = JSON.parse(dataTemplate.content)
      setElementContent(content)
    }
  }, [dataTemplate])

  useEffect(() => {
    setValue(name, elementContent)
  }, [elementContent])

  const onDragEndTitle = (result) => {
    if (!result.destination) {
      return
    }
    const listCopy = { ...elementContent }

    let sourceDroppableId = result.source.droppableId
    let isSourceGroup = false
    let isDestinationGroup = false
    let destinationDroppableId = result.destination.droppableId

    //source group
    if (sourceDroppableId.indexOf('@') != -1) {
      sourceDroppableId = sourceDroppableId.split('@')[1]
      isSourceGroup = true
    }
    //remove item from source
    const sourceList = listCopy[sourceDroppableId]
    const [removedElement, newSourceList] = removeFromList(
      sourceList,
      result.draggableId
    )

    //destination to group
    if (destinationDroppableId.indexOf('@') != -1) {
      const groupId = destinationDroppableId.split('@')[0]
      destinationDroppableId = destinationDroppableId.split('@')[1]
      const destinationGroup = listCopy[destinationDroppableId].find(ele => {
        return ele.id === groupId
      })
      if (destinationGroup && destinationGroup.type === EControlType.group && removedElement.type === EControlType.group) return
    }
    listCopy[sourceDroppableId] = newSourceList

    let destinationElement = { ...removedElement }

    //destination to group
    if (result.destination.droppableId.indexOf('@') != -1) {
      isDestinationGroup = true
      const groupId = result.destination.droppableId.split('@')[0]
      if (destinationElement.id.indexOf('@') != -1) {
        destinationElement.id = destinationElement.id.split('@')[0]
      }
      if (!isSourceGroup || !isDestinationGroup) {
        destinationElement.id = `${destinationElement.id}@${groupId}`
        delete destinationElement.prefix
      } else {
        if (result.destination.droppableId.indexOf('@') != -1) {
          destinationElement.id = `${destinationElement.id}@${groupId}`
        }
        else destinationElement.id = `${destinationElement.id}`
      }
    } else {
      destinationElement.prefix = destinationDroppableId
      if (destinationElement.id.indexOf('@') != -1)
        destinationElement.id = destinationElement.id.split('@')[0]
    }


    const destinationList = listCopy[destinationDroppableId]
    listCopy[destinationDroppableId] = addToList(
      destinationList,
      result.destination.index,
      result.destination.droppableId,
      destinationElement
    )

    if (!_.isNil(id)) {
      onValueChange({ value: listCopy, name })
    }
    setElementContent(listCopy)
  }

  const getElementControls = (listKey) => {
    const value = elementContent[listKey]
    return _.isNil(value) ? [] : value
  }

  const onDeleteControl = (item, prefix) => {
    const listCopy = { ...elementContent }
    let sourceList = listCopy[prefix]
    //non group
    if (item.id.indexOf('@') != -1) {
      const [removedElement, newSourceList] = removeFromList(
        sourceList,
        item.id
      )
    } else { //group
      const index = sourceList.findIndex(ele => {
        return ele.id === item.id
      })
      if (index != -1) {
        sourceList.splice(index, 1)
      }
    }
    if (!_.isNil(id)) {
      onValueChange({ value: listCopy, name })
    }
    setElementContent(listCopy)
  }

  const onMoveUpControl = (item, prefix, field) => {
    const listCopy = { ...elementContent }
    let sourceList = listCopy[prefix]
    //non group
    if (item.id.indexOf('@') != -1) {
      const [groupItem, itemIndex] = findItemInGroupList(sourceList, item.id)
      if (itemIndex != 0) {
        const [removed] = groupItem.items.splice(itemIndex - 1, 1)
        groupItem.items.splice(itemIndex, 0, removed)
      }

    } else { //group
      const index = sourceList.findIndex(ele => {
        return ele.id === item.id
      })
      if (index != 0) {
        const [removedElement, newSourceList] = removeFromList(
          sourceList,
          item.id
        )
        sourceList.splice(index - 1, 0, removedElement)
      }
    }
    if (!_.isNil(id)) {
      onValueChange({ value: listCopy, name })
    }
    field.onChange(listCopy)
    setElementContent(listCopy)
  }

  const onMoveDownControl = (item, prefix, field) => {
    const listCopy = { ...elementContent }
    let sourceList = listCopy[prefix]
    //non group
    if (item.id.indexOf('@') != -1) {
      const [groupItem, itemIndex] = findItemInGroupList(sourceList, item.id)
      const [removed] = groupItem.items.splice(itemIndex + 1, 1)

      groupItem.items.splice(itemIndex, 0, removed)
    } else { //group
      const index = sourceList.findIndex(ele => {
        return ele.id === item.id
      })

      const [removedElement, newSourceList] = removeFromList(
        sourceList,
        item.id
      )
      sourceList.splice(index + 1, 0, removedElement)
    }
    if (!_.isNil(id)) {
      onValueChange({ value: listCopy, name })
    }
    field.onChange(listCopy)
    setElementContent(listCopy)
  }

  const onAction = (type, item, prefix, field) => {
    if (type === EButtonIconType.delete) {
      onDeleteControl(item, prefix)
    } else if (type === EButtonIconType.up) {
      onMoveUpControl(item, prefix, field)
    } else if (type === EButtonIconType.down) {
      onMoveDownControl(item, prefix, field)
    }
  }

  const onSettingSubmit = (data, index, prefix, item, field) => {
    let listCopy = { ...elementContent }
    let sourceList = listCopy[prefix]
    let settingItem = deepFind(sourceList, function (obj) {
      return obj.id === item.id
    }, 'items')
    if (!_.isNil(settingItem)) {
      settingItem.label = data.label
      settingItem.required = data.required
    }
    if (!_.isNil(id)) {
      onValueChange({ value: listCopy, name })
    }
    field.onChange(listCopy)
    setElementContent(listCopy)
  }

  const onAddControlSubmit = (data, index, prefix, item, field) => {
    const listCopy = { ...elementContent }
    const destinationList = listCopy[prefix]
    let prefixGroup = prefix
    let id = item.id
    let isAddInGroup = false
    let groupId = ''
    let isNonGroup = id.indexOf('@') != -1
    let title = ''
    let positionIndex = index
    if (data.position === '2') {
      positionIndex = index + 1
    }

    if (!data.title.isAddNew) {
      const column = _.find(templateColumnData, (s) => s.id === data.title)
      if (!_.isEmpty(column)) {
        title = column.name
      }
    } else {
      title = data.title.name
    }

    //non-group
    if (isNonGroup) {
      groupId = id.split('@')[1]
      let item = destinationList.find(ele => {
        return ele.id === groupId
      })
      prefixGroup = item.prefix
    }

    //group and case add item in group
    if (item.type === EControlType.group && data.position === '3') {
      positionIndex = 0
      prefixGroup = item.prefix
      isAddInGroup = true
    }

    id = isNonGroup || isAddInGroup ? `${uuidv4()}@${groupId}` : `${uuidv4()}`
    listCopy[prefix] = addToList(
      destinationList,
      positionIndex,
      prefixGroup,
      {
        id: id,
        type: data.type,
        label: title,
        isAddNew: data.title.isAddNew,
        columnId: data.title.isAddNew ? data.title.id : data.title,
        prefix: isNonGroup ? prefixGroup : null
      }
    )
    if (!_.isNil(id)) {
      onValueChange({ value: listCopy, name })
    }
    field.onChange(listCopy)
    setElementContent(listCopy)
  }

  const renderPopoverControl = (item, prefix, index, isLastControl, field) => {
    return <TooltipControl
      templateColumnData={templateColumnData}
      onAddControlSubmit={onAddControlSubmit}
      onSettingSubmit={onSettingSubmit}
      isLastControl={isLastControl}
      index={index}
      item={item}
      prefix={prefix}
      field={field}
      onAction={(type) => onAction(type, item, prefix, field)} />
  }

  return (
    <Controller
      name={name}
      render={({ field, fieldState: { error } }) =>
        <Grid container gap={2}>
          <Grid container alignItems={'center'} gap={2} item xs={12}>
            <Grid item>
              <span>1111111</span>
            </Grid>
            <Grid item xs>
              <TextInput control={control} name="title" disabled />
            </Grid>
          </Grid>
          <Grid className="flex-container" container gap={2} item xs={12}>
            <Grid item>
              <AssignSelect
                control={control}
                name={'assign'}
                data={[{ id: 1, name: t('Assigner 1') }, { id: 2, name: 'Assigner 2' }, { id: 3, name: 'Assigner 3' }]}
              />
            </Grid>
            <Grid item>
              <StatusSelect
                options={statusData}
                name={'statusId'}
                control={control}
                defaultValue={!_.isEmpty(statusData) ? statusData[0].id : null}
              />
            </Grid>
          </Grid>
          <Grid item xs container>
            <DragDropContextContainer>
              <DragDropContext onDragEnd={onDragEndTitle}>
                <Grid className="task-column-content no-wrap" container gap={2} item xs={12} direction="row">
                  <Grid key={2} item xs={12} sm={getElementControls("column3").length > 0 ? 6 : 9}>
                    <DraggableElement
                      field={field}
                      renderPopoverControl={renderPopoverControl}
                      prefix={"column1"}
                      control={control}
                      controls={getElementControls("column1")}
                    />
                  </Grid>
                  <Grid key={3} item xs={12} sm={3}>
                    <DraggableElement
                      field={field}
                      renderPopoverControl={renderPopoverControl}
                      prefix={"column2"}
                      control={control}
                      controls={getElementControls("column2")}
                    />
                  </Grid>
                  {/* <Grid key={1} item xs={12} sm={3}>
                  <DraggableElement
                    renderPopoverControl={renderPopoverControl}
                    prefix={"column3"}
                    control={control}
                    controls={getElementControls("column3")}
                  />
                </Grid> */}
                </Grid>
              </DragDropContext>
            </DragDropContextContainer>
          </Grid>
        </Grid>
      }
      control={control}
    />
  )
}

export default ContentTemplate
