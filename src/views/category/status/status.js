import React, { useEffect, useState } from "react"
import ToolBar from "../../../components/toolbar/ToolBar"
import StatusPopup from "./statusPopup"
import StatusGrid from "./statusGrid"
import { useTranslation } from "react-i18next"
import { get } from "services"
import {
  setLoading,
} from "stores/views/master"
import { useSelector, useDispatch } from "react-redux"
import { baseUrl } from "configs"
import { Resizable } from 'components/resizable'
import StatusToolbar from "./statusToolbar"

const Status = React.memo(() => {
  const { t } = useTranslation()
  const [data, setData] = useState({})
  const page = useSelector((state) => state.master.page)
  const sortModel = useSelector((state) => state.master.sortModel)
  const isReload = useSelector((state) => state.master.isReload)
  const [dataTeam, setDataTeam] = useState([])
  const [filterModels, setFilterModels] = useState([])

  const onApplyFilter = (value) => {
    setFilterModels(value)
  }

  const dispatch = useDispatch()

  useEffect(() => {
    fetchData()
  }, [page, sortModel, isReload, filterModels])

  const fetchData = async () => {
    dispatch(setLoading(true))
    await get(baseUrl.jm_status, {
      draw: page,
      start: page == 0 ? 0 : page * 10,
      length: 10,
      fieldSort:
        sortModel != null && sortModel.length > 0 ? sortModel[0].field : "",
      sort: sortModel != null && sortModel.length > 0 ? sortModel[0].sort : "",
      filters: JSON.stringify(filterModels)
    }).then((data) => {
      setData(data)
      dispatch(setLoading(false))
    })
  }

  const genderLeftComponent = () => {
    return <StatusGrid data={data} filterModels={filterModels} />
  }

  return (
    <div>
      <StatusToolbar onApplyFilter={onApplyFilter} />
      <Resizable genderLeftComponent={genderLeftComponent} />
      <StatusPopup dataTeam={dataTeam} />
    </div>
  )
})

export default Status
