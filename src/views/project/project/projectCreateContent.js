import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import _ from 'lodash'
import { TabControl } from 'components/tab'
import { ProjectInfoTab, ProjectSprintTab, ProjectMemberTab } from "./components"
import { baseUrl } from "configs"
import { get } from "services"

const ProjectCreateContent = (props) => {
    console.log('render ProjectCreateContent')
    const { control, setValue, getValues } = props
    const { t } = useTranslation()
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

    const getTabItems = () => {
        const data = [
            {
                label: t('Infomations'),
                Content: <ProjectInfoTab control={control} />
            },
            // {
            //     label: t('Sprint'),
            //     Content: <ProjectSprintTab control={control} />
            // },
            {
                label: t('Members'),
                Content: <ProjectMemberTab 
                getValues={getValues} 
                setValue={setValue} 
                users={users} 
                teams={teams}
                control={control} />
            }
        ]
        return data
    }

    return <TabControl
        tabItems={getTabItems()} />
}

export default ProjectCreateContent