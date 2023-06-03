import { useState, useEffect, useRef } from 'react'
import Grid from "@mui/material/Grid"
import { Dropdown } from 'react-bootstrap'
import { CustomPopoverControl } from 'components/popover'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import { ENotifyComponentType } from "configs"
import TaskCommentNotify from 'components/snackbar/taskCommentNotify'
import { useTranslation } from "react-i18next"
import eventEmitter from 'helpers/eventEmitter'
import { newNotify, setNotifyData } from "stores/components/notify"
import { useSelector, useDispatch } from "react-redux"
import { get } from "services"
import { baseUrl } from "configs"
import Box from '@mui/material/Box'
import axios from 'axios'
import { NotifyLoading, NotifyActionButton, NotifyEmpty } from './components'
import _ from 'lodash'

const Notify = (props) => {
    const { user } = props
    const notifyData = useSelector((state) => state.notify.notifyData)
    const isReload = useSelector((state) => state.notify.isReload)
    const [notifyItems, setNotifyItems] = useState(notifyData?.items || [])
    const [notifyUnread, setNotifyUnread] = useState(notifyData?.unread || 0)
    const currentPage = notifyData?.currentPage || 0
    const [anchorOpen, setAnchorOpen] = useState(null)
    const [isAll, setIsAll] = useState(null)
    const [loadingMore, setLoadingMore] = useState(false)
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()
    const { t } = useTranslation()
    const notifyContainerRef = useRef(null)
    const cancelToken = useRef(null)
    const lengthRowLoadMore = 10
    const lengthRowLoadDefault = 20

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

    useEffect(() => {
        setNotifyItems([])
        if (!_.isNil(isAll)) {
            getNotifies(false)
        }
    }, [isAll, isReload])

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
            if (notifyData.total > notifyItems.length && loadingMore === false) {
                await getNotifies()
            }
        }
    }

    const getNotifies = async (isGetMore = true) => {
        cancelToken.current = new axios.CancelToken.source()
        if (isGetMore === true) {
            setLoadingMore(true)
        } else {
            setLoading(true)
        }
        await get(baseUrl.jm_notifyUser, {
            start: isGetMore === true ? (currentPage ? currentPage * (_.isNil(lengthRowLoadMore) ? 10 : lengthRowLoadMore) : 0) : 0,
            length: isGetMore === true ? lengthRowLoadMore : lengthRowLoadDefault,
            isRead: isAll === false ? false : null
        }, cancelToken).then((data) => {
            if (isGetMore === true) {
                const moreNotifyData = {
                    items: [...notifyData.items, ...data.data.items],
                    total: data.recordsTotal,
                    currentPage: notifyData.currentPage + 1
                }
                dispatch(setNotifyData(moreNotifyData))
                setLoadingMore(false)
            } else {
                const notifyData = { ...data.data, total: data.recordsTotal, currentPage: 2 }
                dispatch(setNotifyData(notifyData))
                setLoading(false)
            }
        })
    }

    const onChangeNotifyAction = (isAll = true) => {
        setIsAll(isAll)
    }

    const renderNotifyPopup = () => {
        const currentDate = new Date()
        const today = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 0, 0, 0)

        const lstNotifyToday = _.filter(notifyItems, (x) => new Date(x.createdDate).getDate() === currentDate.getDate() &&
            new Date(x.createdDate).getMonth() === currentDate.getMonth() &&
            new Date(x.createdDate).getFullYear() === currentDate.getFullYear())

        const lstNotifyBefore = _.filter(notifyItems, (x) => new Date(x.createdDate) < today)

        return <Grid container item xs direction={'column'} className='no-wrap'>
            <Grid item>
                <Grid container item xs gap={2} direction={'column'} className='body-content'>
                    <Grid item container justifyContent={'space-between'}>
                        <Grid item>
                            <h2>{t('Notify')}</h2>
                        </Grid>
                        <Grid item>
                            <NotifyActionButton user={user} />
                        </Grid>
                    </Grid>
                    <Grid container item xs gap={2}>
                        <Grid item>
                            <span onClick={() => onChangeNotifyAction()} className={`notify-action ${isAll !== false ? 'active' : ''}`}>{t('All')}</span>
                        </Grid>
                        <Grid item>
                            <span onClick={() => onChangeNotifyAction(false)} className={`notify-action ${isAll === false ? 'active' : ''}`}>{t('Unread')}</span>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item className='flex overflow-hidden'>
                {
                    loading === true ? <NotifyLoading /> : (!_.isEmpty(notifyItems) ? <div ref={notifyContainerRef} onScroll={handleScroll} className='notify-tab-body no-wrap flex-grow'>
                        <Grid container item xs gap={2} direction={'column'} className='body-content'>
                            {
                                !_.isEmpty(lstNotifyToday) ? <Grid container item xs gap={1} direction={'column'}>
                                    <Grid item className='notify-group-title'>{t('Today')}</Grid>
                                    <Grid item container xs gap={3}>
                                        {
                                            _.map(lstNotifyToday, (x) => {
                                                return renderNotifyItem(x)
                                            })
                                        }
                                    </Grid>
                                </Grid> : ''
                            }
                            {
                                !_.isEmpty(lstNotifyBefore) ? <Grid container gap={1} item xs direction={'column'}>
                                    <Grid item className='notify-group-title'>{t('Before')}</Grid>
                                    <Grid item container xs gap={3}>
                                        {
                                            _.map(lstNotifyBefore, (x) => {
                                                return renderNotifyItem(x)
                                            })
                                        }
                                    </Grid>
                                </Grid> : ''
                            }
                        </Grid>
                    </div> : <NotifyEmpty />)
                }
            </Grid>
        </Grid>
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
        <Dropdown alignRight>
            <Dropdown.Toggle onClick={handleClickNotify} className="nav-link count-indicator hide-carret">
                <i className="mdi mdi-bell-outline"></i>
                {getNotifyNumberUnread()}
            </Dropdown.Toggle>
        </Dropdown>
        {!_.isNil(anchorOpen) ? <ClickAwayListener onClickAway={handleCloseNotify}>
            <Box>
                <CustomPopoverControl
                    anchorEl={anchorOpen}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }}
                    onClose={handleCloseNotify}
                    genderBody={renderNotifyPopup}
                    className='notify-tab-content'
                >
                </CustomPopoverControl>
            </Box>
        </ClickAwayListener> : ''}
    </>
}

export default Notify