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
  const [filterModels, setFilterModels] = useState([])
  const dispatch = useDispatch()

  const onApplyFilter = (value) => {
    setFilterModels(value)
  }

  const genderLeftComponent = () => {
    return <TeamDataGrid filterModels={filterModels} />
  }

  return (
    <div>
      <TeamToolbar onApplyFilter={onApplyFilter} />
      <Resizable genderLeftComponent={genderLeftComponent} />
    </div>
  )
})

export default Team
