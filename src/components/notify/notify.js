import React, { useState, useEffect, useRef } from 'react'
import Grid from "@mui/material/Grid"
import { Dropdown } from 'react-bootstrap'
import { PopoverControl } from 'components/popover'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import { ENotifyComponentType } from "configs"
import TaskCommentNotify from 'components/snackbar/taskCommentNotify'
import { useTranslation } from "react-i18next"
import eventEmitter from 'helpers/eventEmitter'
import { newNotify, setNotifyData } from "stores/views/master"
import { useSelector, useDispatch } from "react-redux"
import { get } from "services"
import { baseUrl } from "configs"
import axios from 'axios'
import _ from 'lodash'

const Notify = (props) => {
    const { } = props
    const notifyData = useSelector((state) => state.master.notifyData)
    const [notifyItems, setNotifyItems] = useState(notifyData?.items || [])
    const [notifyUnread, setNotifyUnread] = useState(notifyData?.unread || 0)
    const currentPage = notifyData?.currentPage || 0
    const [anchorOpen, setAnchorOpen] = useState(null)
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()
    const { t } = useTranslation()
    const notifyContainerRef = useRef(null)
    const cancelToken = useRef(null)
    const lengthRowNotify = 10

    useEffect(() => {
        eventEmitter.on('newNotify', onNewNotify)

        return () => {
            eventEmitter.off('newNotify')
            if (cancelToken?.current) {
                cancelToken.current.cancel()
            }
        }
    }, [])

    useEffect(() => {
        if (!_.isNil(notifyData)) {
            setNotifyItems(notifyData?.items || [])
            setNotifyUnread(notifyData?.unread || 0)
        }
    }, [notifyData])

    const onNewNotify = (item) => {
        dispatch(newNotify(item))
    }

    const renderNotifyItem = (item) => {
        let data = _.cloneDeep(item)
        return <TaskCommentNotify onClickNotify={onClickNotify} key={item.id} data={data} type={ENotifyComponentType.popover} />
    }

    const onClickNotify = (item) => {
        setNotifyUnread(notifyUnread > 0 ? notifyUnread - 1 : 0)
    }

    const handleScroll = async () => {
        const containerHeight = notifyContainerRef.current.scrollHeight
        const scrollPosition = notifyContainerRef.current.scrollTop + notifyContainerRef.current.offsetHeight

        if (scrollPosition >= containerHeight) {
            console.log('Đã scroll xuống cuối thẻ <div>!')
            if (notifyData.total > notifyItems.length && loading === false) {
                await getNotifies()
            }
        }
    }

    const getNotifies = async () => {
        cancelToken.current = new axios.CancelToken.source()
        setLoading(true)
        await get(baseUrl.jm_notifyUser, {
            start: currentPage ? currentPage * (_.isNil(lengthRowNotify) ? 10 : lengthRowNotify) : 0,
            length: lengthRowNotify,
        }, cancelToken).then((data) => {
            const moreNotifyData = {
                items: [...notifyData.items, ...data.data.items],
                total: data.recordsTotal,
                currentPage: notifyData.currentPage + 1
            }
            dispatch(setNotifyData(moreNotifyData))
            setLoading(false)
        })
    }

    const renderNotifyPopup = () => {
        return <Grid container item xs direction={'column'} className='no-wrap'>
            <Grid item>
                <Grid container item xs gap={2} className='body-content'>
                    <Grid item>
                        <h2>{t('Notify')}</h2>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item className='flex overflow-hidden'>
                <div ref={notifyContainerRef} onScroll={handleScroll} className='notify-tab-body no-wrap flex-grow'>
                    <Grid container item xs gap={3} direction={'column'} className='body-content'>
                        {
                            _.map(notifyItems, (x) => {
                                return renderNotifyItem(x)
                            })
                        }
                    </Grid>
                </div>
            </Grid>
        </Grid>
    }

    const genderPopoverControl = () => {
        return renderNotifyPopup()
    }

    const handleClickNotify = (event) => {
        if (anchorOpen != null) {
            setAnchorOpen(null)
        } else {
            setAnchorOpen(event.currentTarget)
        }
    }

    const handleCloseNotify = () => {
        setAnchorOpen(null)
    }

    const getNotifyNumberUnread = () => {
        if (notifyUnread == 0) return
        let unread = notifyUnread
        if (unread > 9) {
            unread = '9+'
        }
        return <span className="badge">{unread}</span>
    }

    return <>
        <ClickAwayListener onClickAway={handleCloseNotify}>
            <Dropdown alignRight>
                <Dropdown.Toggle onClick={handleClickNotify} className="nav-link count-indicator hide-carret">
                    <i className="mdi mdi-bell-outline"></i>
                    {getNotifyNumberUnread()}
                </Dropdown.Toggle>
            </Dropdown>
        </ClickAwayListener>
        <PopoverControl
            anchorEl={anchorOpen}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}
            onClose={handleCloseNotify}
            genderBody={genderPopoverControl}
            className='notify-tab-content'
        >
        </PopoverControl>
    </>
}

export default Notify