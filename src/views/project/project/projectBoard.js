import React, { useEffect, useState } from "react"
import { baseUrl } from "configs"
import _ from 'lodash'
import Grid from "@mui/material/Grid"
import { get, save } from "services"
import { getUserInfo, setUserInfo } from "helpers"
import { useHistory } from "react-router-dom"
import ProjectEmptyView from './projectEmptyView'
import Spinner from 'components/shared/Spinner'

const ProjectBoard = () => {
    const [projects, setProjects] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const history = useHistory()
    let user = getUserInfo()

    useEffect(() => {
        let mounted = true
        const getStatus = async () => {
            await get(baseUrl.jm_project, { isGetAll: true }).then((data) => {
                setProjects(data && data.data && data.data.items)
                setIsLoading(false)
            })
        }
        getStatus()
        return () => { mounted = false }
    }, [])

    const onProjectClick = (item) => {
        console.log({ ...item })
        save(`${baseUrl.jm_user}/me`, { id: user.userId, configs: [{ key: 'ProjectSetting.Current', value: item.code },{ key: 'ProjectSetting.CurrentId', value: item.id }] })
        user.setting.projectSetting.current = item.code
        user.setting.projectSetting.currentId = item.id
        setUserInfo({ user: user })
        history.push(`/${user.defaultOrganization}/${item.code}/overview/summary`)
    }

    const renderData = () => {
        return _.map(projects, (item) => {
            return <Grid xs key={item.id} onClick={() => onProjectClick(item)} item gap={2} className='project-board-item'>
                {item.name}
            </Grid>
        })
    }

    const renderProjectGrid = () => {
        return <Grid xs container item><div>{renderData()}</div>
        </Grid>
    }

    return isLoading ? <Spinner /> : (_.isEmpty(projects) ? <ProjectEmptyView /> : renderProjectGrid())
}

export default ProjectBoard