import React, { useEffect, useState } from 'react'
import { Link, withRouter, useHistory } from 'react-router-dom'
import { Collapse } from 'react-bootstrap'
import { getUserInfo, deepFindAll, getProjectPath, setUserInfo } from "helpers"
import { EMenuType, constants, baseUrl } from "configs"
import { useSelector } from "react-redux"
import _ from 'lodash'
import { useTranslation } from "react-i18next"
import { setActionActive, setUserSetting } from "stores/views/master"
import { useDispatch } from "react-redux"
import SelectControl from 'components/select/SelectControl'
import { useForm } from "react-hook-form"
import { save } from "services"

const Sidebar = (props) => {
    const { location } = props
    const [state, setState] = useState({})
    const history = useHistory()
    const userFromState = { ...useSelector((state) => state.master.userSetting) }
    const menu = useSelector((state) => state.menu.menu)
    const getUser = () => {
        return !_.isEmpty(userFromState) ? userFromState : getUserInfo()
    }
    let user = getUser()
    let userInfo = getUserInfo()
    const viewPermissions = user.viewPermissions
    const { t } = useTranslation()
    const dispatch = useDispatch()

    const {
        control
    } = useForm()

    useEffect(() => {
        onRouteChanged()
    }, [location])

    useEffect(() => {
        onRouteChanged()
        // add className 'hover-open' to sidebar navitem while hover in sidebar-icon-only menu
        const body = document.querySelector('body')
        document.querySelectorAll('.sidebar .nav-item').forEach((el) => {
            el.addEventListener('mouseover', function () {
                if (body.classList.contains('sidebar-icon-only')) {
                    el.classList.add('hover-open')
                }
            })
            el.addEventListener('mouseout', function () {
                if (body.classList.contains('sidebar-icon-only')) {
                    el.classList.remove('hover-open')
                }
            })
        })
    })

    const getPathItem = (item) => {
        let path = item.path
        if (item.isHasProjectPath) {
            path = getProjectPath(path)
        }
        if (user) {
            const defaultOrganization = user.defaultOrganization?.code
            return !_.isNil(defaultOrganization) ? `/${defaultOrganization}${path}` : `${path}`
        }
        return path
    }

    const toggleMenuState = (menuState) => {
        if (state[menuState]) {
            setState({ ...state, [menuState]: false })
        } else if (Object.keys(state).length === 0) {
            setState({ ...state, [menuState]: true })
        } else {
            setState({ ...state, [menuState]: true })
        }
    }

    const onRouteChanged = () => {
        document.querySelector('#sidebar').classList.remove('active')
    }

    const isPathActive = (path) => {
        return location.pathname.startsWith(path)
    }

    const isPathActiveCollapse = (items) => {
        let isActive = false
        _.map(items, (item) => {
            const path = getPathItem(item)
            if (location.pathname === path) {
                isActive = true
                return isActive
            }
        })
        return isActive
    }

    const getAriaExpanded = (menuState) => {
        return state[menuState]
    }

    const onActionClick = (action) => {
        dispatch(setActionActive(action.key))
    }

    const renderMenuItem = (item, isChild = false) => {
        switch (item.type) {
            case EMenuType.group:
                const childGroups = deepFindAll(item.childs, function (obj) {
                    return _.isEqual(_.toLower(obj.parent), _.toLower(item.key))
                }, 'childs')
                const childKeys = _.map(childGroups, (x) => { return _.toLower(x.key) })
                const isActiveGroup = _.some(viewPermissions, (x) => _.includes(childKeys, _.toLower(x.view)) && _.find(x.actions, (a) => _.isEqual(a.key, constants.view) && a.value === true))
                return isActiveGroup || user.isMainAccount ? <>
                    <li key={item.key} className="nav-item nav-category"><span>{t(item.title)}</span></li>
                    {
                        _.map(item.childs, (child) => {
                            return renderMenuItem(child)
                        })
                    }
                </> : ''
            case EMenuType.action:
                const isActiveAction = _.some(viewPermissions, (x) => _.isEqual(_.toLower(x.view), _.toLower(item.key)) && _.find(x.actions, (a) => _.isEqual(a.key, constants.view) && a.value === true))
                return isActiveAction || user.isMainAccount ? <li key={item.key} className={`nav-item ${isChild === false ? (isPathActiveCollapse([item]) ? 'active' : '') : ''}`}>
                    <Link onClick={() => onActionClick(item)} className={`nav-link ${isChild == true ? (isPathActiveCollapse([item]) ? 'active' : '') : ''}`} to={getPathItem(item)}>
                        {!_.isEmpty(item.icon) ? <span className="icon-bg"><i className={`${item.icon} menu-icon`}></i></span> : ''}
                        <span className={`menu-title ${isChild === true ? 'item' : ''}`}>{t(item.title)}</span>
                    </Link>
                </li> : ''
            case EMenuType.collapse:
                const childCollapses = deepFindAll(item.childs, function (obj) {
                    return _.isEqual(_.toLower(obj.parent), _.toLower(item.key))
                }, 'childs')
                const childCollapseKeys = _.map(childCollapses, (x) => { return _.toLower(x.key) })
                const isActiveCollapse = _.some(viewPermissions, (x) => _.includes(childCollapseKeys, _.toLower(x.view)) && _.find(x.actions, (a) => _.isEqual(a.key, constants.view) && a.value === true))
                return isActiveCollapse || user.isMainAccount ? <li key={item.key} className={isPathActiveCollapse(item.childs) ? 'nav-item active' : 'nav-item'}>
                    <div aria-expanded={getAriaExpanded(item.key)} className={getAriaExpanded(item.key) ? 'nav-link menu-expanded' : 'nav-link'} onClick={() => toggleMenuState(item.key)} data-toggle="collapse">
                        {!_.isEmpty(item.icon) ? <span className="icon-bg"><i className={`${item.icon} menu-icon`}></i></span> : ''}
                        <span className="menu-title">{t(item.title)}</span>
                        <i className="menu-arrow"></i>
                    </div>
                    <Collapse in={getAriaExpanded(item.key)}>
                        <ul className="nav flex-column sub-menu">
                            {
                                _.map(item.childs, (child) => {
                                    return renderMenuItem(child, true)
                                })
                            }
                        </ul>
                    </Collapse>
                </li> : ''
            default:
                break
        }
    }

    const renderMenu = () => {
        return <nav className="sidebar sidebar-offcanvas" id="sidebar">
            <ul className="nav">{_.map(menu, (item) => renderMenuItem(item))}</ul>
        </nav>
    }

    const onProjectChange = (value) => {
        const item = _.find(userInfo?.projects, (x) => x.id === value.value)
        if (!_.isNil(item)) {
            save(`${baseUrl.jm_user}/me`, { id: userInfo.userId, configs: [{ key: 'ProjectSetting.Current', value: item.code }, { key: 'ProjectSetting.CurrentId', value: item.id }] })
            userInfo.setting.projectSetting.current = item.code
            userInfo.setting.projectSetting.currentId = item.id
            dispatch(setUserSetting({ setting: { projectSetting: { current: item.code, currentId: item.id } } }))
            setUserInfo({ user: userInfo })
            history.push(`/${userInfo.defaultOrganization.code}/${item.code}/overview/summary`)
        }
    }

    const renderProjectByUser = () => {
        return <SelectControl
            onChange={onProjectChange}
            options={user.projects}
            control={control}
            defaultValue={user?.setting?.projectSetting?.currentId}
            name='projects'
        />
    }

    return <div className="flex-column">
        {renderProjectByUser()}
        {renderMenu()}
    </div>
}

export default withRouter(Sidebar)