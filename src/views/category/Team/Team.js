import React, { useState, useEffect, useCallback } from "react"
import TeamDataGrid from "./TeamDataGrid"
import { useTranslation } from "react-i18next"
import { get } from "services"
import {
  setLoading,
} from "stores/views/master"
import { useSelector, useDispatch } from "react-redux"
import TeamToolbar from "./teamToolbar"
import { Resizable } from 'components/resizable'
import { baseUrl } from "configs"

const Team = React.memo(() => {
  console.log("render Team")
  const { t } = useTranslation()
  const [data, setData] = React.useState({})
  const page = useSelector((state) => state.master.page)
  const sortModel = useSelector((state) => state.master.sortModel)
  const isReload = useSelector((state) => state.master.isReload)
  const [dataTeam, setDataTeam] = React.useState([])
  const [filterModels, setFilterModels] = useState([])
  const dispatch = useDispatch()

  const fetchDataTeam = async () => {
    await get(baseUrl.jm_team, {
      draw: 0,
      start: 0,
      length: 10000,
    }).then((data) => {
      setDataTeam(data && data.data && data.data.items)
    })
  }

  useEffect(() => {
    fetchData()
  }, [page, sortModel, isReload, filterModels])

  useEffect(() => {
    fetchDataTeam()
  }, [isReload])

  const fetchData = async () => {
    dispatch(setLoading(true))
    await get(baseUrl.jm_team,{
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

  const onApplyFilter = (value) => {
    setFilterModels(value)
  }

  const genderLeftComponent = () => {
    return <TeamDataGrid data={data} />
  }

  return (
    <div>
      {/* <ToolBar visible={VisibleDefault} onAddClick={handleClickOpen} />

      <div className={cx("containerNew")}>
        <div className={cx("body")}>
          <div className={cx("content", "panelNew")}>
            <TeamDataGrid data={data} />
          </div>
          <div hidden={true}>
            <ResizePanel
              direction="w"
              style={{ width: "400px" }}
              handleClass={style.customHandle}
              borderClass={style.customResizeBorder}
            >
              <div className={cx("sidebarNew", "panelNew")}></div>
            </ResizePanel>
          </div>
        </div>
      </div>

      <TeamPopup dataTeam={dataTeam} /> */}
      <TeamToolbar dataTeam={dataTeam} onApplyFilter={onApplyFilter} />
      <Resizable genderLeftComponent={genderLeftComponent} />
    </div>
  )
})

export default Team
