import React, { useState, useEffect } from "react"
import TeamDataGrid from "./TeamDataGrid"
import TeamToolbar from "./teamToolbar"
import { Resizable } from 'components/resizable'
import { baseUrl } from "configs"
import { get } from "services"

const Team = React.memo(() => {
  console.log("render Team")
  const [filterModels, setFilterModels] = useState(null)
  const [users, setDataUser] = useState([])

  const onApplyFilter = (value) => {
    setFilterModels(value)
  }

  const genderLeftComponent = () => {
    return <TeamDataGrid filterModels={filterModels} />
  }

  const fetchDataUser = async () => {
    await get(`${baseUrl.jm_team}/users`, {
      isGetAll: true
    }).then((data) => {
      const users = data && data.data && data.data.items
      setDataUser(users)
    })
  }

  useEffect(() => {
    fetchDataUser()
  }, [])


  return (
    <div className="body-content">
      <TeamToolbar dataUsers={users} onApplyFilter={onApplyFilter} />
      <Resizable genderLeftComponent={genderLeftComponent} />
    </div>
  )
})

export default Team
