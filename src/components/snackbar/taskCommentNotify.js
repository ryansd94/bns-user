import React, { useState } from 'react'
import Grid from "@mui/material/Grid"
import { useTranslation } from "react-i18next"
import { useSnackbar } from "notistack"
import ButtonIcon from "components/button/ButtonIcon"
import { EButtonIconType, ENotifyObjectType, ENotifyComponentType, baseUrl } from "configs"
import LabelIconControl from 'components/label/labelIconControl'
import { LinkControl } from 'components/link'
import { getPathItem, formatDistanceDate } from "helpers"
import { AvatarControl } from "components/avatar"
import { StatusIcon } from 'components/notify/icon'
import { put } from "services"

const TaskCommentNotify = React.forwardRef(function TaskCommentNotify(props, ref) {
    const { data = {}, id, type = ENotifyComponentType.snackbar, onClickNotify } = props
    const [notify, setNotify] = useState(data)
    const content = JSON.parse(notify?.content) || {}
    const { closeSnackbar } = useSnackbar()
    const { t } = useTranslation()

    const renderTaskItem = (classContent) => {
        return <Grid container gap={1} flexWrap='nowrap'>
            <Grid item>
                <LabelIconControl icon={content.TaskContent.TaskType.Icon} color={content.TaskContent.TaskType.Color} />
            </Grid>
            <Grid item className={`notify-content main-content ${classContent}`}>
                {content.TaskContent.Title}
            </Grid>
        </Grid>
    }

    const getTitleNotify = () => {
        if (notify.type === ENotifyObjectType.taskComment) {
            return ` ${t('mentioned you in a comment')}`
        } else {
            return ` ${t('assign task to you')}`
        }
    }

    const renderContent = (isRenderPopover = false) => {
        let classContent = ''
        if (isRenderPopover === true) {
            if (notify.isRead !== true) {
                classContent = 'unread'
            }
        }
        return <Grid gap={1} container direction={'column'}>
            <Grid item>
                <span className={`notify-mention ${classContent}`}>{content.UserMention.FullName}</span>
                <span className={`notify-title ${classContent}`}>{getTitleNotify()}</span>
            </Grid>
            <Grid item>
                {renderTaskItem(classContent)}
            </Grid>
            {
                isRenderPopover === true ? <Grid item>{getFormatDateDistance(notify.createdDate)}
                </Grid> : ''
            }
        </Grid>
    }

    const getFormatDateDistance = (date) => {
        return formatDistanceDate(date)
    }

    const getTaskUrl = () => {
        return getPathItem(`/task/edit/${content.TaskContent.Id}?viewId=${notify.objectId}`)
    }

    const renderContentPopover = () => {
        return <Grid container item xs gap={2} className='no-wrap align-items-center' justifyContent={'space-between'}>
            <Grid item>
                <AvatarControl name={content.UserMention.FullName} image={content.UserMention.Image} />
            </Grid>
            <Grid item xs className='notify-content'>
                {renderContent(true)}
            </Grid>
            {
                notify.isRead !== true ? <Grid item>
                    <StatusIcon />
                </Grid> : ''
            }
        </Grid >
    }

    const onNotifyClick = () => {
        put(baseUrl.jm_notifyUser, { id: notify.id, isRead: true })
        let updateNotify = { ...notify }
        updateNotify.isRead = true
        setNotify({ ...updateNotify })
        onClickNotify && onClickNotify(updateNotify)
    }

    const renderComponent = () => {
        if (type === ENotifyComponentType.snackbar) {
            return <Grid className='notify-container' ref={ref} container gap={2}>
                <Grid item>
                    <AvatarControl name={content.UserMention.FullName} image={content.UserMention.Image} />
                </Grid>
                <Grid item className='notify-content'>
                    <LinkControl onClick={onNotifyClick} className='notify-link' href={getTaskUrl()} title={renderContent()} />
                </Grid>
                <ButtonIcon showTooltip={false} className='close-notify-icon' type={EButtonIconType.close} onClick={() => closeSnackbar(id)} />
            </Grid>
        } else {
            return <Grid container gap={2} className='notify-list-container'>
                <Grid item xs>
                    <LinkControl onClick={onNotifyClick} className='notify-link' href={getTaskUrl()} title={renderContentPopover()} />
                </Grid>
            </Grid>

        }
    }

    return renderComponent()
})

export default TaskCommentNotify