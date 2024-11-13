
import React, { useEffect, useState, useRef } from "react"
import BasicScheduler from "components/scheduler/basicScheduler"
import { useQuery } from "@tanstack/react-query"
import { baseUrl } from "configs"
import { get } from "services"
import { getUserInfo } from "helpers"

const TaskCalendar = () => {
  const user = getUserInfo()
  const { data: taskCalendar, refetch: refetchGetTaskCalendar } = useQuery({
    queryKey: ['getTaskCalendar'],
    queryFn: async () => await getTaskCalendar(),
    enabled: false
  })

  useEffect(async () => {
    refetchGetTaskCalendar()
  }, [])

  const getTaskCalendar = async () => {
    return await get(`${baseUrl.jm_taskCalendar}`, {
      projectId: user?.setting?.projectSetting?.currentId
    }).then((data) => {
      return data && data.data && data.data.items[0]
    })
  }

  return <BasicScheduler data={taskCalendar || {}} />
}

export default TaskCalendar