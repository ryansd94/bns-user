import React, { useState, useEffect } from "react"
import StatusPopup from "./statusPopup"
import StatusGrid from "./statusGrid"
import { useTranslation } from "react-i18next"
import { Resizable } from "components/resizable"
import StatusToolbar from "./statusToolbar"
import { Alert } from "components/alert"
import { EAlertType } from "configs/enums"
import { get } from "services"
import { baseUrl } from "configs"
import { useQuery } from "@tanstack/react-query"
import { useSelector } from "react-redux"
import _ from "lodash"

const Status = () => {
  const { t } = useTranslation()
  const [filterModels, setFilterModels] = useState(null)
  const isReload = useSelector((state) => state.master.isReload)

  const onApplyFilter = (value) => {
    setFilterModels(value)
  }

  const renderLeftComponent = () => {
    return <StatusGrid filterModels={filterModels} />
  }

  const { data: checkStatus, refetch: refetchCheckStatus } = useQuery({
    queryKey: ['checkStaus'],
    queryFn: () => getStatus(),
    enabled: false
  })

  const getStatus = async () => {
    return await get(`${baseUrl.jm_status}/check`).then((data) => {
      return data && data.data
    })
  }

  useEffect(() => {
    refetchCheckStatus()
  }, [isReload])

  const renderMessageStatus = () => {
    if (!_.isEmpty(checkStatus)) {
      let messageArray = []
      if (checkStatus.isStatusStart === false) {
        messageArray.push(t("Start status"))
      }
      if (checkStatus.isStatusEnd === false) {
        messageArray.push(t("End status"))
      }
      if (!_.isEmpty(messageArray)) {
        let message = _.join(messageArray, ", ")
        return (
          <div>
            {`${t("The system does not yet have")} `}
            {<b>{message}</b>}, {t("Please add new")}
          </div>
        )
      }
    }
    return ""
  }

  return (
    <div className="body-content">
      <StatusToolbar onApplyFilter={onApplyFilter} />
      <Alert type={EAlertType.warning} message={renderMessageStatus()} />
      <Resizable renderLeftComponent={renderLeftComponent} />
      <StatusPopup checkStatus={checkStatus} />
    </div>
  )
}

export default Status
