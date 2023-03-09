import React, { useEffect, useCallback, useState } from "react"
import styled from "styled-components"
import { DragDropContext } from "react-beautiful-dnd"
import DraggableElement from "components/drapAndDrop/DraggableElement"
import TextInput from "components/input/TextInput"
import { EControlType, ESize, EButtonIconType } from 'configs'
import Grid from "@mui/material/Grid"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import TooltipControl from './tooltipControl'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import { v4 as uuidv4 } from 'uuid'
import AssignSelect from 'components/select/assignSelect'
import StatusSelect from 'components/select/statusSelect'
import _ from "lodash"

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

const generateListTitle = () => {
  return {
    "column1": [
      {
        id: `item-1`,
        prefix: "column1",
        type: EControlType.editor,
        name: 'description',
        label: 'Mô tả',
        default: true
      },
      {
        id: `item-2`,
        prefix: "column1",
        type: EControlType.editor,
        name: 'note',
        label: 'Ghi chú',
        default: true
      },
      {
        id: `item-16`,
        prefix: "column1",
        type: EControlType.comment,
        name: 'comment',
        label: 'Bình luận',
        default: true
      },
    ],
    "column2": [
      {
        id: `item-3`,
        prefix: "item-3@column2",
        type: EControlType.group,
        label: 'Chi tiết',
        name: 'detail',
        default: true,
        items: [
          {
            id: `item-4@item-3`,
            type: EControlType.userItem,
            label: 'Người tạo',
            name: 'createdUser',
            default: true,
            defaultReadonly: true,
            isHidenWhenCreate: true
          },
          {
            id: `item-11@item-3`,
            type: EControlType.dateTimePicker,
            label: 'Ngày tạo',
            name: 'createdDate',
            default: true,
            defaultReadonly: true,
            isHidenWhenCreate: true
          },
          {
            id: `item-5@item-3`,
            type: EControlType.select,
            label: 'Độ ưu tiên',
            name: 'priority',
            default: true
          },
        ]
      },
      {
        id: `item-8`,
        prefix: "item-8@column2",
        type: EControlType.group,
        label: 'Kế hoạch',
        default: true,
        items: [
          {
            id: `item-9@item-8`,
            type: EControlType.datePicker,
            label: 'Ngày bắt đầu',
            name: 'startDate',
            default: true
          },
          {
            id: `item-10@item-8`,
            type: EControlType.datePicker,
            label: 'Ngày hết hạn',
            name: 'dueDate',
            default: true
          },
          {
            id: `item-12@item-8`,
            type: EControlType.number,
            label: 'Thời gian ước tính',
            name: 'estimatedhour',
            default: true
          }
        ]
      },
      {
        id: `item-14`,
        prefix: "item-14@column2",
        type: EControlType.parentTask,
        label: 'Công việc cha',
        name: 'taskParent',
        default: true,
      },
      {
        id: `item-13`,
        prefix: "item-13@column2",
        type: EControlType.childTask,
        label: 'Công việc con',
        name: 'taskChilds',
        default: true,
      },
      {
        id: `item-15`,
        prefix: "item-15@column2",
        type: EControlType.upload,
        label: 'Tập tin đính kèm',
        name: 'files',
        default: true,
      }
    ],
  }
}

const ContentTemplate = (props) => {
  console.log("render ContentTemplate")
  const { setValue, dataTemplate = null, statusData = [], templateColumnData = [] } = props
  const theme = useTheme()
  const largeScreen = useMediaQuery(theme.breakpoints.up('md'))
  const [elementsTitle, setElementsTitle] = useState(generateListTitle())
  const { t } = useTranslation()
  const {
    control
  } = useForm({
    defaultValues: {
      assign: [{ id: 1, name: 'Người nhận 1' }],
      status: { id: 1, name: 'Mới', color: '#1976d2' }
    }
  })

  useEffect(() => {
    if (dataTemplate && dataTemplate.content) {
      const content = JSON.parse(dataTemplate.content)
      setElementsTitle(content)
    }
  }, [dataTemplate])

  useEffect(() => {
    setValue('content', elementsTitle)
  }, [elementsTitle])

  const onDragEndTitle = (result) => {
    if (!result.destination) {
      return
    }
    const listCopy = { ...elementsTitle }

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

    setElementsTitle(listCopy)
  }

  const getElementControls = (listKey) => {
    const value = elementsTitle[listKey]
    return _.isNil(value) ? [] : value
  }

  const onDeleteControl = (item, prefix) => {
    const listCopy = { ...elementsTitle }
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
    setElementsTitle(listCopy)
  }

  const onMoveUpControl = (item, prefix) => {
    const listCopy = { ...elementsTitle }
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
    setElementsTitle(listCopy)
  }

  const onMoveDownControl = (item, prefix) => {
    const listCopy = { ...elementsTitle }
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
    setElementsTitle(listCopy)
  }

  const onAction = (type, item, prefix) => {
    if (type === EButtonIconType.delete) {
      onDeleteControl(item, prefix)
    } else if (type === EButtonIconType.up) {
      onMoveUpControl(item, prefix)
    } else if (type === EButtonIconType.down) {
      onMoveDownControl(item, prefix)
    } else if (type === EButtonIconType.add) {

    }
  }

  const onAddControlSubmit = (data, index, prefix, item) => {
    const listCopy = { ...elementsTitle }
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
    setElementsTitle(listCopy)
  }

  const genderPopoverControl = (item, prefix, index, isLastControl) => {
    return <TooltipControl
      templateColumnData={templateColumnData}
      onAddControlSubmit={onAddControlSubmit}
      isLastControl={isLastControl}
      index={index}
      item={item}
      prefix={prefix}
      onAction={(type) => onAction(type, item, prefix)} />
  }

  return (
    <div>
      <Grid container spacing={2}>
        <Grid className="flex-container" item xs={12}>
          <span>1111111</span>
          <TextInput control={control} name="title" disabled />
        </Grid>
        <Grid className="flex-container" container spacing={2} item xs={12}>
          <Grid item>
            <AssignSelect
              control={control}
              name={'assign'}
              data={[{ id: 1, name: 'Người nhận 1' }, { id: 2, name: 'Người nhận 2' }, { id: 3, name: 'Người nhận 3' }]}
            />
          </Grid>
          <Grid item>
            <StatusSelect
              options={[...statusData]}
              name={'status'}
              control={control}
            />
          </Grid>
        </Grid>
        <Grid item>
          <DragDropContextContainer>
            <DragDropContext onDragEnd={onDragEndTitle}>
              <Grid className="task-column-content" container spacing={2} item xs={12} direction="row">
                <Grid key={2} item xs={12} sm={getElementControls("column3").length > 0 ? 6 : 9}>
                  <DraggableElement
                    genderPopoverControl={genderPopoverControl}
                    prefix={"column1"}
                    control={control}
                    controls={getElementControls("column1")}
                  />
                </Grid>
                <Grid key={3} item xs={12} sm={3}>
                  <DraggableElement
                    genderPopoverControl={genderPopoverControl}
                    prefix={"column2"}
                    control={control}
                    controls={getElementControls("column2")}
                  />
                </Grid>
                <Grid key={1} item xs={12} sm={3}>
                  <DraggableElement
                    genderPopoverControl={genderPopoverControl}
                    prefix={"column3"}
                    control={control}
                    controls={getElementControls("column3")}
                  />
                </Grid>
              </Grid>
            </DragDropContext>
          </DragDropContextContainer>
        </Grid>
      </Grid>
    </div >
  )
}

export default ContentTemplate
