import React, { useState, useEffect } from "react"
import ViewPermissionToolbar from "./viewPermissionToolbar"
import { Resizable } from 'components/resizable'
import ViewPermissionGrid from './viewPermissionGrid'
import { baseUrl } from "configs"
import { get } from "services"

const ViewPermission = () => {
  const [filterModels, setFilterModels] = useState(null)
  const [users, setUsers] = useState([])
  const [teams, setTeams] = useState([])

  useEffect(() => {
    let mounted = true
    const getUsers = async () => {
      await get(`${baseUrl.sys_viewPermission}/users`, { isGetAll: true }).then((data) => {
        setUsers(data && data.data && data.data.items)
      })
    }
    const getTeams = async () => {
      await get(`${baseUrl.sys_viewPermission}/teams`, { isGetAll: true }).then((data) => {
        setTeams(data && data.data && data.data.items)
      })
    }
    getUsers()
    getTeams()
    return () => { mounted = false }
  }, [])

  const onApplyFilter = (value) => {
    setFilterModels(value)
  }

  const genderLeftComponent = () => {
    return <ViewPermissionGrid filterModels={filterModels} />
  }

  return (
    <div className="body-content">
      <ViewPermissionToolbar users={users} teams={teams} onApplyFilter={onApplyFilter} />
      <Resizable className='' genderLeftComponent={genderLeftComponent} />
    </div>
  )
}

export default ViewPermission
