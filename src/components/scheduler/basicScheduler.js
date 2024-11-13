import React, { useState, useEffect } from "react"
import { ViewTypes } from "./components/constants"
import Scheduler from "./scheduler"
import SchedulerData from "./components/schedulerData"
import DemoData from "./components/demoData"
import { DragDropContext } from "react-dnd"
import HTML5Backend from "react-dnd-html5-backend"

const BasicScheduler = (props) => {
  const { data = {} } = props
  // const data = DemoData

  const getViewModel = (data) => {
    const schedulerData = new SchedulerData("2023-12-09", ViewTypes.Week)
    // const schedulerData = new SchedulerData("2017-12-18", ViewTypes.Week)
    schedulerData.localeMoment.locale("en")
    schedulerData.setResources(data.resources ? [...data.resources] : [])
    schedulerData.setEvents(data.events ? [...data.events] : [])
    return schedulerData
  }
  const [viewModel, setViewModel] = useState(null)

  useEffect(() => {
    if (!_.isNil(data) && !_.isEmpty(data)) {
      setViewModel(getViewModel(data))
    }
  }, [data])

  const prevClick = (schedulerData) => {
    if (!viewModel) return
    schedulerData.prev()
    schedulerData.setEvents(viewModel.events || [])
    setViewModel({ ...schedulerData })
  }

  const nextClick = (schedulerData) => {
    if (!viewModel) return
    schedulerData.next()
    schedulerData.setEvents(viewModel.events || [])
    setViewModel({ ...schedulerData })
  }

  const onViewChange = (schedulerData, view) => {
    if (!viewModel) return
    schedulerData.setViewType(
      view.viewType,
      view.showAgenda,
      view.isEventPerspective
    )
    schedulerData.setEvents(viewModel.events || [])
    setViewModel({ ...schedulerData })
  }

  const onSelectDate = (schedulerData, date) => {
    if (!viewModel) return
    schedulerData.setDate(date)
    schedulerData.setEvents(viewModel.events || [])
    setViewModel({ ...schedulerData })
  }

  const eventClicked = (schedulerData, event) => {
    alert(
      `You just clicked an event: {id: ${event.id}, title: ${event.title}}`
    )
  }

  const ops1 = (schedulerData, event) => {
    alert(
      `You just executed ops1 to event: {id: ${event.id}, title: ${event.title}}`
    )
  }

  const ops2 = (schedulerData, event) => {
    alert(
      `You just executed ops2 to event: {id: ${event.id}, title: ${event.title}}`
    )
  }

  const newEvent = (schedulerData, slotId, slotName, start, end, type, item) => {
    if (
      window.confirm(
        `Do you want to create a new event? {slotId: ${slotId}, slotName: ${slotName}, start: ${start}, end: ${end}, type: ${type}, item: ${item}}`
      )
    ) {
      let newFreshId = 0
      schedulerData.events.forEach((item) => {
        if (item.id >= newFreshId) newFreshId = item.id + 1
      })

      let newEvent = {
        id: newFreshId,
        title: "New event you just created",
        start: start,
        end: end,
        resourceId: slotId,
        bgColor: "purple",
      }
      schedulerData.addEvent(newEvent)
      setViewModel({ ...schedulerData })
    }
  }

  const updateEventStart = (schedulerData, event, newStart) => {
    if (
      window.confirm(
        `Do you want to adjust the start of the event? {eventId: ${event.id}, eventTitle: ${event.title}, newStart: ${newStart}}`
      )
    ) {
      schedulerData.updateEventStart(event, newStart)
    }
    setViewModel(_.cloneDeep(schedulerData))
  }

  const updateEventEnd = (schedulerData, event, newEnd) => {
    if (
      window.confirm(
        `Do you want to adjust the end of the event? {eventId: ${event.id}, eventTitle: ${event.title}, newEnd: ${newEnd}}`
      )
    ) {
      schedulerData.updateEventEnd(event, newEnd)
    }
    setViewModel(_.cloneDeep(schedulerData))
  }

  const moveEvent = (schedulerData, event, slotId, slotName, start, end) => {
    if (
      window.confirm(
        `Do you want to move the event? {eventId: ${event.id}, eventTitle: ${event.title}, newSlotId: ${slotId}, newSlotName: ${slotName}, newStart: ${start}, newEnd: ${end}`
      )
    ) {
      schedulerData.moveEvent(event, slotId, slotName, start, end)
      setViewModel({ ...schedulerData })
    }
  }

  const onScrollRight = (schedulerData, schedulerContent, maxScrollLeft) => {
    if (!viewModel) return
    if (schedulerData.ViewTypes === ViewTypes.Day) {
      schedulerData.next()
      schedulerData.setEvents(viewModel.events || [])
      setViewModel({ ...schedulerData })

      schedulerContent.scrollLeft = maxScrollLeft - 10
    }
  }

  const onScrollLeft = (schedulerData, schedulerContent, maxScrollLeft) => {
    if (!viewModel) return
    if (schedulerData.ViewTypes === ViewTypes.Day) {
      schedulerData.prev()
      schedulerData.setEvents(viewModel.events || [])
      setViewModel({ ...schedulerData })

      schedulerContent.scrollLeft = 10
    }
  }

  const onScrollTop = (schedulerData, schedulerContent, maxScrollTop) => {
    console.log("onScrollTop")
  }

  const onScrollBottom = (schedulerData, schedulerContent, maxScrollTop) => {
    console.log("onScrollBottom")
  }

  const toggleExpandFunc = (schedulerData, slotId) => {
    schedulerData.toggleExpandStatus(slotId)
    setViewModel({ ...schedulerData })
  }

  return (
    <div>
      <div>
        {viewModel ? <Scheduler
          schedulerData={viewModel}
          prevClick={() => prevClick(viewModel)}
          nextClick={() => nextClick(viewModel)}
          onSelectDate={() => onSelectDate(viewModel)}
          onViewChange={(view) => onViewChange(viewModel, view)}
          eventItemClick={(event) => eventClicked(viewModel, event)}
          viewEventClick={(event) => ops1(viewModel, event)}
          viewEventText="Ops 1"
          viewEvent2Text="Ops 2"
          viewEvent2Click={(event) => ops2(viewModel, event)}
          updateEventStart={(schedulerData, event, newStart) =>
            updateEventStart(schedulerData, event, newStart)
          }
          updateEventEnd={(schedulerData, event, newEnd) =>
            updateEventEnd(schedulerData, event, newEnd)
          }
          moveEvent={(event, slotId, slotName, start, end) =>
            moveEvent(viewModel, event, slotId, slotName, start, end)
          }
          newEvent={(slotId, slotName, start, end, type, item) =>
            newEvent(viewModel, slotId, slotName, start, end, type, item)
          }
          onScrollLeft={() => onScrollLeft(viewModel)}
          onScrollRight={() => onScrollRight(viewModel)}
          onScrollTop={() => onScrollTop(viewModel)}
          onScrollBottom={() => onScrollBottom(viewModel)}
          toggleExpandFunc={(slotId) => toggleExpandFunc(viewModel, slotId)}
        /> : ''}
      </div>
    </div>
  )
}

export default DragDropContext(HTML5Backend)(BasicScheduler)
