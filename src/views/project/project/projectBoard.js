import React, { useEffect, useState } from "react"
import { baseUrl } from "configs"
import _ from 'lodash'
import Grid from "@mui/material/Grid"
import { get, save } from "services"
import { getUserInfo, setUserInfo } from "helpers"
import { useHistory } from "react-router-dom"
import ProjectEmptyView from './projectEmptyView'
import Spinner from 'components/shared/Spinner'
import { setUserSetting } from "stores/views/master"
import { useDispatch } from "react-redux"
import { AvatarControl } from 'components/avatar'
import { EControlVariant } from "configs"
import { DatePickerInput } from 'components/datepicker'
import { useTranslation } from "react-i18next"

const ProjectBoard = () => {
    const [projects, setProjects] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const dispatch = useDispatch()
    const history = useHistory()
    const { t } = useTranslation()
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
        save(`${baseUrl.jm_user}/me`, { id: user.userId, configs: [{ key: 'ProjectSetting.Current', value: item.code }, { key: 'ProjectSetting.CurrentId', value: item.id }] })
        user.setting.projectSetting.current = item.code
        user.setting.projectSetting.currentId = item.id
        setUserInfo({ user: user })
        dispatch(setUserSetting({ setting: { projectSetting: { current: item.code, currentId: item.id } } }))
        history.push(`/${user.defaultOrganization}/${item.code}/overview/summary`)
    }

    const renderData = () => {
        return _.map(projects, (item) => {
            return <Grid container direction='column' item key={item.id} gap={2} onClick={() => onProjectClick(item)} className='project-board-item'>
                <Grid container item xs gap={2} alignItems={'center'}>
                    <Grid item>
                        <AvatarControl variant={EControlVariant.rounded} name={item.code} />
                    </Grid>
                    <Grid item xs>{item.name}</Grid>
                </Grid>
                <Grid item container direction={'row'} gap={2}>
                    <Grid item xs>
                        <DatePickerInput
                            label={t("Start date")}
                            disabled={true}
                            readOnly={true}
                            isShowPlacholder={false}
                            defaultValue={item.startDate} />
                    </Grid>
                    <Grid item xs>
                        <DatePickerInput
                            label={t("End date")}
                            readOnly={true}
                            disabled={true}
                            isShowPlacholder={false}
                            defaultValue={item.endDate} />
                    </Grid>
                </Grid>
            </Grid>
        })
    }

    const renderProjectGrid = () => {
        return <div className="body-content-item">
            <Grid container className="no-wrap" gap={2}>{renderData()}
            </Grid>
        </div>
    }

    return isLoading ? <Spinner /> : (_.isEmpty(projects) ? <ProjectEmptyView /> : renderProjectGrid())
}

export default ProjectBoard