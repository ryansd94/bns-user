import React, { useState, useEffect } from "react"
import StatusPopup from "./statusPopup"
import StatusGrid from "./statusGrid"
import { useTranslation } from "react-i18next"
import { useDispatch, useSelector } from "react-redux"
import { Resizable } from 'components/resizable'
import StatusToolbar from "./statusToolbar"
import { Alert } from 'components/alert'
import { EAlertType } from 'configs/constants'
import { get } from "services"
import { baseUrl } from "configs"
import _ from 'lodash'

const Status = React.memo(() => {
  const { t } = useTranslation()
  const [filterModels, setFilterModels] = useState(null)
  const [checkStatus, setCheckStatus] = useState({})
  const isReload = useSelector((state) => state.master.isReload)

  const onApplyFilter = (value) => {
    setFilterModels(value)
  }

  const genderLeftComponent = () => {
    return <StatusGrid filterModels={filterModels} />
  }

  useEffect(() => {
    let mounted = true
    const getStatus = async () => {
      await get(`${baseUrl.jm_status}/check`).then((data) => {
        setCheckStatus(data && data.data)
      })
    }
    getStatus()
    return () => { mounted = false }
  }, [isReload])

  const renderMessageStatus = () => {
    if (!_.isEmpty(checkStatus)) {
      let messageArray = []
      if (checkStatus.isStatusStart === false) {
        messageArray.push('trạng thái bắt đầu')
      }
      if (checkStatus.isStatusEnd === false) {
        messageArray.push('trạng thái kết thúc')
      }
      if (!_.isEmpty(messageArray)) {
        let message = _.join(messageArray, ', ')
        return <div>Hệ thống chưa tồn tại {<b>{message}</b>}, vui lòng thêm mới</div>
      }
    }
    return ''
  }

  return (
    <div className="body-content">
      <StatusToolbar onApplyFilter={onApplyFilter} />
      <Alert type={EAlertType.warning} message={renderMessageStatus()} />
      <Resizable genderLeftComponent={genderLeftComponent} />
      <StatusPopup checkStatus={checkStatus}/>
    </div>
  )
})

export default Status
