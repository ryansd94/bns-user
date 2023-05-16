import { useState, useCallback, useEffect } from "react"
import { useTranslation } from "react-i18next"
import Grid from "@mui/material/Grid"
import { CheckBoxControl } from 'components/checkbox'
import { Group } from 'components/layout'
import ButtonIcon from "components/button/ButtonIcon"
import { EButtonIconType, EPermissionObject } from "configs"

const ViewPermissionApplyTeam = (props) => {
    const { teams = [], control, setValue, getValues } = props
    const [lstTeamAll, setLstTeamAll] = useState(teams)
    const [lstTeamApply, setLstTeamApply] = useState([])
    const [disabledSwitchRight, setDisabledSwitchRight] = useState(true)
    const [disabledSwitchLeft, setDisabledSwitchLeft] = useState(true)
    const { t } = useTranslation()

    useEffect(() => {
        setValue('teamSelectedIds', _.map(lstTeamApply, (x) => { return x.id }))
    }, [lstTeamApply])

    useEffect(() => {
        const objects = getValues('objects') || []
        if (!_.isEmpty(objects)) {
            const teamApplys = _.filter(objects, (x) => x.objectType === EPermissionObject.team)
            if (!_.isEmpty(teamApplys)) {
                const teamApplyIds = _.map(teamApplys, (x) => { return x.id })
                const lstTeamSelected = _.filter(lstTeamAll, (x) => _.includes(teamApplyIds, x.id))
                const lstTeamNotSelected = _.filter(lstTeamAll, (x) => !_.includes(teamApplyIds, x.id))
                lstTeamApply.push(...lstTeamSelected)
                setLstTeamApply([...lstTeamApply])
                setLstTeamAll([...lstTeamNotSelected])
            }
        }
    }, [])

    const onCheckAllTeam = (value) => {
        let teamSelected = []
        _.map(lstTeamAll, (item) => {
            setValue(item.id, value)
            if (value === true) {
                teamSelected.push(item.id)
            }
        })
        setValue('team-selected', teamSelected)
        setDisabledSwitchRight(_.isEmpty(teamSelected))
    }

    const onCheckAllUserApply = (value) => {
        let teamSelected = []
        _.map(lstTeamApply, (item) => {
            setValue(`${item.id}-apply`, value)
            if (value === true) {
                teamSelected.push(item.id)
            }
        })
        setValue('team-apply-selected', teamSelected)
        setDisabledSwitchLeft(_.isEmpty(teamSelected))
    }

    const onChangeSelectedTeam = (value, userId) => {
        let lstTeamsSelected = getValues('team-selected') || []
        if (value === false) {
            setValue('team-all', false)
            lstTeamsSelected = _.filter(lstTeamsSelected, (item) => item !== userId)
            setValue('team-selected', lstTeamsSelected)
        } else {
            const teamSelected = _.find(lstTeamAll, (item) => item.id === userId)
            if (!_.isNil(teamSelected)) {
                lstTeamsSelected.push(userId)
                setValue('team-selected', lstTeamsSelected)
            }
        }
        setDisabledSwitchRight(_.isEmpty(lstTeamsSelected))
    }

    const onChangeSelectedTeamApply = (value, userId) => {
        let lstTeamsSelected = getValues('team-apply-selected') || []
        if (value === false) {
            setValue('team-all-apply', false)
            lstTeamsSelected = _.filter(lstTeamsSelected, (item) => item !== userId)
            setValue('team-apply-selected', lstTeamsSelected)
        } else {
            const teamSelected = _.find(lstTeamApply, (item) => item.id === userId)
            if (!_.isNil(teamSelected)) {
                lstTeamsSelected.push(userId)
                setValue('team-apply-selected', lstTeamsSelected)
            }
        }
        setDisabledSwitchLeft(_.isEmpty(lstTeamsSelected))
    }

    const onSwitchRight = () => {
        const teamSelectedIds = getValues('team-selected')
        if (!_.isEmpty(teamSelectedIds)) {
            const lstTeamSelected = _.filter(lstTeamAll, (x) => _.includes(teamSelectedIds, x.id))
            const lstTeamNotSelected = _.filter(lstTeamAll, (x) => !_.includes(teamSelectedIds, x.id))
            lstTeamApply.push(...lstTeamSelected)
            setLstTeamApply([...lstTeamApply])
            setLstTeamAll([...lstTeamNotSelected])
            setValue('team-selected', [])
            _.map(lstTeamSelected, (item) => {
                setValue(item.id, false)
            })
        }
        setDisabledSwitchRight(true)
        setValue('team-all', false)
    }

    const onSwitchLeft = () => {
        const teamSelectedIds = getValues('team-apply-selected')
        if (!_.isEmpty(teamSelectedIds)) {
            const lstTeamSelected = _.filter(lstTeamApply, (x) => _.includes(teamSelectedIds, x.id))
            const lstTeamNotSelected = _.filter(lstTeamApply, (x) => !_.includes(teamSelectedIds, x.id))
            lstTeamAll.push(...lstTeamSelected)
            setLstTeamAll([...lstTeamAll])
            setLstTeamApply([...lstTeamNotSelected])
            setValue('team-apply-selected', [])
            _.map(lstTeamSelected, (item) => {
                setValue(`${item.id}-apply`, false)
            })
        }
        setDisabledSwitchLeft(true)
        setValue('team-all-apply', false)
    }

    const renderAllTeams = () => {
        return <Grid container gap={2} direction='column'>
            <Grid item container direction='row' className="border-bottom">
                <Grid item>
                    <CheckBoxControl disabled={_.isEmpty(lstTeamAll) ? true : false} onChange={onCheckAllTeam} control={control} name='team-all' label={t('All')} />
                </Grid>
            </Grid>
            {
                _.map(lstTeamAll, (user) => {
                    return <Grid key={user.id} container direction='row'>
                        <Grid item>
                            <CheckBoxControl onChange={(value) => onChangeSelectedTeam(value, user.id)} control={control} name={user.id} />
                        </Grid>
                        <Grid xs item container gap={2}>
                            <Grid item container direction='row' gap={2}>
                                <Grid item>
                                    {user.name}
                                </Grid>
                                <Grid item className='italic'>
                                    {user.email}
                                </Grid>
                            </Grid>
                            <Grid item className='faint'>no department
                            </Grid>
                        </Grid>
                    </Grid>
                })
            }
        </Grid>
    }

    const renderTeamApply = useCallback(() => {
        return <Grid container gap={2} direction='column'>
            <Grid item container direction='row' className="border-bottom">
                <Grid item>
                    <CheckBoxControl  disabled={_.isEmpty(lstTeamApply) ? true : false} onChange={onCheckAllUserApply} control={control} name='team-all-apply' label={t('All')} />
                </Grid>
            </Grid>
            {
                _.map(lstTeamApply, (user) => {
                    return <Grid key={user.id} container direction='row'>
                        <Grid item>
                            <CheckBoxControl onChange={(value) => onChangeSelectedTeamApply(value, user.id)} control={control} name={`${user.id}-apply`} />
                        </Grid>
                        <Grid xs item container gap={2}>
                            <Grid item container direction='row' gap={2}>
                                <Grid item>
                                    {user.name}
                                </Grid>
                                <Grid item className='italic'>
                                    {user.email}
                                </Grid>
                            </Grid>
                            <Grid item className='faint'>no department
                            </Grid>
                        </Grid>
                    </Grid>
                })
            }
        </Grid>
    }, [lstTeamApply])

    return <Grid container direction='row'>
        <Grid item xs className='body-content'>
            <Group content={renderAllTeams()} title={t('Team list')} />
        </Grid>
        <Grid item className='body-content' gap={2} justifyContent='center' flexDirection={'column'} flexGrow={0}>
            <Grid item>
                <ButtonIcon color={'primary'} onClick={onSwitchRight} disabled={disabledSwitchRight} type={EButtonIconType.switchRight} />
            </Grid>
            <Grid item>
                <ButtonIcon color={'primary'} onClick={onSwitchLeft} disabled={disabledSwitchLeft} type={EButtonIconType.switchLeft} />
            </Grid>
        </Grid>
        <Grid item xs className='body-content'>
            <Group content={renderTeamApply()} title={t('List of applicable teams')} />
        </Grid>
    </Grid>
}

export default ViewPermissionApplyTeam