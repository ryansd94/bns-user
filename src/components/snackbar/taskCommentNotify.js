import React from 'react'
import Grid from "@mui/material/Grid"
import { useTranslation } from "react-i18next"
import { useSnackbar } from "notistack"
import ButtonIcon from "components/button/ButtonIcon"
import { EButtonIconType, ENotifyObjectType } from "configs"
import LabelIconControl from 'components/label/labelIconControl'
import { LinkControl } from 'components/link'
import { getPathItem } from "helpers"
import { AvatarControl } from "components/avatar"

const TaskCommentNotify = React.forwardRef(function TaskCommentNotify(props, ref) {
    const { data, id } = props
    const { closeSnackbar } = useSnackbar()
    const { t } = useTranslation()

    const renderTaskItem = () => {
        return <Grid container gap={1} flexWrap='nowrap'>
            <Grid item>
                <LabelIconControl icon={data.content.TaskContent.TaskType.Icon} color={data.content.TaskContent.TaskType.Color} />
            </Grid>
            <Grid item>
                {data.content.TaskContent.Title}
            </Grid>
        </Grid>
    }

    const getTitleNotify = () => {
        if (data.type === ENotifyObjectType.taskComment) {
            return ` ${t('mentioned you in a comment')}`
        } else {
            return ` ${t('assign task to you')}`
        }
    }

    const renderContent = () => {
        return <Grid container direction={'column'}>
            <Grid item>
                <b className='notify-mention'>{data.content.UserMention.FullName}</b>
                <span className='notify-title'>{getTitleNotify()}</span>
            </Grid>
            <Grid item>
                {renderTaskItem()}
            </Grid>
        </Grid>
    }

    const getTaskUrl = () => {
        return getPathItem(`/task/edit/${data.content.TaskContent.Id}?viewId=${data.objectId}`)
    }

    return <>
        <Grid className='notify-container' ref={ref} container gap={2}>
            <Grid item>
                <AvatarControl name={data.content.UserMention.FullName} image={data.content.UserMention.Image} />
            </Grid>
            <Grid item className='notify-content'>
                <LinkControl className='notify-link' href={getTaskUrl()} title={renderContent()} />
            </Grid>
            <ButtonIcon showTooltip={false} className='close-notify-icon' type={EButtonIconType.close} onClick={() => closeSnackbar(id)} />
        </Grid>
    </>
})

export default TaskCommentNotify