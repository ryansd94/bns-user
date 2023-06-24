import { useState, useEffect } from 'react'
import Grid from "@mui/material/Grid"
import { useTranslation } from "react-i18next"
import _ from 'lodash'
import { TransferList } from 'components/transferList'
import { AccordionControl } from 'components/accordion'
import { EPermissionObject } from "configs"

const ProjectMemberTab = (props) => {
    const { control, setValue, getValues, users, teams } = props
    const { t } = useTranslation()
    const [userSelectedIds, setUserSelectedIds] = useState([])
    const [teamSelectedIds, setTeamSelectedIds] = useState([])

    useEffect(() => {
        const objects = getValues('objects')
        if (!_.isEmpty(objects)) {
            const userApplys = _.map(_.filter(objects, (x) => x.objectType === EPermissionObject.user), (a) => { return a.id })
            const teamApplys = _.map(_.filter(objects, (x) => x.objectType === EPermissionObject.team), (a) => { return a.id })
            setUserSelectedIds(userApplys)
            setTeamSelectedIds(teamApplys)
        }
    }, [])

    const renderUserItem = (data) => {
        return <Grid xs item container gap={2} direction='column'>
            <Grid item container direction='row' gap={2}>
                <Grid item>
                    {data.fullName}
                </Grid>
                <Grid item className='italic of-hidden ellipsis'>
                    {data.email}
                </Grid>
            </Grid>
            <Grid item className='faint'>{t('no team')}
            </Grid>
        </Grid>
    }

    return <Grid container gap={2} direction='column' className='no-wrap'>
        <Grid item xs>
            <AccordionControl
                isExpand={true}
                title={t('Teams')}
                name={'teams'}
                details={
                    <TransferList
                        renderItem={(data) => renderUserItem(data)}
                        itemApllyIds={teamSelectedIds}
                        items={teams}
                        control={control}
                        leftTitle={t('Team list')}
                        rightTitle={t('List of applicable teams')}
                        setValueData={setValue}
                        setValueName={'teams'} />
                }
            />
        </Grid>
        <Grid item xs>
            <AccordionControl
                isExpand={true}
                title={t('Users')}
                name={'users'}
                details={
                    <TransferList
                        renderItem={(data) => renderUserItem(data)}
                        itemApllyIds={userSelectedIds}
                        items={users}
                        control={control}
                        leftTitle={t('User list')}
                        rightTitle={t('List of applicable users')}
                        setValueData={setValue}
                        setValueName={'members'} />
                }
            />
        </Grid>
    </Grid>
}

export default ProjectMemberTab