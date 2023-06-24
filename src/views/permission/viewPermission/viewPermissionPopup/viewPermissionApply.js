import { useState, useEffect } from 'react'
import { AccordionControl } from 'components/accordion'
import { useTranslation } from "react-i18next"
import { TransferList } from 'components/transferList'
import Grid from "@mui/material/Grid"
import { EPermissionObject } from "configs"

const ViewPermissionApply = (props) => {
    console.log("render ViewPermissionApply")
    const { users = [], teams = [], control, setValue, getValues } = props
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
        return <Grid xs item container gap={2}>
            <Grid item container direction='row' gap={2}>
                <Grid item>
                    {data.fullName}
                </Grid>
                <Grid item className='italic'>
                    {data.email}
                </Grid>
            </Grid>
            <Grid item className='faint'>{t('no team')}
            </Grid>
        </Grid>
    }

    const renderTeamItem = (data) => {
        return <Grid xs item container gap={2}>
            <Grid item container direction='row' gap={2}>
                <Grid item>
                    {data.name}
                </Grid>
            </Grid>
            <Grid item className='faint'>no department
            </Grid>
        </Grid>
    }

    return <>
        <Grid container gap={2} className='no-wrap' direction='column'>
            <Grid item>
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
                            setValueData={setValue}
                            leftTitle={t('User list')}
                            rightTitle={t('List of applicable users')}
                            setValueName={'userSelectedIds'} />
                    }
                />
            </Grid>
            <Grid item>
                <AccordionControl
                    isExpand={true}
                    title={t('Team')}
                    name={'teams'}
                    details={
                        <TransferList 
                        renderItem={(data) => renderTeamItem(data)} 
                        itemApllyIds={teamSelectedIds} 
                        items={teams} 
                        control={control} 
                        setValueData={setValue} 
                        leftTitle={t('Team list')}
                        rightTitle={t('List of applicable teams')}
                        setValueName={'teamSelectedIds'} />
                    }
                />
            </Grid>
        </Grid>
    </>
}
export default ViewPermissionApply