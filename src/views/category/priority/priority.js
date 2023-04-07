import React, { useState, useEffect } from "react"
import PriorityPopup from "./priorityPopup"
import PriorityGrid from "./priorityGrid"
import { useTranslation } from "react-i18next"
import { useDispatch, useSelector } from "react-redux"
import { Resizable } from 'components/resizable'
import PriorityToolbar from "./priorityToolbar"
import { get } from "services"
import { baseUrl } from "configs"
import _ from 'lodash'
import Connector from 'helpers/signalRConnection'

const Priority = React.memo(() => {
  const { t } = useTranslation()
  const [filterModels, setFilterModels] = useState(null)
  const [checkStatus, setCheckStatus] = useState({})
  const isReload = useSelector((state) => state.master.isReload)
  const { newMessage, events } = Connector();
  const [message, setMessage] = useState("initial value");

  useEffect(() => {
    events((_, message) => setMessage(message));
  });

  const onApplyFilter = (value) => {
    setFilterModels(value)
  }

  const genderLeftComponent = () => {
    return <PriorityGrid filterModels={filterModels} />
  }

  return (
    // <div className="body-content">
    //   <PriorityToolbar onApplyFilter={onApplyFilter} />
    //   <Resizable genderLeftComponent={genderLeftComponent} />
    //   <PriorityPopup checkStatus={checkStatus}/>
    // </div>
    <div className="App">
      <span>message from signalR: <span style={{ color: "green" }}>{message}</span> </span>
      <br />
      {/* <button onClick={() => newMessage((new Date()).toISOString())}>send date </button> */}
    </div>
  )
})

export default Priority
