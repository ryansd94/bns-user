import { useState, useEffect } from 'react'
import Grid from "@mui/material/Grid"
import { useTranslation } from "react-i18next"
import _ from 'lodash'
import { TransferList } from 'components/transferList'
import { AccordionControl } from 'components/accordion'
import { EPermissionObject } from "configs"

const ProjectMemberTab = (props) => {
    const { control, setValue, getValues, users, teams, onValueChange } = props
    const { t } = useTranslation()

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
                        renderItem={(data) => renderTeamItem(data)}
                        items={teams}
                        control={control}
                        leftTitle={t('Team list')}
                        rightTitle={t('List of applicable teams')}
                        setValueData={setValue}
                        onChange={onValueChange}
                        getValueData={getValues}
                        name={'teams'} />
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
                        items={users}
                        control={control}
                        leftTitle={t('User list')}
                        rightTitle={t('List of applicable users')}
                        setValueData={setValue}
                        onChange={onValueChange}
                        getValueData={getValues}
                        name={'members'} />
                }
            />
        </Grid>
    </Grid>
}

export default ProjectMemberTab