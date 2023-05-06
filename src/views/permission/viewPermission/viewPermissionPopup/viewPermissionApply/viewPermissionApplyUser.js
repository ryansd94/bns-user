import { useState, useCallback, useEffect } from "react"
import { useTranslation } from "react-i18next"
import Grid from "@mui/material/Grid"
import { CheckBoxControl } from 'components/checkbox'
import { Group } from 'components/layout'
import ButtonIcon from "components/button/ButtonIcon"
import { EButtonIconType, EPermissionObject } from "configs"

const ViewPermissionApplyUser = (props) => {
    const { users = [], control, setValue, getValues } = props
    const [lstUserAll, setLstUserAll] = useState(users)
    const [lstUserApply, setLstUserApply] = useState([])
    const [disabledSwitchRight, setDisabledSwitchRight] = useState(true)
    const [disabledSwitchLeft, setDisabledSwitchLeft] = useState(true)
    const { t } = useTranslation()

    useEffect(() => {
        setValue('userSelectedIds', _.map(lstUserApply, (x) => { return x.id }))
    }, [lstUserApply])

    useEffect(() => {
        const objects = getValues('objects') || []
        if (!_.isEmpty(objects)) {
            const userApplys = _.filter(objects, (x) => x.objectType === EPermissionObject.user)
            if (!_.isEmpty(userApplys)) {
                const userApplyIds = _.map(userApplys, (x) => { return x.id })
                const lstUserSelected = _.filter(lstUserAll, (x) => _.includes(userApplyIds, x.id))
                const lstUserNotSelected = _.filter(lstUserAll, (x) => !_.includes(userApplyIds, x.id))
                lstUserApply.push(...lstUserSelected)
                setLstUserApply([...lstUserApply])
                setLstUserAll([...lstUserNotSelected])
            }
        }
    }, [])

    const onCheckAllUser = (value) => {
        let userSelected = []
        _.map(lstUserAll, (item) => {
            setValue(item.id, value)
            if (value === true) {
                userSelected.push(item.id)
            }
        })
        setValue('user-selected', userSelected)
        setDisabledSwitchRight(_.isEmpty(userSelected))
    }

    const onCheckAllUserApply = (value) => {
        let userSelected = []
        _.map(lstUserApply, (item) => {
            setValue(`${item.id}-apply`, value)
            if (value === true) {
                userSelected.push(item.id)
            }
        })
        setValue('user-apply-selected', userSelected)
        setDisabledSwitchLeft(_.isEmpty(userSelected))
    }

    const onChangeSelectedUser = (value, userId) => {
        let lstUsersSelected = getValues('user-selected') || []
        if (value === false) {
            setValue('all', false)
            lstUsersSelected = _.filter(lstUsersSelected, (item) => item !== userId)
            setValue('user-selected', lstUsersSelected)
        } else {
            const userSelected = _.find(lstUserAll, (item) => item.id === userId)
            if (!_.isNil(userSelected)) {
                lstUsersSelected.push(userId)
                setValue('user-selected', lstUsersSelected)
            }
        }
        setDisabledSwitchRight(_.isEmpty(lstUsersSelected))
    }

    const onChangeSelectedUserApply = (value, userId) => {
        let lstUsersSelected = getValues('user-apply-selected') || []
        if (value === false) {
            setValue('all-apply', false)
            lstUsersSelected = _.filter(lstUsersSelected, (item) => item !== userId)
            setValue('user-apply-selected', lstUsersSelected)
        } else {
            const userSelected = _.find(lstUserApply, (item) => item.id === userId)
            if (!_.isNil(userSelected)) {
                lstUsersSelected.push(userId)
                setValue('user-apply-selected', lstUsersSelected)
            }
        }
        setDisabledSwitchLeft(_.isEmpty(lstUsersSelected))
    }

    const onSwitchRight = () => {
        const userSelectedIds = getValues('user-selected')
        if (!_.isEmpty(userSelectedIds)) {
            const lstUserSelected = _.filter(lstUserAll, (x) => _.includes(userSelectedIds, x.id))
            const lstUserNotSelected = _.filter(lstUserAll, (x) => !_.includes(userSelectedIds, x.id))
            lstUserApply.push(...lstUserSelected)
            setLstUserApply([...lstUserApply])
            setLstUserAll([...lstUserNotSelected])
            setValue('user-selected', [])
            _.map(lstUserSelected, (item) => {
                setValue(item.id, false)
            })
        }
        setDisabledSwitchRight(true)
        setValue('all', false)
    }

    const onSwitchLeft = () => {
        const userSelectedIds = getValues('user-apply-selected')
        if (!_.isEmpty(userSelectedIds)) {
            const lstUserSelected = _.filter(lstUserApply, (x) => _.includes(userSelectedIds, x.id))
            const lstUserNotSelected = _.filter(lstUserApply, (x) => !_.includes(userSelectedIds, x.id))
            lstUserAll.push(...lstUserSelected)
            setLstUserAll([...lstUserAll])
            setLstUserApply([...lstUserNotSelected])
            setValue('user-apply-selected', [])
            _.map(lstUserSelected, (item) => {
                setValue(`${item.id}-apply`, false)
            })
        }
        setDisabledSwitchLeft(true)
        setValue('all-apply', false)
    }

    const renderAllUsers = () => {
        return <Grid container gap={2} direction='column'>
            <Grid item container direction='row' className="border-bottom">
                <Grid item>
                    <CheckBoxControl disabled={_.isEmpty(lstUserAll) ? true : false} onChange={onCheckAllUser} control={control} name='all' label={t('Tất cả')} />
                </Grid>
            </Grid>
            {
                _.map(lstUserAll, (user) => {
                    return <Grid key={user.id} container direction='row'>
                        <Grid item>
                            <CheckBoxControl onChange={(value) => onChangeSelectedUser(value, user.id)} control={control} name={user.id} />
                        </Grid>
                        <Grid xs item container gap={2}>
                            <Grid item container direction='row' gap={2}>
                                <Grid item>
                                    {user.fullName}
                                </Grid>
                                <Grid item className='italic'>
                                    {user.email}
                                </Grid>
                            </Grid>
                            <Grid item className='faint'>no team
                            </Grid>
                        </Grid>
                    </Grid>
                })
            }
        </Grid>
    }

    const renderUserApply = useCallback(() => {
        return <Grid container gap={2} direction='column'>
            <Grid item container direction='row' className="border-bottom">
                <Grid item>
                    <CheckBoxControl disabled={_.isEmpty(lstUserApply) ? true : false} onChange={onCheckAllUserApply} control={control} name='all-apply' label={t('Tất cả')} />
                </Grid>
            </Grid>
            {
                _.map(lstUserApply, (user) => {
                    return <Grid key={user.id} container direction='row'>
                        <Grid item>
                            <CheckBoxControl onChange={(value) => onChangeSelectedUserApply(value, user.id)} control={control} name={`${user.id}-apply`} />
                        </Grid>
                        <Grid xs item container gap={2}>
                            <Grid item container direction='row' gap={2}>
                                <Grid item>
                                    {user.fullName}
                                </Grid>
                                <Grid item className='italic'>
                                    {user.email}
                                </Grid>
                            </Grid>
                            <Grid item className='faint'>no team
                            </Grid>
                        </Grid>
                    </Grid>
                })
            }
        </Grid>
    }, [lstUserApply])

    return <Grid container direction='row'>
        <Grid item xs className='body-content'>
            <Group content={renderAllUsers()} title={t('Danh sách người dùng')} />
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
            <Group content={renderUserApply()} title={t('Danh sách người dùng được áp dụng')} />
        </Grid>
    </Grid>
}

export default ViewPermissionApplyUser